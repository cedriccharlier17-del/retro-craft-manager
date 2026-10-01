'use client';
import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
type Item={id:number;name:string;type:string;level:number};
type Detail=Item & {stats?:string[];recipe?:{item_id:number;name:string;qty:number}[]};

function normalize(value:string){
 return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replace(/[’']/g,"'").trim();
}

export default function ItemSearch({ onCraftAdded }: { onCraftAdded?: () => void }) {
const supabase = createClient();
const workspaceId = '7f9b2fcc-9fda-4734-b5d6-3bc9c410ed5e';
 const [items,setItems]=useState<Item[]>([]),[q,setQ]=useState(''),[selected,setSelected]=useState<Detail|null>(null),[qty,setQty]=useState(1),[loading,setLoading]=useState(false),[catalogLoading,setCatalogLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let alive=true;setCatalogLoading(true);fetch('/api/items',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error(`catalogue ${r.status}`);const data=await r.json();if(!Array.isArray(data))throw new Error('format');if(alive)setItems(data)}).catch(()=>{if(alive)setError('Impossible de charger le catalogue Dofus Rétro.')}).finally(()=>{if(alive)setCatalogLoading(false)});return()=>{alive=false}},[]);
 const results=useMemo(()=>{const s=normalize(q);if(s.length<2)return [];return items.filter(i=>normalize(i.name??'').includes(s)).slice(0,10)},[q,items]);
 async function choose(item:Item){setLoading(true);setError('');setQ(item.name);try{const r=await fetch(`/api/item/${item.id}`,{cache:'no-store'});if(!r.ok)throw new Error('detail');setSelected(await r.json())}catch{setSelected(null);setError('Objet trouvé, mais impossible de charger sa recette.')}finally{setLoading(false)}}
 async function addCraft() {
  if (!selected) return;

  setLoading(true);
  setError('');

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Tu dois être connecté.');
    }

    const { data: item, error: itemError } = await supabase
      .from('items')
      .upsert(
        {
          retro_id: selected.id,
          name: selected.name,
          level: selected.level,
          type: selected.type
        },
        { onConflict: 'retro_id' }
      )
      .select('id')
      .single();

    if (itemError) throw itemError;
    // Enregistrer les ressources et la recette de l'objet
if (selected.recipe && selected.recipe.length > 0) {
  for (const ingredient of selected.recipe) {
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .upsert(
        {
          retro_id: ingredient.item_id,
          name: ingredient.name
        },
        { onConflict: 'retro_id' }
      )
      .select('id')
      .single();

    if (resourceError) throw resourceError;

    const { error: recipeError } = await supabase
      .from('recipes')
      .upsert(
        {
          item_id: item.id,
          resource_id: resource.id,
          quantity: ingredient.qty
        },
        { onConflict: 'item_id,resource_id' }
      );

    if (recipeError) throw recipeError;
  }
}
    const { error: craftError } = await supabase
      .from('crafts')
      .insert({
        workspace_id: workspaceId,
        item_id: item.id,
        quantity: qty,
        status: 'a_craft',
        created_by: user.id
      });

    if (craftError) throw craftError;
    onCraftAdded?.();
    alert(`${selected.name} ajouté aux crafts !`);
  } catch (e) {
    setError(
      e instanceof Error
        ? e.message
        : "Impossible d'ajouter le craft."
    );
  } finally {
    setLoading(false);
  }
}
 const recipe=selected?.recipe??[];
 return <div className="liveSearch">
  <div className="bigsearch"><Search/><input value={q} onChange={e=>{setQ(e.target.value);setSelected(null);setError('')}} placeholder="Voile d'Encre, Kralano..."/>{q&&<button className="clearBtn" onClick={()=>{setQ('');setSelected(null);setError('')}}><X size={15}/></button>}</div>
  {catalogLoading&&<p className="searchState">Chargement du catalogue Dofus Rétro…</p>}
  {error&&<p className="searchState" style={{color:'#e7a85a'}}>{error}</p>}
  {!catalogLoading&&!error&&<p className="searchState">Catalogue chargé : {items.length.toLocaleString('fr-FR')} objets.</p>}
  {!catalogLoading&&!error&&q.trim().length>=2&&!selected&&results.length===0&&<p className="searchState">Aucun objet trouvé pour « {q} ».</p>}
  {!selected&&results.length>0&&<div className="searchResults">{results.map((i,index)=><button key={`${i.id}-${index}`} onClick={()=>choose(i)}><strong>{i.name}</strong><span>{i.type} · Niv. {i.level}</span></button>)}</div>}
  {loading&&<p className="searchState">Chargement de la recette…</p>}
  {selected&&!loading&&<div className="itemDetail"><div className="itemTitle"><div><strong>{selected.name}</strong><span>{selected.type} · Niveau {selected.level}</span></div><label>Quantité <input type="number" min="1" max="999" value={qty} onChange={e=>setQty(Math.max(1,Number(e.target.value)||1))}/></label></div>
   {recipe.length?<div className="recipe"><div className="recipeHead"><span>RESSOURCE</span><span>UNITÉ</span><span>POUR ×{qty}</span></div>{recipe.map((r,index)=><div className="recipeRow" key={`${r.item_id}-${index}`}><b>{r.name}</b><span>{r.qty}</span><strong>{r.qty*qty}</strong></div>)}</div>:<p className="searchState">Cet objet n'a pas de recette renseignée.</p>}
<button
  className="addCraftBtn"
  disabled={!recipe.length || loading}
  onClick={addCraft}
>
  {loading ? 'Ajout...' : '+ Ajouter aux crafts'}
</button>
  </div>}
 </div>
}
