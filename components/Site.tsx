"use client";

import { MotionConfig } from "motion/react";
import { LangProvider } from "./LangProvider";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Area, Footer, Process, Services, TrustStrip, Why } from "./Sections";
import { Contact } from "./Contact";
import type { Lang } from "@/lib/content";

export function Site({ lang }: { lang: Lang }) {
  return (
    // Respeta "reducir movimiento" del sistema operativo
    <MotionConfig reducedMotion="user">
      <LangProvider initial={lang}>
        <div className="site">
          <div className="grain" aria-hidden="true" />
          <Nav />
          <main>
            <Hero />
            <TrustStrip />
            <Services />
            <Why />
            <Process />
            <Area />
            <Contact />
          </main>
          <Footer />
        </div>
      </LangProvider>
    </MotionConfig>
  );
}
