import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from '../hooks/useApi';
import type { Trophy } from '../types';
import { useLocalized } from '../hooks/useLocale';

function TrophyCard({ trophy }: { trophy: Trophy }) {
  const { pick } = useLocalized();
  const [imgError, setImgError] = useState(false);
  const title = pick(trophy.title_ru, trophy.title_en);

  return (
    <div className="bg-[#0A2342] rounded-2xl overflow-hidden shadow-lg">
      <div className="relative h-40 bg-gradient-to-br from-[#1E3A5F] to-[#0A2342]">
        {trophy.image && !imgError ? (
          <img
            src={trophy.image}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#C8A951]/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <h3 className="text-white font-bold leading-tight">{title}</h3>
        <span className="bg-[#C8A951] text-[#0A2342] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          {trophy.season}
        </span>
      </div>
    </div>
  );
}

export default function Club() {
  const { t } = useTranslation('club');
  const { data: trophies, isLoading } = useGet<Trophy[]>(['trophies'], '/trophies');

  return (
    <div>
      <div className="bg-[#0A2342] py-16 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{t('title')}</h1>
        <p className="text-[#C8A951]">{t('subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-[#0A2342] mb-6">{t('trophies.title')}</h2>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">{t('common:loading')}</div>
          ) : trophies && trophies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trophies.map((trophy) => (
                <TrophyCard key={trophy.id} trophy={trophy} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">{t('common:notFound')}</div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0A2342] mb-4">{t('history.title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('history.paragraph1')}</p>
          <p className="text-gray-700 leading-relaxed mt-4">{t('history.paragraph2')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0A2342] mb-6">{t('values.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <p className="text-gray-700 leading-relaxed">{t('values.excellence')}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <p className="text-gray-700 leading-relaxed">{t('values.passion')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
