import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const { t } = useTranslation('common');
  const { locale, toggleLanguage } = useLanguage();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();

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
          {/* Cart button */}
          <Link
            to="/panier"
            className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#1E3A5F] transition-colors"
            aria-label={t('nav.cart')}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C0392B] text-white text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

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
