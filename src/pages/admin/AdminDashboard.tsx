import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';

interface DashboardStats {
  users_count: number;
  players_count: number;
  matches_count: number;
  articles_count: number;
  products_count: number;
  orders_count: number;
  orders_total: number;
  tickets_count: number;
  tickets_total: number;
  upcoming_matches: number;
}

const NAV_CARDS = [
  { key: 'players', to: '/admin/joueurs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'matches', to: '/admin/matchs', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
  { key: 'articles', to: '/admin/articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { key: 'products', to: '/admin/produits', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { key: 'users', to: '/admin/utilisateurs', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { key: 'tours', to: '/admin/visites', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
];

export default function AdminDashboard() {
  const { t } = useTranslation('admin');
  const { data: stats } = useGet<DashboardStats>('admin-stats', '/admin/dashboard/stats');

  const statCards = stats ? [
    { key: 'users', value: stats.users_count },
    { key: 'players', value: stats.players_count },
    { key: 'matches', value: stats.matches_count },
    { key: 'articles', value: stats.articles_count },
    { key: 'products', value: stats.products_count },
    { key: 'orders', value: stats.orders_count },
    { key: 'ordersTotal', value: `${stats.orders_total.toFixed(0)} €` },
    { key: 'tickets', value: stats.tickets_count },
    { key: 'ticketsTotal', value: `${stats.tickets_total.toFixed(0)} €` },
    { key: 'upcomingMatches', value: stats.upcoming_matches },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-[#0A2342] text-white rounded-2xl px-8 py-8">
          <h1 className="text-3xl font-extrabold tracking-tight">{t('title')}</h1>
          <p className="text-gray-300 mt-1">{t('subtitle')}</p>
        </div>

        {/* Stats grid */}
        {statCards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map(({ key, value }) => (
              <div key={key} className="bg-white rounded-2xl shadow p-5 text-center">
                <p className="text-2xl font-extrabold text-[#0A2342]">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{t(`stats.${key}`)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NAV_CARDS.map(({ key, to, icon }) => (
            <Link
              key={key}
              to={to}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl hover:border-[#0A2342] border-2 border-transparent transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2342] flex items-center justify-center shrink-0 group-hover:bg-[#C0392B] transition-colors">
                <svg className="w-6 h-6 text-[#C8A951]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0A2342] group-hover:text-[#C0392B] transition-colors">
                  {t(`nav.${key}`)}
                </h2>
              </div>
              <svg className="w-5 h-5 text-gray-300 ml-auto group-hover:text-[#C0392B] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
