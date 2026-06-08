import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const { t } = useTranslation('common');
  const { locale, toggleLanguage } = useLanguage();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-[#C8A951]' : 'hover:text-[#C8A951] transition-colors';

  return (
    <nav className="bg-[#0A2342] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold tracking-wide text-[#C8A951]">
          ⚡ FC Dynamo City
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" end className={linkClass}>{t('nav.home')}</NavLink>
          <NavLink to="/club" className={linkClass}>{t('nav.club')}</NavLink>
          <NavLink to="/equipe" className={linkClass}>{t('nav.team')}</NavLink>
          <NavLink to="/actualites" className={linkClass}>{t('nav.news')}</NavLink>
          <NavLink to="/matchs" className={linkClass}>{t('nav.matches')}</NavLink>
          <NavLink to="/boutique" className={linkClass}>{t('nav.shop')}</NavLink>
          <NavLink to="/billets" className={linkClass}>{t('nav.tickets')}</NavLink>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-[#1E3A5F] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2C5F8A] transition-colors"
            title={t('nav.language')}
          >
            {locale === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
          </button>

          {isAuthenticated ? (
            <>
              <NavLink to="/mon-espace" className="hover:text-[#C8A951]">
                {user?.first_name ?? user?.name}
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="bg-[#C8A951] text-[#0A2342] px-3 py-1 rounded font-semibold hover:brightness-110">
                  {t('nav.admin')}
                </NavLink>
              )}
              <button onClick={logout} className="hover:text-[#C8A951]">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion" className="hover:text-[#C8A951]">{t('nav.login')}</NavLink>
              <NavLink to="/inscription" className="bg-[#C8A951] text-[#0A2342] px-3 py-1 rounded font-semibold hover:brightness-110">
                {t('nav.register')}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
