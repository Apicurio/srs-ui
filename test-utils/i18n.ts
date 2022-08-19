import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const kafkai18n = i18n.createInstance();

kafkai18n.use(initReactI18next).init({
  detection: {
    order: ['htmlTag', 'navigator'],
    caches: [],
  },
  fallbackLng: 'en',
  debug: false,

  interpolation: {
    escapeValue: false,
  },
  resources: {},
});

export default kafkai18n;