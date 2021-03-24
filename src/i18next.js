
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import yaml from 'js-yaml';
const Languages = ["en", "fr", "pt"];

export default i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    whitelist: Languages,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.yaml',
      parse: function(data) { return yaml.load(data) },
    },
/*     resources: {
        en: {
          translation: {
            "appTitle": "hello world"
          }
        }
      } */
  });