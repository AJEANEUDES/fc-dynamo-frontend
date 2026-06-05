import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MemberDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon espace</h1>
      <p className="text-gray-500 mb-8">Bienvenue, {user?.name} ({user?.role})</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/mon-espace/billets" className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-blue-800 mb-2">Mes billets</h2>
          <p className="text-gray-500 text-sm">Voir l'historique de vos billets achetés.</p>
        </Link>
        <Link to="/mon-espace/commandes" className="bg-white border rounded-xl p-6 shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-blue-800 mb-2">Mes commandes</h2>
          <p className="text-gray-500 text-sm">Consulter vos commandes de la boutique.</p>
        </Link>
      </div>
    </div>
  );
}
