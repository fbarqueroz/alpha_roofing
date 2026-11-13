/* Contenido y traducciones — portado del sitio original (Vite) */
export const BRAND = {
  name: "Alpha Roofing & Gutters",
  owners: ["Aaron Vega", "Marlon Blanco"],
  email: "alpharoofingcr@gmail.com",
  license1: "104.020436",
  license2: "105.011145",
  area: "Central Illinois",
};

/* Nombres de los dueños ya unidos con "y" / "and" */
const OWNERS = { en: BRAND.owners.join(" and "), es: BRAND.owners.join(" y ") };

/* ---------------------------- TYPES ---------------------------- */
export type Lang = "en" | "es";

export interface ServiceItem {
  title: string;
  desc: string;
  points: string[];
}

export interface Reason {
  title: string;
  desc: string;
}

export interface ProcessStep {
  n: string;
  title: string;
  desc: string;
}

export interface CopyShape {
  nav: { services: string; why: string; process: string; area: string; contact: string; cta: string };
  hero: { badge: string; title1: string; title2: string; sub: string; license: string };
  trust: string[];
  services: { eyebrow: string; title: string; sub: string; items: ServiceItem[] };
  why: { eyebrow: string; title: string; body: string; cta: string; reasons: Reason[] };
  process: { eyebrow: string; title: string; steps: ProcessStep[] };
  area: { eyebrow: string; title: string; body: string; mapLabel: string; legend: string; hint: string };
  contact: {
    eyebrow: string;
    title: string;
    sub: string;
    aside: { eyebrow: string; title: string; sub: string; owners: string; email: string; points: string[] };
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
export const COPY: Record<Lang, CopyShape> = {
  en: {
    nav: { services: "Services", why: "Why Alpha", process: "Process", area: "Service Area", contact: "Contact", cta: "Free Estimate" },
    hero: {
      badge: `Locally Owned · Serving ${BRAND.area}`,
      title1: "Roofs, Gutters & Siding",
      title2: "Built to Outlast the Storm",
      sub: `${BRAND.name} is a licensed Central Illinois contractor run by owners ${OWNERS.en}. Straightforward advice, careful installs, and a free, no-pressure estimate before anything is decided.`,
      license: `License No. ${BRAND.license1} · ${BRAND.license2}`,
    },
    trust: ["Licensed Contractor", "Free Estimates", "Owners On Every Job", "Roofing · Gutters · Siding"],
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
      title: "A Small Crew That Answers to You",
      body: `${BRAND.name} was built on a simple idea: homeowners in ${BRAND.area} deserve a roofer who shows up, explains things honestly, and doesn't disappear after the check clears.`,
      cta: "Get Your Free Estimate",
      reasons: [
        { title: "You talk to the owners", desc: `${OWNERS.en} run the estimates and stand behind the work — not a call center passing you between departments.` },
        { title: "Estimates cost nothing", desc: "We walk the roof, explain what we see in plain language, and give you a written estimate with no obligation." },
        { title: "Licensed & accountable", desc: `Operating under license No. ${BRAND.license1} and ${BRAND.license2} in the state of Illinois.` },
      ],
    },
    process: {
      eyebrow: "How It Works",
      title: "From First Contact to Finished Roof",
      steps: [
        { n: "01", title: "Reach out", desc: "Send the form or email us — tell us what you are seeing on your roof." },
        { n: "02", title: "Free inspection", desc: "We come look in person and walk you through exactly what we find." },
        { n: "03", title: "Clear estimate", desc: "You get a written estimate with no pressure to sign anything on the spot." },
        { n: "04", title: "The work gets done", desc: "Once you approve, we schedule the crew and keep you posted until it's finished." },
      ],
    },
    area: {
      eyebrow: "Where We Work",
      title: `Proudly Serving ${BRAND.area}`,
      body: `${BRAND.name} takes on roofing, gutter and siding projects throughout Central Illinois. Not sure if you're in range? Reach out — it takes thirty seconds to ask.`,
      mapLabel: "Map of Illinois highlighting the central counties we serve",
      legend: "Central Illinois service area",
      hint: "Hover the map to see each county",
    },
    contact: {
      eyebrow: "Get In Touch",
      title: "Request Your Free Estimate",
      sub: "Send the details below or reach us directly — whatever's fastest for you.",
      aside: {
        eyebrow: "Talk to us directly",
        title: "Prefer email?",
        sub: "Write to us — the owners answer personally.",
        owners: "Owner",
        email: "Email",
        points: ["Free, no-obligation estimates", "Licensed in Illinois", "Owners on every job"],
      },
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
        error: `Something went wrong sending the form. Please email us at ${BRAND.email}.`,
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
      sub: `${BRAND.name} es un contratista con licencia en Central Illinois, dirigido por los dueños ${OWNERS.es}. Consejos claros, instalaciones cuidadosas y un estimado gratis, sin presión, antes de decidir nada.`,
      license: `Licencia No. ${BRAND.license1} · ${BRAND.license2}`,
    },
    trust: ["Contratista con Licencia", "Estimados Gratis", "Los Dueños en Cada Obra", "Techos · Canales · Siding"],
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
        { title: "Hablas directo con los dueños", desc: `${OWNERS.es} manejan los estimados y respaldan el trabajo — no es un call center que te pasa de departamento en departamento.` },
        { title: "Los estimados no cuestan nada", desc: "Revisamos el techo, te explicamos lo que vemos en palabras simples y te damos un estimado por escrito sin compromiso." },
        { title: "Con licencia y responsables", desc: `Operamos bajo la licencia No. ${BRAND.license1} y ${BRAND.license2} en el estado de Illinois.` },
      ],
    },
    process: {
      eyebrow: "Cómo Funciona",
      title: "Desde el Primer Contacto Hasta el Techo Terminado",
      steps: [
        { n: "01", title: "Contáctanos", desc: "Llena el formulario o escríbenos por correo — cuéntanos qué ves en tu techo." },
        { n: "02", title: "Inspección gratis", desc: "Vamos en persona y te explicamos exactamente lo que encontramos." },
        { n: "03", title: "Estimado claro", desc: "Recibes un estimado por escrito, sin presión de firmar nada en el momento." },
        { n: "04", title: "Se hace el trabajo", desc: "Una vez que apruebas, programamos al equipo y te mantenemos al tanto hasta terminar." },
      ],
    },
    area: {
      eyebrow: "Dónde Trabajamos",
      title: `Sirviendo con Orgullo a ${BRAND.area}`,
      body: `${BRAND.name} toma proyectos de techos, canales y siding en toda Central Illinois. ¿No sabes si estás en la zona? Escríbenos — toma treinta segundos preguntar.`,
      mapLabel: "Mapa de Illinois con los condados del centro que atendemos",
      legend: "Zona de servicio: centro de Illinois",
      hint: "Pasa el cursor por el mapa para ver cada condado",
    },
    contact: {
      eyebrow: "Contáctanos",
      title: "Pide Tu Estimado Gratis",
      sub: "Manda tus datos abajo o contáctanos directamente — lo que sea más rápido para ti.",
      aside: {
        eyebrow: "Habla con nosotros",
        title: "¿Prefieres escribirnos?",
        sub: "Escríbenos — te contestan los dueños directamente.",
        owners: "Dueño",
        email: "Correo",
        points: ["Estimados gratis y sin compromiso", "Con licencia en Illinois", "Los dueños en cada obra"],
      },
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
        error: `Algo salió mal al enviar el formulario. Escríbenos a ${BRAND.email}.`,
      },
    },
    footer: {
      rights: "Todos los derechos reservados.",
      tagline: `Estimados gratis · ${BRAND.area}`,
    },
  },
};
