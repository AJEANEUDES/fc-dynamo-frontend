import { useTranslation } from 'react-i18next';
import { useGet } from '../../hooks/useApi';
import { useLocalized } from '../../hooks/useLocale';
import type { TourBooking } from '../../types';

export default function MyTourBookings() {
  const { t } = useTranslation('tour');
  const { pick, formatDate } = useLocalized();

  const { data: bookings, isLoading } = useGet<TourBooking[]>('my-tour-bookings', '/tour-bookings');

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl h-28 shadow" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-extrabold text-[#0A2342] mb-6">
        {t('myBookings.title')}
      </h1>

      {!bookings || bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <svg className="w-14 h-14 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-gray-500">{t('myBookings.empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const slot = booking.tourSlot;
            const tour = slot?.tour;
            const dateStr = slot ? String(slot.date).substring(0, 10) : '';

            return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-5 flex items-start gap-5">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#0A2342] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#C8A951]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  {tour && (
                    <p className="font-bold text-[#0A2342] truncate">
                      {pick(tour.name_ru, tour.name_en)}
                    </p>
                  )}
                  {slot && (
                    <p className="text-sm text-gray-600">
                      {dateStr ? formatDate(dateStr) : ''}{slot.start_time ? ` — ${slot.start_time}` : ''}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-1">
                    <span>
                      {t('myBookings.qtyAdult')}: <span className="font-semibold text-gray-700">{booking.qty_adult}</span>
                    </span>
                    {booking.qty_child > 0 && (
                      <span>
                        {t('myBookings.qtyChild')}: <span className="font-semibold text-gray-700">{booking.qty_child}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status + price */}
                <div className="text-right shrink-0 space-y-1">
                  <StatusBadge status={booking.status} />
                  <p className="text-sm font-bold text-[#0A2342]">
                    {t('myBookings.total')}: {Number(booking.total).toFixed(2)} €
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation('common');
  const styles: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending:   'bg-orange-100 text-orange-700',
    cancelled: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {t(`status.${status}`, { defaultValue: status })}
    </span>
  );
}
