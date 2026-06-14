import { useLocation, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalized } from '../hooks/useLocale';
import type { TourBooking } from '../types';

interface LocationState {
  booking?: TourBooking;
}

export default function TourBookingConfirmation() {
  const { t } = useTranslation('tour');
  const { pick, formatDate } = useLocalized();
  const location = useLocation();
  const { booking } = (location.state as LocationState) ?? {};

  if (!booking) return <Navigate to="/tour" replace />;

  const slot = booking.tourSlot;
  const tour = slot?.tour;
  const dateStr = slot ? String(slot.date).substring(0, 10) : '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A2342] text-white text-center py-10 px-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold mb-1">{t('confirmation.title')}</h1>
          <p className="text-gray-300 text-sm">{t('confirmation.subtitle')}</p>
        </div>

        {/* Booking details */}
        <div className="p-6 space-y-3">
          {tour && (
            <Row label={t('confirmation.tour')} value={pick(tour.name_ru, tour.name_en)} />
          )}
          {dateStr && (
            <Row label={t('confirmation.date')} value={formatDate(dateStr)} />
          )}
          {slot?.start_time && (
            <Row label={t('confirmation.time')} value={slot.start_time} />
          )}
          <Row label={t('confirmation.qtyAdult')} value={String(booking.qty_adult)} />
          {booking.qty_child > 0 && (
            <Row label={t('confirmation.qtyChild')} value={String(booking.qty_child)} />
          )}
          <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3">
            <span className="font-semibold text-gray-700">{t('confirmation.total')}</span>
            <span className="text-xl font-extrabold text-[#0A2342]">
              {Number(booking.total).toFixed(2)} €
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <Link
            to="/mon-espace/excursions"
            className="block w-full text-center bg-[#0A2342] hover:bg-[#1E3A5F] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {t('confirmation.myBookings')}
          </Link>
          <Link
            to="/tour"
            className="block w-full text-center border border-gray-200 hover:bg-gray-50 text-[#0A2342] font-semibold py-3 rounded-xl transition-colors"
          >
            {t('confirmation.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-[#0A2342]">{value}</span>
    </div>
  );
}
