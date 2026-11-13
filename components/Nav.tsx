"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { useLang } from "./LangProvider";
import { RooflineMark } from "./Brand";
import { LangSwitch } from "./LangSwitch";
import { EASE, scrollToId } from "./Motion";

const SECTIONS = ["services", "why", "process", "area", "contact"] as const;

export function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  // Header siempre fijo y visible; se vuelve sólido al bajar
  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 24);
  });

  // Sección activa para el indicador del menú
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    const top = document.getElementById("top");
    const topObs = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { threshold: 0.4 });
    if (top) topObs.observe(top);
    return () => {
      obs.disconnect();
      topObs.disconnect();
    };
  }, []);

  const labels: Record<(typeof SECTIONS)[number], string> = {
    services: t.nav.services,
    why: t.nav.why,
    process: t.nav.process,
    area: t.nav.area,
    contact: t.nav.contact,
  };

  const go = (href: string) => {
    setOpen(false);
    scrollToId(href);
  };

  const pill = hover ?? active;

  return (
    <motion.header
      className={`nav ${solid ? "nav--solid" : ""}`}
    >
      <motion.div className="nav__progress" style={{ scaleX: progress }} />
      <div className="nav__inner">
        <a
          href="#top"
          className="nav__brand"
          onClick={(e) => {
            e.preventDefault();
            go("#top");
          }}
        >
          <motion.span whileHover={{ rotate: -8, scale: 1.08 }} transition={{ type: "spring", stiffness: 300 }}>
            <RooflineMark size={34} draw />
          </motion.span>
          <span className="nav__brandtext">
            <strong>ALPHA</strong>
            <em>Roofing &amp; Gutters</em>
          </span>
        </a>

        <nav className="nav__links" onMouseLeave={() => setHover(null)}>
          {SECTIONS.map((id) => (
            <button
              key={id}
              onClick={() => go(`#${id}`)}
              onMouseEnter={() => setHover(id)}
              className={active === id ? "is-active" : ""}
            >
              {pill === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="nav__pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="nav__label">{labels[id]}</span>
            </button>
          ))}
        </nav>

        <div className="nav__cta">
          <LangSwitch id="desk" />
          <button className="btn btn--gold btn--sm" onClick={() => go("#contact")}>
            {t.nav.cta}
          </button>
        </div>

        <div className="nav__mlang">
          <LangSwitch id="mob" />
        </div>

        <button className="nav__burger" onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "m"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex" }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <motion.div
              className="nav__mobileinner"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
            >
              {SECTIONS.map((id) => (
                <motion.button
                  key={id}
                  onClick={() => go(`#${id}`)}
                  variants={{ hidden: { x: -16, opacity: 0 }, show: { x: 0, opacity: 1 } }}
                >
                  {labels[id]}
                </motion.button>
              ))}
              <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="nav__mobilefoot">
                <button className="btn btn--gold" onClick={() => go("#contact")}>
                  {t.nav.cta}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
