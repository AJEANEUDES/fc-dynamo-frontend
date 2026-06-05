import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-yellow-300 mb-2">FC Dynamo City</h3>
          <p className="text-sm text-blue-200">Club de football fictif fondé en 1985. Passion, travail, victoire.</p>
        </div>
        <div>
          <h3 className="font-bold text-yellow-300 mb-2">Navigation</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li><Link to="/club" className="hover:text-white">Le Club</Link></li>
            <li><Link to="/equipe" className="hover:text-white">L'Équipe</Link></li>
            <li><Link to="/matchs" className="hover:text-white">Matchs</Link></li>
            <li><Link to="/boutique" className="hover:text-white">Boutique</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-yellow-300 mb-2">Contact</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li><Link to="/contact" className="hover:text-white">Formulaire de contact</Link></li>
            <li><Link to="/presse" className="hover:text-white">Espace presse</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-700 text-center text-xs text-blue-300 py-3">
        © 2026 FC Dynamo City. Tous droits réservés.
      </div>
    </footer>
  );
}
