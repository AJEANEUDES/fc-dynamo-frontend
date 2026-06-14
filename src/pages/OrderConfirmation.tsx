import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Order } from '../types';

interface LocationState {
  order?: Order;
}

export default function OrderConfirmation() {
  const { t } = useTranslation('shop');
  const location = useLocation();
  const { order } = ((location.state as LocationState) ?? {});

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        {/* Check icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-[#0A2342] mb-2">{t('confirmation.title')}</h1>
        <p className="text-gray-500 mb-6">{t('confirmation.subtitle')}</p>

        {order && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              {t('confirmation.orderNumber')}
            </p>
            <p className="font-mono text-sm text-[#0A2342] break-all">{order.id}</p>
            <p className="text-[#C0392B] font-extrabold text-xl mt-3">
              {Number(order.total).toFixed(2)} €
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/boutique"
            className="block w-full py-3 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#0d2e5a] transition-colors"
          >
            {t('confirmation.continueShopping')}
          </Link>
          <Link
            to="/mon-espace/commandes"
            className="block w-full py-3 border-2 border-[#0A2342] text-[#0A2342] font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t('confirmation.myOrders')}
          </Link>
        </div>
      </div>
    </div>
  );
}
