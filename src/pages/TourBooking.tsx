import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useGet } from '../hooks/useGet';
import { useLocalized } from '../hooks/useLocale';
import { useAuth } from '../context/AuthContext';
import TourCalendar from '../components/shared/TourCalendar';
import api from '../api/axios';
import type { Tour, TourSlot, TourBooking as TourBookingType } from '../types';

export default function TourBooking() {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('tour');
  const { pick } = useLocalized();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [selectedSlot, setSelectedSlot] = useState<TourSlot | null>(null);
  const [qtyAdult, setQtyAdult] = useState(1);
  const [qtyChild, setQtyChild] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/connexion', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: tour, isLoading } = useGet<Tour>(
    `tour-${tourId ?? ''}`,
    `/tours/${tourId ?? ''}`
  );

  const priceAdult = tour ? Number(tour.price_adult) : 0;
  const priceChild = tour ? Number(tour.price_child) : 0;
  const total = (qtyAdult * priceAdult + qtyChild * priceChild).toFixed(2);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedSlot) {
      setError(t('booking.selectSlotFirst'));
      return;
    }
    if (qtyAdult < 1) {
      setError(t('booking.minAdult'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<{ message: string; booking: TourBookingType }>('/tour-bookings', {
        tour_slot_id: selectedSlot.id,
        qty_adult: qtyAdult,
        qty_child: qtyChild,
      });
      navigate('/tour/confirmation', { state: { booking: res.data.booking } });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? t('common:error'));
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2" />
        <div className="animate-pulse h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!tour) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back */}
        <Link to="/tour" className="text-sm text-[#0A2342] hover:text-[#C8A951] transition-colors">
          {t('booking.backToTours')}
        </Link>

        {/* Title */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-1">
          <h1 className="text-2xl font-extrabold text-[#0A2342]">
            {t('booking.title')}
          </h1>
          <p className="text-gray-600">{pick(tour.name_ru, tour.name_en)}</p>
          <div className="flex gap-4 text-sm text-gray-500 pt-1">
            <span>
              {t('priceAdult')}: <span className="font-semibold text-[#0A2342]">{priceAdult.toFixed(2)} €</span>
            </span>
            <span>
              {t('priceChild')}: <span className="font-semibold text-[#0A2342]">{priceChild.toFixed(2)} €</span>
            </span>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TourCalendar
            tourId={tour.id}
            selectedSlotId={selectedSlot?.id}
            onSlotSelect={setSelectedSlot}
          />
        </div>

        {/* Quantities + total */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* Selected slot display */}
          {selectedSlot && (
            <div className="flex items-center gap-2 text-sm text-[#0A2342] bg-blue-50 px-3 py-2 rounded-xl">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">
                {String(selectedSlot.date).substring(0, 10)} — {selectedSlot.start_time}
              </span>
            </div>
          )}

          {/* Adults */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {t('booking.qtyAdult')}
              <span className="ml-1 text-xs text-gray-400">({priceAdult.toFixed(2)} €)</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQtyAdult((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-[#0A2342] transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{qtyAdult}</span>
              <button
                type="button"
                onClick={() => setQtyAdult((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-[#0A2342] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {t('booking.qtyChild')}
              <span className="ml-1 text-xs text-gray-400">({priceChild.toFixed(2)} €)</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQtyChild((q) => Math.max(0, q - 1))}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-[#0A2342] transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{qtyChild}</span>
              <button
                type="button"
                onClick={() => setQtyChild((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-[#0A2342] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <span className="font-semibold text-gray-700">{t('booking.total')}</span>
            <span className="text-xl font-extrabold text-[#0A2342]">{total} €</span>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#C0392B] hover:bg-[#a93226] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {submitting ? t('booking.submitting') : t('booking.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
