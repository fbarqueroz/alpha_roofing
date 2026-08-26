import { useState, useEffect, useRef, createContext, useContext } from "react";
import type { ReactNode, ChangeEvent, FormEvent } from "react";
import {
  Phone,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  Send,
  Home as HomeIcon,
  CloudRain,
  Layers,
  ShieldCheck,
  Clock3,
  MapPin,
  Loader2,
  Globe,
} from "lucide-react";

/* ---------------------------------------------------------------
   ALPHA ROOFING & GUTTERS — one-page marketing site
   Brand pulled from the owner's business card:
   charcoal ground + brushed-gold roofline mark.
   Signature motif: a repeating "roofline skyline" divider built
   from the same two-stroke peak used in the logo, run between
   every section instead of a plain rule.

   Language: detected automatically from the visitor's device/
   browser (navigator.language). Falls back to English, switches
   to Spanish for any es-* locale. A small EN/ES control in the
   nav lets a visitor override the guess by hand.
----------------------------------------------------------------*/

const BRAND = {
  name: "Alpha Roofing & Gutters",
  owner: "Aaron Vega",
  ownerTitle: "Owner",
  phone: "(217) 898-2985",
  phoneHref: "+12178982985",
  email: "Avz5588@yahoo.com",
  rep: "Marlon Blanco",
  repPhone: "(217) 979-0729",
  repPhoneHref: "+12179790729",
  license1: "104.020436",
  license2: "105.011145",
  area: "Central Illinois",
};

/* ---------------------------- TYPES ---------------------------- */
type Lang = "en" | "es";

interface ServiceItem {
  title: string;
  desc: string;
  points: string[];
}

interface Reason {
  title: string;
  desc: string;
}

interface ProcessStep {
  n: string;
  title: string;
  desc: string;
}

interface CopyShape {
  nav: { services: string; why: string; process: string; area: string; contact: string; cta: string };
  hero: { badge: string; title1: string; title2: string; sub: string; license: string };
  trust: string[];
  services: { eyebrow: string; title: string; sub: string; items: ServiceItem[] };
  why: { eyebrow: string; title: string; body: string; cta: string; reasons: Reason[] };
  process: { eyebrow: string; title: string; steps: ProcessStep[] };
  area: { eyebrow: string; title: string; body: string };
  contact: {
    eyebrow: string;
    title: string;
    sub: string;
    form: {
      name: string;
      namePh: string;
      phone: string;
      phonePh: string;
      email: string;
      emailPh: string;
      service: string;
      serviceOpts: string[];
      message: string;
      messagePh: string;
      send: string;
      sending: string;
      sent: string;
      error: string;
    };
  };
  footer: { rights: string; tagline: string };
}

