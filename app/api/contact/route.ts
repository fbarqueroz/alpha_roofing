import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { BRAND, COPY } from "@/lib/content";
import { buildLeadEmail, type Lead } from "@/lib/email";
import { isLang } from "@/lib/i18n";

export const runtime = "nodejs";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SERVICES = new Set([...COPY.en.contact.form.serviceOpts, ...COPY.es.contact.form.serviceOpts]);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Campo trampa para bots: si viene lleno, fingimos éxito y no enviamos nada
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const lead: Lead = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 200),
    service: clean(body.service, 60),
    message: clean(body.message, 4000),
    lang: isLang(body.lang) ? body.lang : "en",
  };

  const errors: string[] = [];
  if (lead.name.length < 2) errors.push("name");
  if (lead.phone.replace(/\D/g, "").length < 7) errors.push("phone");
  if (!EMAIL_RE.test(lead.email)) errors.push("email");
  if (!SERVICES.has(lead.service)) errors.push("service");
  if (errors.length) return NextResponse.json({ ok: false, error: "validation", fields: errors }, { status: 422 });

  const emailLang = isLang(process.env.CONTACT_EMAIL_LANG) ? process.env.CONTACT_EMAIL_LANG : "es";
  const { subject, html, text } = buildLeadEmail(lead, emailLang);

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const to = process.env.CONTACT_TO || BRAND.email;
  const from = process.env.CONTACT_FROM || SMTP_USER;

  // Sin SMTP configurado en desarrollo: guarda una vista previa en .email-previews/
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV !== "production") {
      const dir = path.join(process.cwd(), ".email-previews");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, "latest.html"), html, "utf8");
      await writeFile(path.join(dir, "latest.txt"), `Subject: ${subject}\nTo: ${to}\nReply-To: ${lead.email}\n\n${text}`, "utf8");
      console.log(`[contact] SMTP no configurado — vista previa guardada en .email-previews/latest.html`);
      return NextResponse.json({ ok: true, preview: true });
    }
    console.error("[contact] Faltan variables SMTP_HOST / SMTP_USER / SMTP_PASS");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  try {
    const port = Number(SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Alpha Roofing — Web" <${from}>`,
      to,
      replyTo: `"${lead.name.replace(/"/g, "")}" <${lead.email}>`,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error enviando correo:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
