import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FootballMatch, Ticket } from '../types';
import { useLocalized } from '../hooks/useLocale';

interface LocationState {
  ticket?: Ticket;
  match?: FootballMatch;
}

export default function TicketConfirmation() {
  const { t } = useTranslation('tickets');
  const { ticket, match } = ((useLocation().state as LocationState) ?? {});
  const { formatDate } = useLocalized();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-[#0A2342] mb-2">{t('confirmation.title')}</h1>
        <p className="text-gray-400 mb-6">{t('confirmation.subtitle')}</p>

        {ticket && match && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <p className="font-bold text-[#0A2342] text-sm leading-tight">
              FC Dynamo City — {match.opponent}
            </p>
            {match.match_date && (
              <p className="text-gray-400 text-xs mt-1">
                {formatDate(match.match_date, { day: 'numeric', month: 'long', year: 'numeric' })}
                {match.stadium ? ` · ${match.stadium}` : ''}
              </p>
            )}
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between text-sm">
              <span className="text-gray-500">{t('confirmation.quantity')}</span>
              <span className="font-bold text-[#0A2342]">{ticket.quantity}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">{t('confirmation.total')}</span>
              <span className="font-extrabold text-[#C0392B]">
                {Number(ticket.total_price).toFixed(2)} €
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            disabled
            className="w-full py-3 bg-[#C8A951] text-[#0A2342] font-bold rounded-xl opacity-60 cursor-not-allowed"
          >
            {t('confirmation.download')} (PDF)
          </button>
          <Link
            to="/mon-espace/billets"
            className="block w-full py-3 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#0d2e5a] transition-colors"
          >
            {t('confirmation.myTickets')}
          </Link>
          <Link
            to="/billetterie"
            className="block w-full py-3 border-2 border-[#0A2342] text-[#0A2342] font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t('confirmation.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}
