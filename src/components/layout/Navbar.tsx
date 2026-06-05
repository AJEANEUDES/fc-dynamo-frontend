import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold tracking-wide">
          ⚡ FC Dynamo City
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'text-yellow-300' : 'hover:text-yellow-200'}>Accueil</NavLink>
          <NavLink to="/club" className={({ isActive }) => isActive ? 'text-yellow-300' : 'hover:text-yellow-200'}>Le Club</NavLink>
          <NavLink to="/equipe" className={({ isActive }) => isActive ? 'text-yellow-300' : 'hover:text-yellow-200'}>Équipe</NavLink>
          <NavLink to="/actualites" className={({ isActive }) => isActive ? 'text-yellow-300' : 'hover:text-yellow-200'}>Actualités</NavLink>
          <NavLink to="/matchs" className={({ isActive }) => isActive ? 'text-yellow-300' : 'hover:text-yellow-200'}>Matchs</NavLink>
          <NavLink to="/boutique" className={({ isActive }) => isActive ? 'text-yellow-300' : 'hover:text-yellow-200'}>Boutique</NavLink>
          <NavLink to="/billets" className={({ isActive }) => isActive ? 'text-yellow-300' : 'hover:text-yellow-200'}>Billets</NavLink>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <NavLink to="/mon-espace" className="hover:text-yellow-200">
                {user?.name}
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="bg-yellow-400 text-blue-900 px-3 py-1 rounded font-semibold hover:bg-yellow-300">
                  Admin
                </NavLink>
              )}
              <button onClick={logout} className="hover:text-yellow-200">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion" className="hover:text-yellow-200">Connexion</NavLink>
              <NavLink to="/inscription" className="bg-yellow-400 text-blue-900 px-3 py-1 rounded font-semibold hover:bg-yellow-300">
                S'inscrire
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
