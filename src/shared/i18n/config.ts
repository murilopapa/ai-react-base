import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en_US, pt_BR } from '@/shared/i18n/translations';

i18n.use(initReactI18next).init({
  resources: {
    en_US: {
      translation: en_US,
    },
    pt_BR: {
      translation: pt_BR,
    },
  },
  fallbackLng: 'en_US',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
