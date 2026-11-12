import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Oswald } from "next/font/google";
import { LOCALES, META, isLang } from "@/lib/i18n";
import "./globals.css";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-oswald" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  const m = META[isLang(lang) ? lang : "en"];
  return {
    title: m.title,
    description: m.description,
    alternates: { languages: { en: "/en", es: "/es", "x-default": "/" } },
    icons: {
      icon: [{ url: "/img/favicon.svg", type: "image/svg+xml" }, { url: "/img/favicon.ico" }],
      apple: "/img/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = { themeColor: "#121212" };

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={`${oswald.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
