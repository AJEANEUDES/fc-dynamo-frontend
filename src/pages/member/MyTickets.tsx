import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import type { Ticket } from '../../types';
import { useLocalized } from '../../hooks/useLocale';

export default function MyTickets() {
  const { t } = useTranslation('tickets');
  const { data: tickets, isLoading } = useGet<Ticket[]>('tickets', '/tickets');
  const { formatDate } = useLocalized();

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400 text-lg">{t('common:loading')}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#0A2342] mb-8">{t('myTickets.title')}</h1>

      {!tickets?.length ? (
        <div className="text-center py-20 text-gray-400 text-lg">{t('myTickets.empty')}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <h3 className="font-extrabold text-[#0A2342] text-base leading-tight">
                  FC Dynamo City — {ticket.match?.opponent ?? '—'}
                </h3>
                {ticket.match?.match_date && (
                  <p className="text-gray-400 text-sm mt-1">
                    {formatDate(ticket.match.match_date, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {ticket.match?.stadium && (
                  <p className="text-gray-400 text-xs mt-0.5">{ticket.match.stadium}</p>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-[#C0392B] font-extrabold text-lg">
                  {Number(ticket.total_price).toFixed(2)} €
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {t('myTickets.quantity')}: {ticket.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
