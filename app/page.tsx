import { Hammer, Package, ShoppingCart, Coins, Search, Plus } from 'lucide-react';
import './globals.css';

const crafts = [
  { name: "Voile d'Encre", qty: 3, status: 'À craft', progress: 82 },
  { name: 'Kralano', qty: 2, status: 'En FM', progress: 100 },
  { name: 'Annolamour', qty: 4, status: 'À craft', progress: 61 },
];

export default function Home() {
  return <main>
    <aside className="sidebar"><div className="brand"><Hammer size={24}/><div><b>Retro Craft</b><span>Manager</span></div></div>
      <nav><a className="active">Dashboard</a><a>⚒️ Crafts</a><a>📦 Stock</a><a>🛒 Achats</a><a>💰 Rentabilité</a><a>✨ FM</a></nav>
      <div className="online"><i/> Stock partagé actif</div>
    </aside>
    <section className="content">
      <header><div><h1>Dashboard</h1><p>Gestion partagée de vos crafts Dofus Rétro</p></div><button><Plus size={18}/> Nouveau craft</button></header>
      <div className="cards">
        <Card icon={<Hammer/>} label="Crafts en cours" value="9" sub="3 prêts à fabriquer"/>
        <Card icon={<Package/>} label="Valeur du stock" value="48,6 M" sub="kamas estimés"/>
        <Card icon={<ShoppingCart/>} label="À acheter" value="12,4 M" sub="37 ressources"/>
        <Card icon={<Coins/>} label="Marge estimée" value="+31,8 M" sub="sur les crafts actifs"/>
      </div>
      <div className="panel">
        <div className="panelHead"><div><h2>Crafts en cours</h2><p>Suivi de la production commune</p></div><div className="search"><Search size={17}/><input placeholder="Rechercher un item..."/></div></div>
        <div className="table"><div className="tr head"><span>ITEM</span><span>QTÉ</span><span>RESSOURCES</span><span>STATUT</span></div>
        {crafts.map(c=><div className="tr" key={c.name}><strong>{c.name}</strong><span>× {c.qty}</span><span><div className="progress"><i style={{width:`${c.progress}%`}}/></div>{c.progress}%</span><span className="badge">{c.status}</span></div>)}</div>
      </div>
      <div className="bottom"><div className="panel"><h2>Ressources manquantes</h2><p className="muted">Regroupées pour tous les crafts actifs</p><div className="missing"><b>Étoffe de Maître Pandore</b><span>17 à acheter</span></div><div className="missing"><b>Étoffe de Péki</b><span>8 à acheter</span></div><div className="missing"><b>Étoffe de Meulou</b><span>31 à acheter</span></div></div>
      <div className="panel"><h2>Recherche Dofus Rétro</h2><p className="muted">Ajoutez un équipement depuis la base d'items.</p><div className="bigsearch"><Search/><input placeholder="Voile d'Encre, Kralano..."/></div><small>La recette sera récupérée automatiquement et comparée au stock.</small></div></div>
    </section>
  </main>
}
function Card({icon,label,value,sub}:{icon:React.ReactNode,label:string,value:string,sub:string}) { return <div className="card"><div className="ico">{icon}</div><div><span>{label}</span><b>{value}</b><small>{sub}</small></div></div> }
