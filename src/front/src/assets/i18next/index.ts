import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import common_en from "./languages/en/translate.json";
import common_ru from "./languages/ru/translate.json";

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        supportedLngs: ["en", "ru"],
        fallbackLng: "en",
        resources: {
            en: { common: common_en },
            ru: { common: common_ru },
        },
        ns: ["common"],
        defaultNS: "common",
        detection: {
            order: ["path", "subdomain", "localStorage", "cookie", "htmlTag"],
            caches: ["localStorage"],
        },
        backend: {
            loadPath: "./languages/{{lng}}/translate.json",
        },
        react: { useSuspense: false },
    });
