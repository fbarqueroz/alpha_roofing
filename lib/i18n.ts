import type { Lang } from "./content";

export const LOCALES: Lang[] = ["en", "es"];
export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

export const isLang = (v: unknown): v is Lang => v === "en" || v === "es";

/* Elige idioma a partir del encabezado Accept-Language del navegador,
   respetando el orden de preferencia y los pesos q=. */
export function pickLang(acceptLanguage: string | null | undefined): Lang {
  if (!acceptLanguage) return DEFAULT_LANG;
  const prefs = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { base: tag.split("-")[0], q: q ? parseFloat(q.split("=")[1]) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const hit = prefs.find((p) => isLang(p.base));
  return hit ? (hit.base as Lang) : DEFAULT_LANG;
}

export const META: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Alpha Roofing & Gutters | Central Illinois Roofing, Gutters & Siding",
    description:
      "Licensed Central Illinois roofing, gutter and siding contractor. Owners on every job and free, no-pressure estimates.",
  },
  es: {
    title: "Alpha Roofing & Gutters | Techos, Canales y Siding en el Centro de Illinois",
    description:
      "Contratista con licencia de techos, canales y siding en el centro de Illinois. Los dueños en cada obra y estimados gratis, sin presión.",
  },
};
