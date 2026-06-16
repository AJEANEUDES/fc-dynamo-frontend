import { useTranslation } from 'react-i18next';
import { useLocalized } from '../hooks/useLocale';

interface PressItem {
  title: string;
  date: string;
}

export default function Press() {
  const { t } = useTranslation('common');
  const { formatDate } = useLocalized();

  const items = t('press.items', { returnObjects: true }) as PressItem[];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2342]">{t('press.title')}</h1>
          <p className="text-gray-500 mt-1">{t('press.subtitle')}</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between bg-white rounded-2xl shadow-lg px-5 py-4 hover:shadow-xl transition-shadow"
            >
              <div>
                <p className="font-semibold text-[#0A2342]">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(item.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <a
                href="#"
                className="text-[#C0392B] font-semibold text-sm hover:underline shrink-0 ml-4"
              >
                {t('press.download')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
