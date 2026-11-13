import { BRAND, type Lang } from "./content";

/* Plantilla del correo que recibe Alpha Roofing con cada solicitud.
   HTML con tablas y estilos en línea (compatible con Gmail, Outlook, Yahoo
   y Apple Mail) + versión de texto plano como respaldo. */

export interface Lead {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  lang: Lang; // idioma en que el cliente usó el sitio
}

const L = {
  es: {
    subject: (l: Lead) => `Nuevo estimado · ${l.service} · ${l.name}`,
    preheader: (l: Lead) => `${l.name} pidió un estimado de ${l.service.toLowerCase()}. Tel: ${l.phone}`,
    title: "Nueva solicitud de estimado",
    received: "Recibida",
    contact: "Datos del cliente",
    name: "Nombre",
    phone: "Teléfono",
    email: "Correo",
    service: "Servicio",
    language: "Idioma del cliente",
    langNames: { en: "Inglés", es: "Español" },
    message: "Mensaje",
    noMessage: "El cliente no dejó mensaje.",
    call: "Llamar",
    reply: "Responder por correo",
    replySubject: "Tu estimado con Alpha Roofing & Gutters",
    footer: "Enviado desde el formulario del sitio web. Responde a este correo para contestarle directo al cliente.",
  },
  en: {
    subject: (l: Lead) => `New estimate · ${l.service} · ${l.name}`,
    preheader: (l: Lead) => `${l.name} requested a ${l.service.toLowerCase()} estimate. Phone: ${l.phone}`,
    title: "New estimate request",
    received: "Received",
    contact: "Customer details",
    name: "Name",
    phone: "Phone",
    email: "Email",
    service: "Service",
    language: "Customer language",
    langNames: { en: "English", es: "Spanish" },
    message: "Message",
    noMessage: "No message was left.",
    call: "Call",
    reply: "Reply by email",
    replySubject: "Your estimate with Alpha Roofing & Gutters",
    footer: "Sent from the website contact form. Reply to this email to answer the customer directly.",
  },
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const telHref = (p: string) => "tel:" + p.replace(/[^\d+]/g, "");

export function buildLeadEmail(lead: Lead, emailLang: Lang, now = new Date()) {
  const c = L[emailLang];
  const when = new Intl.DateTimeFormat(emailLang === "es" ? "es-US" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(now);
  const mailto = `mailto:${lead.email}?subject=${encodeURIComponent(c.replySubject)}`;

  const row = (label: string, value: string, last = false) => `
    <tr>
      <td style="padding:14px 0;${last ? "" : "border-bottom:1px solid #ece6da;"}width:38%;vertical-align:top;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#8a7f6e;">${label}</td>
      <td style="padding:14px 0;${last ? "" : "border-bottom:1px solid #ece6da;"}vertical-align:top;font:15px/1.5 Arial,Helvetica,sans-serif;color:#1b1b1b;">${value}</td>
    </tr>`;

  const link = (href: string, text: string) =>
    `<a href="${href}" style="color:#a2600f;font-weight:bold;text-decoration:none;">${esc(text)}</a>`;

  const message = lead.message.trim()
    ? esc(lead.message.trim()).replace(/\r?\n/g, "<br>")
    : `<span style="color:#8a7f6e;font-style:italic;">${c.noMessage}</span>`;

  const html = `<!doctype html>
<html lang="${emailLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(c.subject(lead))}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(c.preheader(lead))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e4dccb;">

      <!-- Encabezado de marca -->
      <tr><td style="background:#0d151e;padding:22px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font:bold 22px/1 Arial,Helvetica,sans-serif;letter-spacing:4px;color:#e8a33d;">ALPHA</td>
          <td align="right" style="font:12px/1.3 Arial,Helvetica,sans-serif;color:#b6ada0;letter-spacing:1px;text-transform:uppercase;">Roofing &amp; Gutters</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#e8a33d;height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>

      <!-- Título -->
      <tr><td style="padding:30px 32px 6px;">
        <div style="display:inline-block;background:#f6efe0;border:1px solid #e6d5ae;color:#a2600f;border-radius:99px;padding:5px 12px;font:bold 12px/1 Arial,Helvetica,sans-serif;letter-spacing:1px;text-transform:uppercase;">${esc(lead.service)}</div>
        <h1 style="margin:14px 0 6px;font:bold 24px/1.25 Arial,Helvetica,sans-serif;color:#0d151e;">${c.title}</h1>
        <p style="margin:0;font:13px/1.5 Arial,Helvetica,sans-serif;color:#8a7f6e;">${c.received}: ${esc(when)}</p>
      </td></tr>

      <!-- Datos -->
      <tr><td style="padding:22px 32px 4px;">
        <p style="margin:0 0 4px;font:bold 13px/1 Arial,Helvetica,sans-serif;color:#0d151e;text-transform:uppercase;letter-spacing:1px;">${c.contact}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row(c.name, `<strong>${esc(lead.name)}</strong>`)}
          ${row(c.phone, link(telHref(lead.phone), lead.phone))}
          ${row(c.email, link(`mailto:${lead.email}`, lead.email))}
          ${row(c.service, esc(lead.service))}
          ${row(c.language, c.langNames[lead.lang], true)}
        </table>
      </td></tr>

      <!-- Mensaje -->
      <tr><td style="padding:18px 32px 6px;">
        <p style="margin:0 0 10px;font:bold 13px/1 Arial,Helvetica,sans-serif;color:#0d151e;text-transform:uppercase;letter-spacing:1px;">${c.message}</p>
        <div style="background:#faf7f1;border-left:4px solid #e8a33d;border-radius:4px;padding:16px 18px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#1b1b1b;">${message}</div>
      </td></tr>

      <!-- Acciones -->
      <tr><td style="padding:24px 32px 30px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#0d151e;border-radius:6px;">
            <a href="${telHref(lead.phone)}" style="display:inline-block;padding:13px 22px;font:bold 14px/1 Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;">${c.call} · ${esc(lead.phone)}</a>
          </td>
          <td style="width:10px;">&nbsp;</td>
          <td style="background:#e8a33d;border-radius:6px;">
            <a href="${mailto}" style="display:inline-block;padding:13px 22px;font:bold 14px/1 Arial,Helvetica,sans-serif;color:#0d151e;text-decoration:none;">${c.reply}</a>
          </td>
        </tr></table>
      </td></tr>

      <!-- Pie -->
      <tr><td style="background:#faf7f1;border-top:1px solid #ece6da;padding:18px 32px;font:12px/1.5 Arial,Helvetica,sans-serif;color:#8a7f6e;">
        ${c.footer}<br>
        <strong style="color:#5d554a;">${esc(BRAND.name)}</strong> · Lic. ${BRAND.license1} · ${BRAND.license2}
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    c.title.toUpperCase(),
    `${c.received}: ${when}`,
    "",
    `${c.name}: ${lead.name}`,
    `${c.phone}: ${lead.phone}`,
    `${c.email}: ${lead.email}`,
    `${c.service}: ${lead.service}`,
    `${c.language}: ${c.langNames[lead.lang]}`,
    "",
    `${c.message}:`,
    lead.message.trim() || c.noMessage,
    "",
    "—",
    BRAND.name,
  ].join("\n");

  return { subject: c.subject(lead), html, text };
}
