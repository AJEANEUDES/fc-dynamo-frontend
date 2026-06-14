import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import { useLocalized } from '../hooks/useLocale';
import type { Tour } from '../types';

export default function StadiumTour() {
  const { t } = useTranslation('tour');
  const { pick } = useLocalized();

  const { data: tours, isLoading } = useGet<Tour[]>('tours', '/tours');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">
            <svg className="w-16 h-16 mx-auto text-[#C8A951]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">{t('title')}</h1>
          <p className="text-lg text-gray-300">{t('subtitle')}</p>
        </div>
      </section>

      {/* Tour listings */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-72 shadow" />
            ))}
          </div>
        ) : !tours || tours.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{t('noTours')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} pick={pick} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface TourCardProps {
  tour: Tour;
  pick: (ru: string, en?: string | null) => string;
  t: (key: string) => string;
}

function TourCard({ tour, pick, t }: TourCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-[#0A2342] flex items-center justify-center overflow-hidden">
        {tour.image && !imgError ? (
          <img
            src={tour.image}
            alt={pick(tour.name_ru, tour.name_en)}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-16 h-16 text-[#C8A951]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )}
        <div className="absolute top-3 right-3 bg-[#C8A951] text-[#0A2342] text-xs font-bold px-2 py-1 rounded-lg">
          {tour.duration_minutes} min
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h2 className="text-lg font-bold text-[#0A2342]">
          {pick(tour.name_ru, tour.name_en)}
        </h2>
        <p className="text-sm text-gray-600 flex-1 line-clamp-3">
          {pick(tour.description_ru, tour.description_en)}
        </p>

        {/* Prices */}
        <div className="flex gap-4 text-sm text-gray-700">
          <span>
            {t('priceAdult')} —{' '}
            <span className="font-bold text-[#0A2342]">{Number(tour.price_adult).toFixed(2)} €</span>
          </span>
          <span>
            {t('priceChild')} —{' '}
            <span className="font-bold text-[#0A2342]">{Number(tour.price_child).toFixed(2)} €</span>
          </span>
        </div>

        <Link
          to={`/tour/${tour.id}/reserver`}
          className="block w-full text-center bg-[#C0392B] hover:bg-[#a93226] text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          {t('bookNow')}
        </Link>
      </div>
    </div>
  );
}
