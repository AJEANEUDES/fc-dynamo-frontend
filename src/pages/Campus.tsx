import { useTranslation } from 'react-i18next';

const FACILITY_KEYS = ['pitches', 'gym', 'medical', 'recovery'] as const;
type FacilityKey = (typeof FACILITY_KEYS)[number];

const FACILITY_ICONS: Record<FacilityKey, string> = {
  pitches:  'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  gym:      'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z',
  medical:  'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z',
  recovery: 'M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z',
};

export default function Campus() {
  const { t } = useTranslation('campus');

  return (
    <div>
      <div className="bg-[#0A2342] py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{t('title')}</h1>
        <p className="text-[#C8A951] text-lg font-medium">{t('subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-[#0A2342] mb-6">{t('facilities.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITY_KEYS.map((key) => (
              <div
                key={key}
                className="bg-[#0A2342] rounded-2xl p-6 shadow-lg flex flex-col gap-3"
              >
                <svg className="w-8 h-8 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={FACILITY_ICONS[key]} />
                </svg>
                <h3 className="text-white font-bold leading-tight">
                  {t(`facilities.${key}.title`)}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t(`facilities.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0A2342] mb-4">{t('academy.title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('academy.paragraph1')}</p>
          <p className="text-gray-700 leading-relaxed mt-4">{t('academy.paragraph2')}</p>
        </section>
      </div>
    </div>
  );
}
