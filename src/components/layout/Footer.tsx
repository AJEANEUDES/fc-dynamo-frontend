import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-[#0A2342] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-[#C8A951] mb-2">FC Dynamo City</h3>
          <p className="text-sm text-blue-200">{t('footer.description')}</p>
        </div>
        <div>
          <h3 className="font-bold text-[#C8A951] mb-2">{t('footer.navigation')}</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li><Link to="/club" className="hover:text-white">{t('nav.club')}</Link></li>
            <li><Link to="/equipe" className="hover:text-white">{t('nav.team')}</Link></li>
            <li><Link to="/matchs" className="hover:text-white">{t('nav.matches')}</Link></li>
            <li><Link to="/boutique" className="hover:text-white">{t('nav.shop')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[#C8A951] mb-2">{t('footer.contact')}</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li><Link to="/contact" className="hover:text-white">{t('footer.contactForm')}</Link></li>
            <li><Link to="/presse" className="hover:text-white">{t('footer.pressArea')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#1E3A5F] text-center text-xs text-blue-300 py-3">
        © 2026 FC Dynamo City. {t('footer.rights')}.
      </div>
    </footer>
  );
}
