import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enUS from "./locales/en-US.json";
import trTR from "./locales/tr-TR.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        detection: {
            order: ['navigator'],
            caches: ['localStorage'],
        },
        resources: {
            en: { translation: enUS },
            tr: { translation: trTR }
        },
        fallbackLng: "tr",
        interpolation: {
            escapeValue: false,
        },
    });
