import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import en from '../locales/en.json';
import es from '../locales/es.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetectorPlugin = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async function (callback: (lang: string) => void) {
    try {
      let language = null;
      if (Platform.OS === 'web') {
        language = localStorage.getItem(STORE_LANGUAGE_KEY);
      } else {
        language = await SecureStore.getItemAsync(STORE_LANGUAGE_KEY);
      }
      if (language) {
        return callback(language);
      } else {
        return callback('es'); // Default to Spanish
      }
    } catch (error) {
      console.log('Error reading language', error);
      return callback('es');
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(STORE_LANGUAGE_KEY, language);
      } else {
        await SecureStore.setItemAsync(STORE_LANGUAGE_KEY, language);
      }
    } catch (error) {
      console.log('Error caching language', error);
    }
  },
};

i18n
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