/* ---------------------------- TRANSLATIONS ---------------------------- */
const COPY: Record<Lang, CopyShape> = {
  en: {
    nav: { services: "Services", why: "Why Alpha", process: "Process", area: "Service Area", contact: "Contact", cta: "Free Estimate" },
    hero: {
      badge: `Locally Owned · Serving ${BRAND.area}`,
      title1: "Roofs, Gutters & Siding",
      title2: "Built to Outlast the Storm",
      sub: `${BRAND.name} is a licensed Central Illinois contractor run by owner ${BRAND.owner}. Straightforward advice, careful installs, and a free, no-pressure estimate before anything is decided.`,
      license: `License No. ${BRAND.license1} · ${BRAND.license2}`,
    },
    trust: ["Licensed Contractor", "Free Estimates", "Owner On Every Job", "Roofing · Gutters · Siding"],
    services: {
      eyebrow: "What We Do",
      title: "Three Trades, One Crew",
      sub: "We keep our focus narrow on purpose — roofing, gutters and siding — so every job gets a crew that does this work every day, not a little bit of everything.",
      items: [
        {
          title: "Roofing",
          desc: "New roof installations, tear-offs and repairs — from a handful of missing shingles to a full replacement after storm damage.",
          points: ["Asphalt shingle roofs", "Roof repair & patching", "Storm damage assessment", "Full tear-off & replacement"],
        },
        {
          title: "Gutters",
          desc: "Seamless gutter installation and repair that moves water away from your foundation instead of letting it pool.",
          points: ["Seamless gutter installation", "Downspouts & drainage", "Gutter repair", "Guards on request"],
        },
        {
          title: "Siding",
          desc: "Siding repair and installation that protects the exterior of your home and keeps it looking sharp.",
          points: ["Siding installation", "Panel repair & replacement", "Trim & fascia work", "Color & material guidance"],
        },
      ],
    },
    why: {
      eyebrow: "Why Alpha",
      title: "A Small Crew That Answers the Phone",
      body: `${BRAND.name} was built on a simple idea: homeowners in ${BRAND.area} deserve a roofer who shows up, explains things honestly, and doesn't disappear after the check clears.`,
      cta: "Get Your Free Estimate",
      reasons: [
        { title: "You talk to the owner", desc: `${BRAND.owner} runs the estimates and stands behind the work — not a call center passing you between departments.` },
        { title: "Estimates cost nothing", desc: "We walk the roof, explain what we see in plain language, and give you a written estimate with no obligation." },
        { title: "Licensed & accountable", desc: `Operating under license No. ${BRAND.license1} and ${BRAND.license2} in the state of Illinois.` },
      ],
    },
    process: {
      eyebrow: "How It Works",
      title: "From First Call to Finished Roof",
      steps: [
        { n: "02", title: "Free inspection", desc: "We come look in person and walk you through exactly what we find." },
        { n: "03", title: "Clear estimate", desc: "You get a written estimate with no pressure to sign anything on the spot." },
        { n: "04", title: "The work gets done", desc: "Once you approve, we schedule the crew and keep you posted until it's finished." },
      ],
    },
    area: {
      eyebrow: "Where We Work",
      title: `Proudly Serving ${BRAND.area}`,
      body: `${BRAND.name} takes on roofing, gutter and siding projects throughout Central Illinois. Not sure if you're in range? Reach out — it takes thirty seconds to ask.`,
    },
    contact: {
      eyebrow: "Get In Touch",
      title: "Request Your Free Estimate",
      sub: "Send the details below or reach us directly — whatever's fastest for you.",
      form: {
        name: "Name",
        namePh: "Your name",
        phone: "Phone",
        phonePh: "(217) 000-0000",
        email: "Email",
        emailPh: "you@email.com",
        service: "Service needed",
        serviceOpts: ["Roofing", "Gutters", "Siding", "Not sure yet"],
        message: "Message",
        messagePh: "Tell us a bit about the project — a leak, storm damage, a full replacement...",
        send: "Send Request",
        sending: "Sending...",
        sent: "Thanks — your request is on its way. We'll be in touch shortly.",
        error: `Something went wrong sending the form. Please call or WhatsApp us instead — ${BRAND.phone}.`,
      },
    },
    footer: {
      rights: "All rights reserved.",
      tagline: `Free estimates · ${BRAND.area}`,
    },
  },

  es: {
    nav: { services: "Servicios", why: "Por Qué Alpha", process: "Proceso", area: "Zona de Servicio", contact: "Contacto", cta: "Estimado Gratis" },
    hero: {
      badge: `Negocio Local · Sirviendo ${BRAND.area}`,
      title1: "Techos, Canales y Siding",
      title2: "Hechos Para Aguantar la Tormenta",
      sub: `${BRAND.name} es un contratista con licencia en Central Illinois, dirigido por el dueño ${BRAND.owner}. Consejos claros, instalaciones cuidadosas y un estimado gratis, sin presión, antes de decidir nada.`,
      license: `Licencia No. ${BRAND.license1} · ${BRAND.license2}`,
    },
    trust: ["Contratista con Licencia", "Estimados Gratis", "El Dueño en Cada Obra", "Techos · Canales · Siding"],
    services: {
      eyebrow: "Lo Que Hacemos",
      title: "Tres Oficios, Un Solo Equipo",
      sub: "Nos enfocamos a propósito en solo tres cosas — techos, canales y siding — para que cada trabajo lo haga un equipo que hace esto todos los días, no un poco de todo.",
      items: [
        {
          title: "Techos",
          desc: "Instalación de techos nuevos, remoción y reparaciones — desde unas cuantas tejas faltantes hasta un reemplazo completo después de una tormenta.",
          points: ["Techos de tejas asfálticas", "Reparación y parcheo", "Evaluación de daños por tormenta", "Remoción y reemplazo completo"],
        },
        {
          title: "Canales",
          desc: "Instalación y reparación de canales sin costuras que alejan el agua de la fundación en vez de dejarla estancarse.",
          points: ["Instalación de canales sin costuras", "Bajantes y drenaje", "Reparación de canales", "Guardas bajo pedido"],
        },
        {
          title: "Siding",
          desc: "Reparación e instalación de siding que protege el exterior de tu casa y la mantiene viéndose bien.",
          points: ["Instalación de siding", "Reparación y reemplazo de paneles", "Trabajo de molduras y fascia", "Asesoría de color y material"],
        },
      ],
    },
    why: {
      eyebrow: "Por Qué Alpha",
      title: "Un Equipo Pequeño Que Sí Contesta",
      body: `${BRAND.name} nació de una idea simple: los dueños de casa en ${BRAND.area} merecen un techero que llega, explica las cosas con honestidad y no desaparece después de cobrar el cheque.`,
      cta: "Pide Tu Estimado Gratis",
      reasons: [
        { title: "Hablas directo con el dueño", desc: `${BRAND.owner} maneja los estimados y respalda el trabajo — no es un call center que te pasa de departamento en departamento.` },
        { title: "Los estimados no cuestan nada", desc: "Revisamos el techo, te explicamos lo que vemos en palabras simples y te damos un estimado por escrito sin compromiso." },
        { title: "Con licencia y responsables", desc: `Operamos bajo la licencia No. ${BRAND.license1} y ${BRAND.license2} en el estado de Illinois.` },
      ],
    },
    process: {
      eyebrow: "Cómo Funciona",
      title: "Desde la Primera Llamada Hasta el Techo Terminado",
      steps: [
        { n: "01", title: "Contáctanos", desc: "Llama, envía un mensaje, WhatsApp o manda el formulario de abajo con algunos detalles de tu techo." },
        { n: "02", title: "Inspección gratis", desc: "Vamos en persona y te explicamos exactamente lo que encontramos." },
        { n: "03", title: "Estimado claro", desc: "Recibes un estimado por escrito, sin presión de firmar nada en el momento." },
        { n: "04", title: "Se hace el trabajo", desc: "Una vez que apruebas, programamos al equipo y te mantenemos al tanto hasta terminar." },
      ],
    },
    area: {
      eyebrow: "Dónde Trabajamos",
      title: `Sirviendo con Orgullo a ${BRAND.area}`,
      body: `${BRAND.name} toma proyectos de techos, canales y siding en toda Central Illinois. ¿No sabes si estás en la zona? Escríbenos — toma treinta segundos preguntar.`,
    },
    contact: {
      eyebrow: "Contáctanos",
      title: "Pide Tu Estimado Gratis",
      sub: "Manda tus datos abajo o contáctanos directamente — lo que sea más rápido para ti.",
      form: {
        name: "Nombre",
        namePh: "Tu nombre",
        phone: "Teléfono",
        phonePh: "(217) 000-0000",
        email: "Correo",
        emailPh: "tucorreo@email.com",
        service: "Servicio que necesitas",
        serviceOpts: ["Techos", "Canales", "Siding", "Aún no sé"],
        message: "Mensaje",
        messagePh: "Cuéntanos un poco del proyecto — una gotera, daño de tormenta, un reemplazo completo...",
        send: "Enviar Solicitud",
        sending: "Enviando...",
        sent: "Gracias — tu solicitud va en camino. Nos pondremos en contacto pronto.",
        error: `Algo salió mal al enviar el formulario. Llámanos o escríbenos por WhatsApp — ${BRAND.phone}.`,
      },
    },
    footer: {
      rights: "Todos los derechos reservados.",
      tagline: `Estimados gratis · ${BRAND.area}`,
    },
  },
};

