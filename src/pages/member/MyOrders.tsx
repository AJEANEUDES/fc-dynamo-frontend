import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useLocalized } from '../../hooks/useLocale';
import type { Order } from '../../types';

const STATUS_STYLES: Record<Order['status'], string> = {
  pending:   'bg-orange-100 text-orange-700',
  paid:      'bg-green-100 text-green-700',
  shipped:   'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function MyOrders() {
  const { t } = useTranslation('member');
  const { formatDate } = useLocalized();

  const { data: orders, isLoading } = useGet<Order[]>('orders', '/orders');

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl h-24 shadow" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/mon-espace" className="text-sm text-[#0A2342] hover:text-[#C8A951] transition-colors">
          {t('orders.backToDashboard')}
        </Link>
        <h1 className="text-2xl font-extrabold text-[#0A2342] mt-1">{t('orders.title')}</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <svg className="w-14 h-14 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-500">{t('orders.empty')}</p>
          <Link to="/boutique" className="inline-block mt-4 text-sm font-semibold text-[#C0392B] hover:underline">
            → Boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-5">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#0A2342] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#C8A951]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-bold text-[#0A2342]">
                  {t('orders.order')} #{order.id.substring(0, 8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.created_at, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Status + total */}
              <div className="text-right shrink-0 space-y-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                  {t(`orders.status.${order.status}`)}
                </span>
                <p className="text-base font-extrabold text-[#0A2342]">
                  {Number(order.total).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
