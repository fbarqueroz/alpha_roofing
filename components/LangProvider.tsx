"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { COPY, type CopyShape, type Lang } from "@/lib/content";
import { LANG_COOKIE, META } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  t: CopyShape;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({ lang: "en", t: COPY.en, setLang: () => {}, toggle: () => {} });
export const useLang = () => useContext(LangContext);

/* El idioma inicial llega del servidor (/en o /es, elegido por proxy.ts según
   el navegador). Al cambiarlo a mano se guarda en una cookie por 1 año y se
   actualiza la URL sin recargar la página. */
export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
    document.title = META[l].title;
    window.history.replaceState(window.history.state, "", `/${l}${window.location.hash}`);
  };
  const toggle = () => setLang(lang === "en" ? "es" : "en");

  return <LangContext.Provider value={{ lang, t: COPY[lang], setLang, toggle }}>{children}</LangContext.Provider>;
}
