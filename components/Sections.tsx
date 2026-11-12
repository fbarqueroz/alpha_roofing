"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import {
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CloudRain,
  Home as HomeIcon,
  Layers,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { BRAND, type ServiceItem } from "@/lib/content";
import { useLang } from "./LangProvider";
import { RoofDivider, RooflineMark } from "./Brand";
import { EASE, Reveal, SplitWords, scrollToId } from "./Motion";
import { IllinoisMap } from "./IllinoisMap";

/* ---------------- Franja de confianza: marquesina infinita ---------------- */
export function TrustStrip() {
  const { t } = useLang();
  const icons = [ShieldCheck, Clock3, HomeIcon, CheckCircle2];
  const row = t.trust.map((label, i) => {
    const Icon = icons[i];
    return (
      <div className="trust__item" key={i}>
        <Icon size={17} strokeWidth={2} />
        <span>{label}</span>
        <span className="trust__sep" aria-hidden="true">
          ◆
        </span>
      </div>
    );
  });
  return (
    <div className="trust" aria-label={t.trust.join(", ")}>
      <div className="trust__track" aria-hidden="true">
        <div className="trust__row">{row}{row}</div>
        <div className="trust__row">{row}{row}</div>
      </div>
    </div>
  );
}

/* ---------------- Encabezado de sección reutilizable ---------------- */
function SectionHead({ eyebrow, title, sub, center = true }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  const { lang } = useLang();
  return (
    <div className={center ? "head head--center" : "head"} key={lang}>
      <Reveal>
        <span className={`eyebrow ${center ? "eyebrow--center" : ""}`}>{eyebrow}</span>
      </Reveal>
      <h2 className={`section__title ${center ? "center" : ""}`}>
        <SplitWords text={title} />
      </h2>
      {sub && (
        <Reveal delay={150}>
          <p className={`section__sub ${center ? "center" : ""}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- Tarjeta de servicio con foco de luz al pasar el cursor ---------------- */
function TiltCard({ s, Icon, index }: { s: ServiceItem; Icon: typeof HomeIcon; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: EASE }}
    >
      <div ref={ref} className="card" onMouseMove={onMove}>
        <span className="card__index">0{index + 1}</span>
        <motion.div
          className="card__icon"
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={26} strokeWidth={1.75} />
        </motion.div>
        <h3>{s.title}</h3>
        <p>{s.desc}</p>
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 + index * 0.12 } } }}
        >
          {s.points.map((p) => (
            <motion.li key={p} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
              <CheckCircle2 size={14} /> {p}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

export function Services() {
  const { t } = useLang();
  const icons = [HomeIcon, CloudRain, Layers];
  return (
    <section id="services" className="section section--light">
      <SectionHead eyebrow={t.services.eyebrow} title={t.services.title} sub={t.services.sub} />
      <div className="services__grid">
        {t.services.items.map((s, i) => (
          <TiltCard key={i} s={s} Icon={icons[i]} index={i} />
        ))}
      </div>
      <RoofDivider className="section__divider" />
    </section>
  );
}

/* ---------------- Por qué Alpha ---------------- */
export function Why() {
  const { t } = useLang();
  return (
    <section id="why" className="section section--alt">
      <div className="why__wrap">
        <SectionHead eyebrow={t.why.eyebrow} title={t.why.title} sub={t.why.body} />
        <div className="why__list">
          {t.why.reasons.map((r, i) => (
            <motion.div
              key={i}
              className="reason"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            >
              <div className="reason__mark">
                <RooflineMark size={34} draw delay={0.2 + i * 0.12} />
              </div>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
            </motion.div>
          ))}
        </div>
        <Reveal delay={200} className="why__cta">
          <a
            className="btn btn--gold"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("#contact");
            }}
          >
            {t.why.cta} <ChevronRight size={16} />
          </a>
        </Reveal>
      </div>
      <RoofDivider className="section__divider" flip />
    </section>
  );
}

/* ---------------- Proceso: línea que se llena con el scroll ---------------- */
export function Process() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const steps = t.process.steps;

  return (
    <section id="process" className="section section--light">
      <SectionHead eyebrow={t.process.eyebrow} title={t.process.title} />
      <div className="process" ref={ref}>
        <div className="process__track" aria-hidden="true">
          <motion.div className="process__fill" style={{ scaleX: fill }} />
          <motion.div className="process__fill process__fill--v" style={{ scaleY: fill }} />
        </div>
        {steps.map((s, i) => (
          <ProcessStep key={s.n} n={s.n} title={s.title} desc={s.desc} i={i} total={steps.length} progress={fill} />
        ))}
      </div>
      <RoofDivider className="section__divider" />
    </section>
  );
}

function ProcessStep({
  n,
  title,
  desc,
  i,
  total,
  progress,
}: {
  n: string;
  title: string;
  desc: string;
  i: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const at = i / Math.max(total - 1, 1);
  const lit = useTransform(progress, [Math.max(at - 0.15, 0), at], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.85, 1]);
  const glow = useTransform(lit, (v) => `0 0 ${v * 26}px rgba(214,138,34,${v * 0.4})`);
  const bg = useTransform(lit, (v) => `rgba(214,138,34,${0.08 + v * 0.92})`);
  const color = useTransform(lit, (v) => (v > 0.6 ? "#1a1206" : "#b8700f"));

  return (
    <motion.div
      className="process__step"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
    >
      <motion.div className="process__n" style={{ scale, boxShadow: glow, background: bg, color }}>
        {n}
      </motion.div>
      <div className="process__body">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </motion.div>
  );
}

/* ---------------- Zona de servicio: mapa real de Illinois ---------------- */
export function Area() {
  const { t } = useLang();
  const cities = ["Springfield", "Champaign", "Decatur", "Danville", "Mattoon", "Jacksonville", "Quincy"];
  return (
    <section id="area" className="section section--alt area">
      <div className="area__wrap">
        <SectionHead eyebrow={t.area.eyebrow} title={t.area.title} sub={t.area.body} />
        <div className="area__grid">
          <Reveal className="area__map">
            <IllinoisMap label={t.area.mapLabel} />
          </Reveal>
          <Reveal delay={150} className="area__panel">
            <div className="area__legend">
              <span className="area__swatch" /> {t.area.legend}
            </div>
            <ul className="area__cities">
              {cities.map((c) => (
                <li key={c}>
                  <MapPin size={13} /> {c}
                </li>
              ))}
            </ul>
            <p className="area__hint">{t.area.hint}</p>
            <a
              className="btn btn--gold"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("#contact");
              }}
            >
              {t.nav.cta} <ChevronRight size={16} />
            </a>
          </Reveal>
        </div>
      </div>
      <RoofDivider className="section__divider" flip />
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <RoofDivider className="footer__divider" />
      <div className="footer__brand">
        <RooflineMark size={46} draw />
        <motion.span
          className="footer__word"
          initial={{ letterSpacing: "0.6em", opacity: 0 }}
          whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          ALPHA
        </motion.span>
      </div>
      <div className="footer__bottom">
        <span>
          &copy; {new Date().getFullYear()} {BRAND.name}. {t.footer.rights}
        </span>
        <span>{t.footer.tagline}</span>
        <motion.button
          className="footer__top"
          onClick={() => scrollToId("#top")}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </motion.button>
      </div>
    </footer>
  );
}
