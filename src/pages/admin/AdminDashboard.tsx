import { Link } from 'react-router-dom';

const sections = [
  { label: 'Joueurs', to: '/admin/joueurs', desc: 'Gérer l\'effectif' },
  { label: 'Matchs', to: '/admin/matchs', desc: 'Gérer le calendrier et les résultats' },
  { label: 'Articles', to: '/admin/articles', desc: 'Gérer les actualités' },
  { label: 'Produits', to: '/admin/produits', desc: 'Gérer la boutique' },
  { label: 'Utilisateurs', to: '/admin/utilisateurs', desc: 'Gérer les membres' },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Administrateur</h1>
      <p className="text-gray-500 mb-8">FC Dynamo City — Gestion du contenu</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <Link key={s.label} to={s.to} className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition-shadow hover:border-blue-300">
            <h2 className="text-lg font-bold text-blue-800 mb-1">{s.label}</h2>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
