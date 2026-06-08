import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Confirmation() {
  const { t } = useTranslation('auth');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('confirmation.title')}</h1>
        <p className="text-gray-500 mb-6">{t('confirmation.subtitle')}</p>
        <Link
          to="/mon-espace"
          className="inline-block bg-[#0A2342] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#1E3A5F]"
        >
          {t('confirmation.cta')}
        </Link>
      </div>
    </div>
  );
}
