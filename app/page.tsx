'use client';

import { useEffect, useState } from 'react';

import {
  Hammer,
  Package,
  ShoppingCart,
  Coins,
  Search,
  Plus,
} from "lucide-react";

import "./globals.css";
import ItemSearch from "./components/ItemSearch";
import { createClient } from "../lib/supabase/client";

export default function Home() {
const supabase = createClient();

const [crafts, setCrafts] = useState<
  { name: string; qty: number; status: string; progress: number }[]
>([]);
  const [missingResources, setMissingResources] = useState<
  { name: string; qty: number }[]
>([]);
async function loadCrafts() {
  const { data, error } = await supabase
    .from('crafts')
    .select(`
      id,
      quantity,
      status,
      items (
        name
      )
    `)
    .eq('workspace_id', '7f9b2fcc-9fda-4734-b5d6-3bc9c410ed5e')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur chargement crafts:', error);
    return;
  }

  const grouped = new Map<
    string,
    { name: string; qty: number; status: string; progress: number }
  >();

  (data ?? []).forEach((craft: any) => {
    const name = craft.items?.name ?? 'Objet inconnu';

    const status =
      craft.status === 'a_craft'
        ? 'À craft'
        : craft.status === 'fm'
        ? 'En FM'
        : craft.status;

    const key = `${name}-${status}`;

    const existing = grouped.get(key);

    if (existing) {
      existing.qty += craft.quantity;
    } else {
      grouped.set(key, {
        name,
        qty: craft.quantity,
        status,
        progress: 0,
      });
    }
  });

  setCrafts(Array.from(grouped.values()));
}

useEffect(() => {
  loadCrafts();
  loadMissingResources();
}, []);
  function goToNewCraft() {
    const section = document.getElementById("new-craft");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      const input = section?.querySelector("input") as HTMLInputElement | null;
      input?.focus();
    }, 400);
  }
 async function loadMissingResources() {
  const { data, error } = await supabase
    .from('crafts')
    .select(`
      quantity,
      items (
        recipes (
          quantity,
          resources (
            name
          )
        )
      )
    `)
    .eq('workspace_id', '7f9b2fcc-9fda-4734-b5d6-3bc9c410ed5e')
    .eq('status', 'a_craft');

  if (error) {
    console.error('Erreur ressources:', error);
    return;
  }

  const totals = new Map<string, number>();

  (data ?? []).forEach((craft: any) => {
    const recipes = craft.items?.recipes ?? [];

    recipes.forEach((recipe: any) => {
      const name = recipe.resources?.name;
      if (!name) return;

      const needed = recipe.quantity * craft.quantity;
      totals.set(name, (totals.get(name) ?? 0) + needed);
    });
  });

  setMissingResources(
    Array.from(totals.entries())
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  );
}
  return (
    <main>
      <aside className="sidebar">
        <div className="brand">
          <div>
            <Hammer size={24} />
          </div>
          <div>
            <b>Retro Craft</b>
            <span>Manager</span>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>🛠️ Crafts</a>
          <a href="/stock">📦 Stock</a>
          <a>🛒 Achats</a>
          <a>💰 Rentabilité</a>
          <a>✨ FM</a>
        </nav>

        <div className="online">
          <i /> Stock partagé actif
        </div>
      </aside>

      <section className="content">
        <header>
          <div>
            <h1>Dashboard</h1>
            <p>Gestion partagée de vos crafts Dofus Rétro</p>
          </div>

          <button onClick={goToNewCraft}>
            <Plus size={18} />
            Nouveau craft
          </button>
        </header>

        <div className="cards">
          <Card
            icon={<Hammer />}
            label="Crafts en cours"
            value="9"
            sub="3 prêts à fabriquer"
          />

          <Card
            icon={<Package />}
            label="Valeur du stock"
            value="48,6 M"
            sub="kamas estimés"
          />

          <Card
            icon={<ShoppingCart />}
            label="À acheter"
            value="12,4 M"
            sub="37 ressources"
          />

          <Card
            icon={<Coins />}
            label="Marge estimée"
            value="+31,8 M"
            sub="sur les crafts actifs"
          />
        </div>

        <div className="panel head">
          <div>
            <h2>Crafts en cours</h2>
            <p>Suivi de la production commune</p>
          </div>

          <div className="search">
            <Search size={17} />
            <input placeholder="Rechercher un item..." />
         <div className="craftList">
  {crafts.length === 0 ? (
    <p>Aucun craft en cours</p>
  ) : (
    crafts.map((craft, index) => (
      <div className="craftRow" key={index}>
        <strong>{craft.name}</strong>
        <span>× {craft.qty}</span>
        <span>{craft.status}</span>
      </div>
    ))
  )}
</div>
          </div>
        </div>

        <div className="table">
          <div className="tr head">
            <span>ITEM</span>
            <span>QTÉ</span>
            <span>RESSOURCES</span>
            <span>STATUT</span>
          </div>

          {crafts.map((c) => (
            <div className="tr" key={c.name}>
              <strong>{c.name}</strong>

              <span>× {c.qty}</span>

              <span>
                <div className="progress">
                  <i style={{ width: `${c.progress}%` }} />
                </div>
                {c.progress}%
              </span>

              <span className="badge">{c.status}</span>
            </div>
          ))}
        </div>

        <div className="bottom">
          <div className="panel">
            <h2>Ressources manquantes</h2>
            <p className="muted">Regroupées pour tous les crafts actifs</p>

        {missingResources.length === 0 ? (
  <p className="muted">Aucune ressource à acheter.</p>
) : (
  missingResources.map((resource) => (
    <div className="missing" key={resource.name}>
      <b>{resource.name}</b>
      <span>{resource.qty} à acheter</span>
    </div>
  ))
)}
</div>
          <div className="panel" id="new-craft">
            <h2>Recherche Dofus Rétro</h2>

            <p className="muted">
              Recherche réelle dans la base Dofus Rétro 1.29.
            </p>

          <ItemSearch
  onCraftAdded={() => {
    loadCrafts();
    loadMissingResources();
  }}
/>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card">
      <div className="ico">{icon}</div>

      <div>
        <span>{label}</span>
        <b>{value}</b>
        <small>{sub}</small>
      </div>
    </div>
  );
}
