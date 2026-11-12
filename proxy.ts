import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LANG_COOKIE, isLang, pickLang } from "@/lib/i18n";

/* Sin idioma en la URL → redirige a /en o /es.
   1) idioma elegido a mano (cookie)  2) idioma del navegador (Accept-Language). */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLang(first)) return NextResponse.next();

  const saved = request.cookies.get(LANG_COOKIE)?.value;
  const lang = isLang(saved) ? saved : pickLang(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  const res = NextResponse.redirect(url);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|img|favicon|.*\..*).*)"],
};
