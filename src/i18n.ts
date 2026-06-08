import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ruCommon from './locales/ru/common.json';
import ruHome from './locales/ru/home.json';
import ruTeam from './locales/ru/team.json';
import ruMatches from './locales/ru/matches.json';
import ruNews from './locales/ru/news.json';
import ruShop from './locales/ru/shop.json';
import ruAuth from './locales/ru/auth.json';
import ruAdmin from './locales/ru/admin.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enTeam from './locales/en/team.json';
import enMatches from './locales/en/matches.json';
import enNews from './locales/en/news.json';
import enShop from './locales/en/shop.json';
import enAuth from './locales/en/auth.json';
import enAdmin from './locales/en/admin.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en'],
    ns: ['common', 'home', 'team', 'matches', 'news', 'shop', 'auth', 'admin'],
    defaultNS: 'common',
    resources: {
      ru: { common: ruCommon, home: ruHome, team: ruTeam, matches: ruMatches,
            news: ruNews, shop: ruShop, auth: ruAuth, admin: ruAdmin },
      en: { common: enCommon, home: enHome, team: enTeam, matches: enMatches,
            news: enNews, shop: enShop, auth: enAuth, admin: enAdmin },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
