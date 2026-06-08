import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

type Locale = 'ru' | 'en';

interface LanguageContextType {
  locale: Locale;
  toggleLanguage: () => void;
  isRussian: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'ru',
  toggleLanguage: () => {},
  isRussian: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<Locale>(
    (localStorage.getItem('fc_lang') as Locale) ?? 'ru'
  );

  useEffect(() => {
    i18n.changeLanguage(locale);
    api.defaults.headers.common['Accept-Language'] = locale;
    localStorage.setItem('fc_lang', locale);
  }, [locale, i18n]);

  const toggleLanguage = () => {
    setLocale((prev) => (prev === 'ru' ? 'en' : 'ru'));
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, isRussian: locale === 'ru' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
