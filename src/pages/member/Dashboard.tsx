import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLocalized } from '../../hooks/useLocale';

const ROLE_STYLES: Record<string, string> = {
  admin:       'bg-red-100 text-red-700',
  staff:       'bg-purple-100 text-purple-700',
  journaliste: 'bg-yellow-100 text-yellow-700',
  membre:      'bg-blue-100 text-blue-700',
  visiteur:    'bg-gray-100 text-gray-600',
};

const CARDS = [
  {
    key: 'tickets',
    to: '/mon-espace/billets',
    icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'orders',
    to: '/mon-espace/commandes',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    color: 'bg-green-50 text-green-600',
  },
  {
    key: 'tours',
    to: '/mon-espace/excursions',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    key: 'profile',
    to: '/mon-espace/profil',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    color: 'bg-purple-50 text-purple-600',
  },
];

export default function MemberDashboard() {
  const { t } = useTranslation('member');
  const { user } = useAuth();
  const { formatDate } = useLocalized();

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.name || '';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome banner */}
        <div className="bg-[#0A2342] text-white rounded-2xl px-8 py-8 flex items-center gap-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#C8A951] flex items-center justify-center text-[#0A2342] text-2xl font-extrabold shrink-0">
            {displayName.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold truncate">
              {t('dashboard.welcome')}, {displayName}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {user?.role && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {user.role}
                </span>
              )}
              {user?.created_at && (
                <span className="text-sm text-gray-300">
                  {t('dashboard.memberSince')} {formatDate(user.created_at, { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick access cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CARDS.map(({ key, to, icon, color }) => (
            <Link
              key={key}
              to={to}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl border-2 border-transparent hover:border-[#0A2342] transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-[#0A2342] group-hover:text-[#C0392B] transition-colors">
                  {t(`dashboard.cards.${key}`)}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">{t(`dashboard.cards.${key}Desc`)}</p>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[#C0392B] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