/* ---------------------------- LANGUAGE CONTEXT ---------------------------- */
interface LangContextValue {
  lang: Lang;
  t: CopyShape;
  toggle: () => void;
}

const defaultLangValue: LangContextValue = { lang: "en", t: COPY.en, toggle: () => {} };
const LangContext = createContext<LangContextValue>(defaultLangValue);
const useLang = () => useContext(LangContext);

function detectDeviceLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const raw = navigator.language || (navigator.languages && navigator.languages[0]) || "en";
  return raw.toLowerCase().startsWith("es") ? "es" : "en";
}

function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(detectDeviceLang());
  }, []);

  const toggle = () => setLang((l) => (l === "en" ? "es" : "en"));

  return <LangContext.Provider value={{ lang, t: COPY[lang], toggle }}>{children}</LangContext.Provider>;
}

/* ---------- Reusable roofline mark (matches the card's "A") ---------- */
function RooflineMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="goldMark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0d9a6" />
          <stop offset="0.5" stopColor="#caa056" />
          <stop offset="1" stopColor="#8f6a2e" />
        </linearGradient>
      </defs>
      <path
        d="M6 30 L32 6 L58 30 M6 30 L15 30 M58 30 L49 30"
        stroke="url(#goldMark)"
        strokeWidth="4.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M10 46 L32 26 L54 46 M10 46 L18 46 M54 46 L46 46"
        stroke="url(#goldMark)"
        strokeWidth="4.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <rect x="27" y="34" width="4" height="4" fill="#caa056" />
      <rect x="33" y="34" width="4" height="4" fill="#caa056" />
      <rect x="27" y="40" width="4" height="4" fill="#caa056" opacity="0.75" />
      <rect x="33" y="40" width="4" height="4" fill="#caa056" opacity="0.75" />
    </svg>
  );
}

