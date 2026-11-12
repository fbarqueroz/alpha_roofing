"use client";

import { motion } from "motion/react";
import type { Lang } from "@/lib/content";
import { useLang } from "./LangProvider";

/* Selector EN | ES: muestra ambos idiomas y marca el activo */
export function LangSwitch({ id }: { id: string }) {
  const { lang, setLang } = useLang();
  const opts: { v: Lang; label: string; name: string }[] = [
    { v: "en", label: "EN", name: "English" },
    { v: "es", label: "ES", name: "Español" },
  ];
  return (
    <div className="langswitch" role="radiogroup" aria-label="Language / Idioma">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={lang === o.v}
          title={o.name}
          className={lang === o.v ? "is-on" : ""}
          onClick={() => lang !== o.v && setLang(o.v)}
        >
          {lang === o.v && (
            <motion.span layoutId={`lang-${id}`} className="langswitch__bg" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
          )}
          <span className="langswitch__label">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
