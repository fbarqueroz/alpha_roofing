"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ChevronRight, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/lib/content";
import { useLang } from "./LangProvider";
import { RooflineMark } from "./Brand";
import { EASE, SplitWords, scrollToId } from "./Motion";

export function Hero() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);

  // Parallax solo en el fondo; el contenido (y los botones) no se desvanecen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const backSkyY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Resplandor dorado del fondo que sigue al cursor
  const mx = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(20), { stiffness: 60, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(520px 360px at ${mx}% ${my}%, rgba(202,160,86,0.16), transparent 70%)`;
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section id="top" className="hero" ref={ref} onMouseMove={onMove}>
      <motion.div className="hero__glow" style={{ background: glow }} />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__rain" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.37) % 3}s`, animationDuration: `${2.2 + ((i * 7) % 10) / 6}s` }} />
        ))}
      </div>

      <motion.div className="hero__mark" style={{ y: markY }} aria-hidden="true">
        <RooflineMark size={460} draw delay={0.2} />
      </motion.div>

      <div className="hero__inner">
        <motion.span
          className="eyebrow eyebrow--pill"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="pulse-dot" />
          <MapPin size={13} /> {t.hero.badge}
        </motion.span>

        <h1 className="hero__title" key={lang}>
          <SplitWords text={t.hero.title1} delay={0.1} />
          <br />
          <SplitWords text={t.hero.title2} className="gold-text" delay={0.35} />
        </h1>

        <motion.p
          key={`sub-${lang}`}
          className="hero__sub"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
        >
          <a
            className="btn btn--gold btn--lg"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("#contact");
            }}
          >
            {t.nav.cta} <ChevronRight size={16} />
          </a>
          <a className="btn btn--ghost btn--lg" href={`tel:${BRAND.phoneHref}`}>
            <Phone size={15} /> {BRAND.phone}
          </a>
        </motion.div>

        <motion.div className="hero__license" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
          {t.hero.license}
        </motion.div>
      </div>

      <div className="hero__skyline" aria-hidden="true">
        <motion.svg viewBox="0 0 640 60" preserveAspectRatio="none" style={{ y: backSkyY }}>
          <polygon
            points="0,60 0,44 30,24 70,44 110,30 150,44 190,20 230,44 270,32 310,44 350,22 390,44 430,30 470,44 510,24 550,44 590,30 640,44 640,60"
            fill="#132030"
          />
        </motion.svg>
        <svg viewBox="0 0 640 60" preserveAspectRatio="none">
          <polygon
            points="0,60 0,40 40,10 80,40 120,18 160,40 200,12 240,40 280,22 320,40 360,10 400,40 440,20 480,40 520,14 560,40 600,24 640,40 640,60"
            fill="#0d151e"
          />
          <motion.polyline
            points="0,40 40,10 80,40 120,18 160,40 200,12 240,40 280,22 320,40 360,10 400,40 440,20 480,40 520,14 560,40 600,24 640,40"
            fill="none"
            stroke="#e8a33d"
            strokeOpacity="0.5"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      </div>
    </section>
  );
}
