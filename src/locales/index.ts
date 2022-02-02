import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hr from './hr.json';
import en from './en.json';

const language = localStorage.getItem('lang') ?? 'en';
i18n.use(initReactI18next).init({
  lng: language,
  resources: { hr, en },
  fallbackLng: ['en', 'hr'],
  returnEmptyString: false,
  debug: true,
  defaultNS: 'global',
  fallbackNS: 'global',
  ns: ['global'],

  interpolation: {
    escapeValue: false, // Not needed for react
  },
});

export default i18n;
