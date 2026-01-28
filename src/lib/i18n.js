import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../locales/en.json";
import es from "../locales/es.json";

const LOCALES = { en, es };
const DEFAULT = "en";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem("locale") || DEFAULT;
    } catch (e) {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
    } catch (e) {}
  }, [locale]);

  const t = (key, fallback) => {
    const dict = LOCALES[locale] || LOCALES[DEFAULT];
    return dict[key] ?? fallback ?? key;
  };

  const value = useMemo(() => ({ locale, setLocale, t, locales: Object.keys(LOCALES) }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export default { I18nProvider, useI18n };
