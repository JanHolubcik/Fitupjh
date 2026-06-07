import type { I18nConfig } from "next-i18next/proxy";

const i18nConfig: I18nConfig = {
  supportedLngs: ["en", "sk"],
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "dashboard"],
  // Recommended: works on all platforms including Vercel/serverless
  resourceLoader: (language, namespace) =>
    import(`./i18n/locales/${language}/${namespace}.json`),
};

export default i18nConfig;