/* ---------- Signature section divider: repeating roofline skyline ---------- */
function RoofDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  let path = "M0,20 ";
  for (let i = 0; i < 10; i++) {
    const offset = i * 32;
    path += `L${offset + 8},4 L${offset + 16},20 L${offset + 24},4 L${offset + 32},20 `;
  }
  return (
    <div className={`roofdiv ${flip ? "roofdiv--flip" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 320 20" preserveAspectRatio="none">
        <polyline points={path.replace(/[ML]/g, "").trim()} fill="none" stroke="url(#divGrad)" strokeWidth="1.4" />
        <defs>
          <linearGradient id="divGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#caa056" stopOpacity="0" />
            <stop offset="0.5" stopColor="#caa056" stopOpacity="0.9" />
            <stop offset="1" stopColor="#caa056" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ---------- Reveal-on-scroll wrapper ---------- */
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------------------- NAV ---------------------------- */
function Nav() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t.nav.services, href: "#services" },
    { label: t.nav.why, href: "#why" },
    { label: t.nav.process, href: "#process" },
    { label: t.nav.area, href: "#area" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={`nav ${solid ? "nav--solid" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={(e) => { e.preventDefault(); go("#top"); }}>
          <RooflineMark size={34} />
          <span className="nav__brandtext">
            <strong>ALPHA</strong>
            <em>Roofing &amp; Gutters</em>
          </span>
        </a>

        <nav className="nav__links">
          {links.map((l) => (
            <button key={l.href} onClick={() => go(l.href)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav__cta">
          <button className="nav__lang" onClick={toggle} aria-label="Switch language" title="EN / ES">
            <Globe size={14} /> {lang === "en" ? "ES" : "EN"}
          </button>
          <a className="nav__phone" href={`tel:${BRAND.phoneHref}`}>
            <Phone size={15} strokeWidth={2.25} />
            {BRAND.phone}
          </a>
          <button className="btn btn--gold btn--sm" onClick={() => go("#contact")}>
            {t.nav.cta}
          </button>
        </div>

        <button className="nav__burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="nav__mobile">
          {links.map((l) => (
            <button key={l.href} onClick={() => go(l.href)}>
              {l.label}
            </button>
          ))}
          <button className="nav__lang" onClick={toggle}>
            <Globe size={14} /> {lang === "en" ? "Ver en Español" : "View in English"}
          </button>
          <a className="nav__phone" href={`tel:${BRAND.phoneHref}`}>
            <Phone size={15} /> {BRAND.phone}
          </a>
          <button className="btn btn--gold" onClick={() => go("#contact")}>
            {t.nav.cta}
          </button>
        </div>
      )}
    </header>
  );
}

/* ---------------------------- HERO ---------------------------- */
function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="hero">
      <div className="hero__glow" />
      <div className="hero__inner">
        <Reveal>
          <span className="eyebrow">
            <MapPin size={13} /> {t.hero.badge}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="hero__title">
            {t.hero.title1}
            <br />
            <span className="gold-text">{t.hero.title2}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="hero__sub">{t.hero.sub}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="hero__actions">
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="hero__license">{t.hero.license}</div>
        </Reveal>
      </div>

      <div className="hero__skyline" aria-hidden="true">
        <svg viewBox="0 0 640 60" preserveAspectRatio="none">
          <polygon
            points="0,60 0,40 40,10 80,40 120,18 160,40 200,12 240,40 280,22 320,40 360,10 400,40 440,20 480,40 520,14 560,40 600,24 640,40 640,60"
            fill="url(#skylineFill)"
          />
          <defs>
            <linearGradient id="skylineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b1b1b" />
              <stop offset="1" stopColor="#121212" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}

/* ---------------------------- TRUST STRIP ---------------------------- */
function TrustStrip() {
  const { t } = useLang();
  const icons = [ShieldCheck, Clock3, HomeIcon, CheckCircle2];
  return (
    <div className="trust">
      {t.trust.map((label, i) => {
        const Icon = icons[i];
        return (
          <div className="trust__item" key={i}>
            <Icon size={17} strokeWidth={2} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------- SERVICES ---------------------------- */
function Services() {
  const { t } = useLang();
  const icons = [HomeIcon, CloudRain, Layers];
  return (
    <section id="services" className="section">
      <Reveal>
        <span className="eyebrow eyebrow--center">{t.services.eyebrow}</span>
        <h2 className="section__title center">{t.services.title}</h2>
        <p className="section__sub center">{t.services.sub}</p>
      </Reveal>

      <div className="services__grid">
        {t.services.items.map((s, i) => {
          const Icon = icons[i];
          return (
            <Reveal delay={i * 100} key={s.title}>
              <div className="card">
                <div className="card__icon">
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>
                      <CheckCircle2 size={14} /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
      <RoofDivider className="section__divider" />
    </section>
  );
}

/* ---------------------------- WHY / ABOUT ---------------------------- */
function Why() {
  const { t } = useLang();
  return (
    <section id="why" className="section section--alt">
      <div className="why__grid">
        <Reveal className="why__copy">
          <span className="eyebrow">{t.why.eyebrow}</span>
          <h2 className="section__title">{t.why.title}</h2>
          <p>{t.why.body}</p>
          <a className="btn btn--gold" href="#contact">
            {t.why.cta} <ChevronRight size={16} />
          </a>
        </Reveal>

        <div className="why__list">
          {t.why.reasons.map((r, i) => (
            <Reveal delay={i * 90} key={r.title}>
              <div className="reason">
                <div className="reason__mark">
                  <RooflineMark size={26} />
                </div>
                <div>
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <RoofDivider className="section__divider" flip />
    </section>
  );
}

/* ---------------------------- PROCESS ---------------------------- */
function Process() {
  const { t } = useLang();
  return (
    <section id="process" className="section">
      <Reveal>
        <span className="eyebrow eyebrow--center">{t.process.eyebrow}</span>
        <h2 className="section__title center">{t.process.title}</h2>
      </Reveal>
      <div className="process">
        {t.process.steps.map((s, i) => (
          <Reveal delay={i * 100} key={s.n} className="process__step">
            <div className="process__n">{s.n}</div>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
            {i < t.process.steps.length - 1 && <div className="process__link" />}
          </Reveal>
        ))}
      </div>
      <RoofDivider className="section__divider" />
    </section>
  );
}

/* ---------------------------- SERVICE AREA ---------------------------- */
function Area() {
  const { t } = useLang();
  return (
    <section id="area" className="section section--alt area">
      <Reveal className="area__inner">
        <span className="eyebrow">{t.area.eyebrow}</span>
        <h2 className="section__title">{t.area.title}</h2>
        <p>{t.area.body}</p>
      </Reveal>
      <RoofDivider className="section__divider" flip />
    </section>
  );
}

/* ---------------------------- CONTACT ---------------------------- */
interface FormState {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

type Status = "idle" | "sending" | "sent" | "error";

function Contact() {
  const { t } = useLang();
  const f = t.contact.form;
  const [form, setForm] = useState<FormState>({ name: "", phone: "", email: "", service: f.serviceOpts[0], message: "" });
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setForm((prev) => ({ ...prev, service: f.serviceOpts[0] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const update = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${BRAND.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New estimate request — ${form.name || "website"}`,
          Name: form.name,
          Phone: form.phone,
          Email: form.email,
          "Service Needed": form.service,
          Message: form.message,
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("sent");
      setForm({ name: "", phone: "", email: "", service: f.serviceOpts[0], message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section contact">
      <Reveal>
        <span className="eyebrow eyebrow--center">{t.contact.eyebrow}</span>
        <h2 className="section__title center">{t.contact.title}</h2>
        <p className="section__sub center">{t.contact.sub}</p>
      </Reveal>

      <div className="contact__grid">
        <Reveal delay={100} className="contact__formwrap">
          <form className="form" onSubmit={submit}>
            <div className="form__row">
              <label>
                {f.name}
                <input required value={form.name} onChange={update("name")} placeholder={f.namePh} />
              </label>
              <label>
                {f.phone}
                <input required value={form.phone} onChange={update("phone")} placeholder={f.phonePh} />
              </label>
            </div>
            <div className="form__row">
              <label>
                {f.email}
                <input type="email" required value={form.email} onChange={update("email")} placeholder={f.emailPh} />
              </label>
              <label>
                {f.service}
                <select value={form.service} onChange={update("service")}>
                  {f.serviceOpts.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              {f.message}
              <textarea rows={4} value={form.message} onChange={update("message")} placeholder={f.messagePh} />
            </label>

            <button className="btn btn--gold btn--lg" type="submit" disabled={status === "sending"}>
              {status === "sending" ? (
                <>
                  <Loader2 size={17} className="spin" /> {f.sending}
                </>
              ) : (
                <>
                  <Send size={16} /> {f.send}
                </>
              )}
            </button>

            {status === "sent" && (
              <p className="form__note form__note--ok">
                <CheckCircle2 size={15} /> {f.sent}
              </p>
            )}
            {status === "error" && <p className="form__note form__note--err">{f.error}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- FOOTER ---------------------------- */
function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <RoofDivider className="footer__divider" />
      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} {BRAND.name}. {t.footer.rights}</span>
        <span>{t.footer.tagline}</span>
      </div>
    </footer>
  );
}

/* ---------------------------- APP ---------------------------- */
export default function App() {
  return (
    <LangProvider>
      <div className="site">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

          :root{
            --bg:#121212; --bg-elev:#1b1b1b; --bg-elev2:#212121;
            --line: rgba(202,160,86,0.16);
            --gold:#caa056; --gold-light:#f0d9a6; --gold-deep:#8f6a2e;
            --ink:#f2ede2; --ink-dim:#b6ada0; --ink-faint:#7a7367;
          }
          *{ box-sizing:border-box; }
          .site{
            background:var(--bg); color:var(--ink);
            font-family:'Inter',system-ui,sans-serif;
            line-height:1.55; overflow-x:hidden;
          }
          .site h1,.site h2,.site h3,.site h4{
            font-family:'Oswald',sans-serif; text-transform:uppercase;
            letter-spacing:0.01em; font-weight:600; margin:0 0 .5em;
          }
          .site p{ color:var(--ink-dim); margin:0 0 1em; }
          .site a{ color:inherit; text-decoration:none; }
          .site button{ font-family:inherit; cursor:pointer; }
          .gold-text{
            background:linear-gradient(100deg,var(--gold-light),var(--gold) 55%,var(--gold-deep));
            -webkit-background-clip:text; background-clip:text; color:transparent;
          }
          .eyebrow{
            display:inline-flex; align-items:center; gap:6px;
            font-family:'Oswald',sans-serif; font-size:12.5px; letter-spacing:.14em;
            text-transform:uppercase; color:var(--gold); margin-bottom:14px;
          }
          .eyebrow--center{ display:flex; justify-content:center; width:100%; }
          .center{ text-align:center; margin-left:auto; margin-right:auto; }

          .btn{
            display:inline-flex; align-items:center; justify-content:center; gap:8px;
            padding:12px 22px; border-radius:2px; border:1px solid transparent;
            font-family:'Oswald',sans-serif; font-size:13.5px; letter-spacing:.06em;
            text-transform:uppercase; font-weight:600; transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
          }
          .btn--gold{ background:linear-gradient(120deg,var(--gold-light),var(--gold) 60%,var(--gold-deep)); color:#181305; }
          .btn--gold:hover{ transform:translateY(-2px); box-shadow:0 10px 24px rgba(202,160,86,0.22); }
          .btn--ghost{ background:transparent; border-color:rgba(242,237,226,0.28); color:var(--ink); }
          .btn--ghost:hover{ border-color:var(--gold); color:var(--gold-light); }
          .btn--lg{ padding:14px 26px; font-size:14px; }
          .btn--sm{ padding:9px 16px; font-size:12px; }
          .btn:disabled{ opacity:.6; cursor:default; transform:none; }

          .reveal{ opacity:0; transform:translateY(22px); transition:opacity .7s ease, transform .7s ease; }
          .reveal--in{ opacity:1; transform:translateY(0); }
          @media (prefers-reduced-motion: reduce){ .reveal{ transition:none; opacity:1; transform:none; } }
          .spin{ animation:spin 1s linear infinite; }
          @keyframes spin{ to{ transform:rotate(360deg); } }

          .nav{ position:sticky; top:0; z-index:50; padding:16px 0; transition:background .25s ease, padding .25s ease, border-color .25s ease; border-bottom:1px solid transparent; }
          .nav--solid{ background:rgba(18,18,18,0.92); backdrop-filter:blur(10px); padding:10px 0; border-color:var(--line); }
          .nav__inner{ max-width:1180px; margin:0 auto; padding:0 24px; display:flex; align-items:center; gap:28px; }
          .nav__brand{ display:flex; align-items:center; gap:10px; margin-right:auto; }
          .nav__brandtext{ display:flex; flex-direction:column; line-height:1.1; }
          .nav__brandtext strong{ font-family:'Oswald',sans-serif; letter-spacing:.1em; font-size:15px; }
          .nav__brandtext em{ font-style:normal; font-size:10.5px; color:var(--ink-faint); letter-spacing:.04em; }
          .nav__links{ display:flex; gap:26px; }
          .nav__links button{ background:none; border:none; color:var(--ink-dim); font-size:13.5px; letter-spacing:.02em; padding:4px 0; border-bottom:1px solid transparent; }
          .nav__links button:hover{ color:var(--gold-light); border-color:var(--gold); }
          .nav__cta{ display:flex; align-items:center; gap:16px; }
          .nav__lang{
            display:flex; align-items:center; gap:5px; background:transparent; border:1px solid var(--line);
            color:var(--ink-dim); font-size:12px; letter-spacing:.04em; padding:6px 10px; border-radius:2px;
          }
          .nav__lang:hover{ border-color:var(--gold); color:var(--gold-light); }
          .nav__phone{ display:flex; align-items:center; gap:6px; font-size:13px; color:var(--ink-dim); white-space:nowrap; }
          .nav__phone:hover{ color:var(--gold-light); }
          .nav__burger{ display:none; background:none; border:none; color:var(--ink); }
          .nav__mobile{ display:flex; flex-direction:column; gap:14px; padding:20px 24px 8px; }
          .nav__mobile button{ background:none; border:none; color:var(--ink-dim); text-align:left; font-size:15px; padding:6px 0; }
          .nav__mobile .nav__lang{ align-self:flex-start; }

          @media (max-width:920px){
            .nav__links,.nav__cta{ display:none; }
            .nav__burger{ display:block; }
          }

          .hero{ position:relative; padding:120px 24px 0; text-align:center; }
          .hero__glow{
            position:absolute; inset:0; z-index:0; pointer-events:none;
            background:radial-gradient(600px 320px at 50% 0%, rgba(202,160,86,0.14), transparent 70%);
          }
          .hero__inner{ position:relative; z-index:1; max-width:760px; margin:0 auto; }
          .hero__title{ font-size:clamp(34px,5.4vw,58px); line-height:1.06; margin-bottom:20px; }
          .hero__sub{ font-size:16.5px; max-width:560px; margin:0 auto 30px; }
          .hero__actions{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom:22px; }
          .hero__license{ font-size:12px; letter-spacing:.08em; color:var(--ink-faint); text-transform:uppercase; padding-bottom:56px; }
          .hero__skyline{ width:100%; line-height:0; margin-top:20px; }
          .hero__skyline svg{ width:100%; height:60px; display:block; }

          .trust{
            max-width:1000px; margin:0 auto; padding:26px 24px 60px;
            display:flex; flex-wrap:wrap; justify-content:center; gap:34px;
            border-bottom:1px solid var(--line);
          }
          .trust__item{ display:flex; align-items:center; gap:8px; color:var(--ink-dim); font-size:13px; letter-spacing:.03em; text-transform:uppercase; font-family:'Oswald',sans-serif; }
          .trust__item svg{ color:var(--gold); }

          .section{ position:relative; padding:88px 24px; max-width:1180px; margin:0 auto; }
          .section--alt{ background:var(--bg-elev); max-width:none; }
          .section--alt > *:not(.roofdiv){ max-width:1180px; margin-left:auto; margin-right:auto; }
          .section__title{ font-size:clamp(26px,3.4vw,38px); max-width:640px; }
          .section__sub{ max-width:560px; font-size:15.5px; }

          .roofdiv{ width:100%; line-height:0; margin:0; opacity:.8; }
          .roofdiv svg{ width:100%; height:16px; display:block; }
          .roofdiv--flip svg{ transform:scaleY(-1); }
          .section__divider{ position:absolute; left:0; right:0; bottom:0; }

          .services__grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:44px; }
          .card{
            background:var(--bg-elev); border:1px solid var(--line); border-radius:4px; padding:30px 26px 26px;
            transition:transform .25s ease, border-color .25s ease;
          }
          .card:hover{ transform:translateY(-4px); border-color:var(--gold); }
          .card__icon{
            width:52px; height:52px; border-radius:3px; display:flex; align-items:center; justify-content:center;
            background:linear-gradient(135deg,rgba(202,160,86,0.18),rgba(202,160,86,0.03)); color:var(--gold-light); margin-bottom:18px;
          }
          .card h3{ font-size:19px; }
          .card ul{ list-style:none; padding:0; margin:18px 0 0; display:flex; flex-direction:column; gap:9px; }
          .card li{ display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--ink-dim); }
          .card li svg{ color:var(--gold); flex-shrink:0; }

          .why__grid{ display:grid; grid-template-columns:0.9fr 1.1fr; gap:60px; align-items:start; padding:88px 24px; max-width:1180px; margin:0 auto; }
          .why__copy p{ margin-bottom:26px; }
          .why__list{ display:flex; flex-direction:column; gap:22px; }
          .reason{ display:flex; gap:16px; align-items:flex-start; }
          .reason__mark{ flex-shrink:0; opacity:.9; }
          .reason h4{ font-size:15px; margin-bottom:4px; }
          .reason p{ font-size:13.5px; margin:0; }

          .process{ display:grid; grid-template-columns:repeat(4,1fr); gap:30px; margin-top:50px; }
          .process__step{ position:relative; padding-top:6px; }
          .process__n{ font-family:'Oswald',sans-serif; font-size:34px; color:var(--gold); opacity:.55; margin-bottom:10px; }
          .process__step h4{ font-size:15.5px; margin-bottom:8px; }
          .process__step p{ font-size:13.5px; }
          .process__link{ position:absolute; top:24px; right:-15px; width:30px; height:1px; background:var(--line); display:none; }
          @media (min-width:769px){ .process__link{ display:block; } }

          .area{ text-align:center; }
          .area__inner{ max-width:620px; margin:0 auto; }
          .area__inner p{ margin:0 auto; }

          .contact__grid{ display:grid; grid-template-columns:1fr; gap:40px; margin-top:50px; align-items:start; max-width:640px; margin-left:auto; margin-right:auto; }
          .form{ background:var(--bg-elev); border:1px solid var(--line); border-radius:4px; padding:30px; display:flex; flex-direction:column; gap:16px; }
          .form__row{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
          .form label{ display:flex; flex-direction:column; gap:7px; font-size:12.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-faint); font-family:'Oswald',sans-serif; }
          .form input,.form select,.form textarea{
            background:var(--bg); border:1px solid var(--line); border-radius:3px; padding:11px 13px;
            color:var(--ink); font-family:'Inter',sans-serif; font-size:14px; resize:vertical;
          }
          .form input:focus,.form select:focus,.form textarea:focus{ outline:none; border-color:var(--gold); }
          .form button{ margin-top:6px; align-self:flex-start; }
          .form__note{ display:flex; align-items:center; gap:7px; font-size:13px; margin:0; }
          .form__note--ok{ color:#9fd8a8; }
          .form__note--err{ color:#e2a3a3; }

          .footer{ background:#0e0e0e; padding:40px 24px 26px; border-top:1px solid var(--line); }
          .footer__divider{ max-width:1180px; margin:0 auto 24px; }
          .footer__bottom{
            max-width:1180px; margin:0 auto; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;
            font-size:12px; color:var(--ink-faint);
          }

          @media (max-width:920px){
            .services__grid{ grid-template-columns:1fr; }
            .why__grid{ grid-template-columns:1fr; gap:40px; }
            .process{ grid-template-columns:1fr 1fr; }
          }
          @media (max-width:560px){
            .form__row{ grid-template-columns:1fr; }
            .process{ grid-template-columns:1fr; }
            .hero{ padding-top:100px; }
          }
        `}</style>

        <Nav />
        <Hero />
        <TrustStrip />
        <Services />
        <Why />
        <Process />
        <Area />
        <Contact />
        <Footer />
      </div>
    </LangProvider>
  );
}