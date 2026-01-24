import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';

// Define resources
const resources = {
  en: { common: enCommon },
  es: { common: esCommon },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,

    // Default language
    fallbackLng: 'en',

    // Default namespace
    defaultNS: 'common',

    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],

      // Cache user language on
      caches: ['localStorage'],

      // Keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      // React already does escaping
      escapeValue: false,
    },

    // Development options
    debug: false, // Set to false to reduce console warnings

    // Namespace separator
    nsSeparator: ':',

    // Key separator
    keySeparator: '.',

    // Additional options to reduce warnings
    saveMissing: false,
    missingKeyHandler: false,
    parseMissingKeyHandler: false,
  });

export default i18n;
