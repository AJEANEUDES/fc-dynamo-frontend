import { useLanguage } from '../context/LanguageContext';

export function useLocalized() {
  const { locale } = useLanguage();

  function pick(ru: string, en?: string | null): string {
    return locale === 'en' && en ? en : ru;
  }

  function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
    const intl = locale === 'ru' ? 'ru-RU' : 'en-GB';
    return new Date(dateStr).toLocaleDateString(intl, options ?? {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  return { locale, pick, formatDate };
}
