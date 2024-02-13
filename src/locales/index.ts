import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hr from './hr.json';
import en from './en.json';
import bg from './bg.json';
import de from './de.json';
import nl from './nl.json';

const language = localStorage.getItem('lang') ?? 'en';
i18n.use(initReactI18next).init({
  lng: language,
  resources: { hr, en, bg, de, nl },
  fallbackLng: ['en', 'hr', 'bg', 'de', 'nl'],
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
