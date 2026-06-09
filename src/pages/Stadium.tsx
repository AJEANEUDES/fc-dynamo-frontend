import { useTranslation } from 'react-i18next';

const STAT_KEYS = ['capacity', 'opened', 'surface', 'location'] as const;
type StatKey = (typeof STAT_KEYS)[number];

const STAT_ICONS: Record<StatKey, string> = {
  capacity: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  opened:   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  surface:  'M17 12h-5v5h5v-5zM3 3h18v2H3zm0 14h18v2H3zM3 8h18v2H3zm0 5h2v2H3zm16 0h2v2h-2zM3 13h2v-2H3zm16 0h2v-2h-2z',
  location: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
};

export default function Stadium() {
  const { t } = useTranslation('stadium');

  return (
    <div>
      <div className="bg-[#0A2342] py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{t('title')}</h1>
        <p className="text-[#C8A951] text-lg font-medium">{t('subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_KEYS.map((key) => (
              <div
                key={key}
                className="bg-[#0A2342] rounded-2xl p-6 text-center shadow-lg flex flex-col items-center gap-3"
              >
                <svg className="w-7 h-7 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={STAT_ICONS[key]} />
                </svg>
                <p className="text-[#C8A951] text-xs font-bold uppercase tracking-widest">
                  {t(`stats.${key}`)}
                </p>
                <p className="text-white font-bold text-lg leading-tight">
                  {t(`stats.${key}Value`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0A2342] mb-4">{t('about.title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('about.paragraph1')}</p>
          <p className="text-gray-700 leading-relaxed mt-4">{t('about.paragraph2')}</p>
        </section>
      </div>
    </div>
  );
}
