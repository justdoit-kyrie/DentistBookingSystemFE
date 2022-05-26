import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import EN from '~/translate/en.json';
import VI from '~/translate/vi.json';
import { getLocalStorageWithoutParse } from '~/utils';
import { LANGUAGE_KEY } from './constants';

const resources = {
  en: {
    translation: EN
  },
  vi: {
    translation: VI
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: getLocalStorageWithoutParse(LANGUAGE_KEY),
    debug: true,

    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
