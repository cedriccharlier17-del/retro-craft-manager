'use client';
import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

type Item={id:number;name:string;type:string;level:number};
type Detail=Item & {stats?:string[];recipe?:{item_id:number;name:string;qty:number}[]};

export default function ItemSearch(){
 const [items,setItems]=useState<Item[]>([]),[q,setQ]=useState(''),[selected,setSelected]=useState<Detail|null>(null),[qty,setQty]=useState(1),[loading,setLoading]=useState(false);
 useEffect(()=>{fetch('https://wiki.moon-bot.io/api/items.json').then(r=>r.json()).then(setItems).catch(()=>setItems([]))},[]);
 const results=useMemo(()=>{const s=q.trim().toLocaleLowerCase('fr'); if(s.length<2)return []; return items.filter(i=>i.name.toLocaleLowerCase('fr').includes(s)).slice(0,8)},[q,items]);
 async function choose(item:Item){setLoading(true);setQ(item.name);try{const r=await fetch(`https://wiki.moon-bot.io/api/item/${item.id}.json`);setSelected(await r.json())}finally{setLoading(false)}}
 const recipe=selected?.recipe??[];
 return <div className="liveSearch">
  <div className="bigsearch"><Search/><input value={q} onChange={e=>{setQ(e.target.value);setSelected(null)}} placeholder="Voile d'Encre, Kralano..."/>{q&&<button className="clearBtn" onClick={()=>{setQ('');setSelected(null)}}><X size={15}/></button>}</div>
  {!selected&&results.length>0&&<div className="searchResults">{results.map(i=><button key={i.id} onClick={()=>choose(i)}><strong>{i.name}</strong><span>{i.type} · Niv. {i.level}</span></button>)}</div>}
  {loading&&<p className="searchState">Chargement de la recette…</p>}
  {selected&&!loading&&<div className="itemDetail"><div className="itemTitle"><div><strong>{selected.name}</strong><span>{selected.type} · Niveau {selected.level}</span></div><label>Quantité <input type="number" min="1" max="999" value={qty} onChange={e=>setQty(Math.max(1,Number(e.target.value)||1))}/></label></div>
   {recipe.length?<div className="recipe"><div className="recipeHead"><span>RESSOURCE</span><span>UNITÉ</span><span>POUR ×{qty}</span></div>{recipe.map(r=><div className="recipeRow" key={r.item_id}><b>{r.name}</b><span>{r.qty}</span><strong>{r.qty*qty}</strong></div>)}</div>:<p className="searchState">Cet objet n'a pas de recette renseignée.</p>}
   <button className="addCraftBtn" disabled={!recipe.length}>+ Ajouter aux crafts</button><small>La recette affichée provient de la base communautaire Dofus Rétro. L'enregistrement partagé sera branché à l'étape suivante.</small>
  </div>}
  {!q&&<small>Recherchez un équipement : sa vraie recette Dofus Rétro sera affichée automatiquement.</small>}
 </div>
}
