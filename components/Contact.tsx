"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone, Send } from "lucide-react";
import { BRAND } from "@/lib/content";
import { useLang } from "./LangProvider";
import { EASE, Reveal, SplitWords } from "./Motion";

interface FormState {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  company: string; // campo trampa para bots (oculto)
}
type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const { t, lang } = useLang();
  const f = t.contact.form;
  const a = t.contact.aside;
  const empty = (): FormState => ({ name: "", phone: "", email: "", service: f.serviceOpts[0], message: "", company: "" });
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<Status>("idle");

  // Al cambiar de idioma, el servicio elegido pasa a su traducción
  useEffect(() => {
    setForm((prev) => {
      const other = lang === "es" ? ["Roofing", "Gutters", "Siding", "Not sure yet"] : ["Techos", "Canales", "Siding", "Aún no sé"];
      const i = other.indexOf(prev.service);
      return { ...prev, service: f.serviceOpts[i >= 0 ? i : 0] };
    });
  }, [lang, f.serviceOpts]);

  const update = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error || "bad response");
      setStatus("sent");
      setForm(empty());
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="head head--center" key={lang}>
        <Reveal>
          <span className="eyebrow eyebrow--center">{t.contact.eyebrow}</span>
        </Reveal>
        <h2 className="section__title center">
          <SplitWords text={t.contact.title} />
        </h2>
        <Reveal delay={150}>
          <p className="section__sub center">{t.contact.sub}</p>
        </Reveal>
      </div>

      <Reveal delay={100} className="contact__card">
        {/* Panel lateral: contacto directo (secundario al formulario) */}
        <aside className="contact__aside">
          <span className="contact__asideeyebrow">{a.eyebrow}</span>
          <h3 className="contact__asidetitle">{a.title}</h3>
          <p className="contact__asidesub">{a.sub}</p>

          <a className="contact__primary" href={`tel:${BRAND.phoneHref}`}>
            <span className="contact__icon">
              <Phone size={18} />
            </span>
            <span>
              <small>
                {BRAND.owner} · {a.owner}
              </small>
              <strong>{BRAND.phone}</strong>
            </span>
          </a>

          <ul className="contact__list">
            <li>
              <a href={`tel:${BRAND.repPhoneHref}`}>
                <Phone size={15} />
                <span>
                  <small>
                    {BRAND.rep} · {a.rep}
                  </small>
                  {BRAND.repPhone}
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`}>
                <Mail size={15} />
                <span>
                  <small>{a.email}</small>
                  {BRAND.email}
                </span>
              </a>
            </li>
          </ul>

          <ul className="contact__points">
            {a.points.map((p) => (
              <li key={p}>
                <CheckCircle2 size={15} /> {p}
              </li>
            ))}
          </ul>
          <p className="contact__license">{t.hero.license}</p>
        </aside>

        <form className="form" onSubmit={submit}>
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  className="form__success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <svg width="64" height="64" viewBox="0 0 72 72" aria-hidden="true">
                    <motion.circle cx="36" cy="36" r="32" fill="none" stroke="#e8a33d" strokeWidth="2.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE }} />
                    <motion.path d="M22 37 L32 47 L51 27" fill="none" stroke="#ffd89a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5, ease: EASE }} />
                  </svg>
                  <p>{f.sent}</p>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStatus("idle")}>
                    OK
                  </button>
                </motion.div>
              ) : (
                <motion.div key="fields" className="form__fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="form__row">
                    <Field label={f.name}>
                      <input required autoComplete="name" value={form.name} onChange={update("name")} placeholder={f.namePh} />
                    </Field>
                    <Field label={f.phone}>
                      <input required type="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} placeholder={f.phonePh} />
                    </Field>
                  </div>
                  <Field label={f.email}>
                    <input type="email" required autoComplete="email" value={form.email} onChange={update("email")} placeholder={f.emailPh} />
                  </Field>
                  <Field label={f.service} group>
                    <div className="chips" role="radiogroup" aria-label={f.service}>
                      {f.serviceOpts.map((opt) => (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={form.service === opt}
                          key={opt}
                          className={`chip ${form.service === opt ? "chip--on" : ""}`}
                          onClick={() => setForm((s) => ({ ...s, service: opt }))}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={f.message}>
                    <textarea rows={3} value={form.message} onChange={update("message")} placeholder={f.messagePh} />
                  </Field>

                  {/* Campo trampa: invisible para personas, los bots lo llenan */}
                  <input className="form__hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={update("company")} name="company" />

                  <button className="btn btn--gold btn--lg btn--block" type="submit" disabled={status === "sending"}>
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

                  <AnimatePresence>
                    {status === "error" && (
                      <motion.p
                        className="form__note form__note--err"
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle size={15} /> {f.error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
      </Reveal>
    </section>
  );
}

function Field({ label, children, group = false }: { label: string; children: ReactNode; group?: boolean }) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="field">
      <span className="field__label">{label}</span>
      {children}
    </Tag>
  );
}
