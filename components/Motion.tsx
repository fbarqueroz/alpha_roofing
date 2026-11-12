"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* Aparición al hacer scroll: sube + desenfoque → nítido */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Título que entra palabra por palabra. El disparador está en el contenedor
   porque cada palabra empieza recortada dentro de su máscara. */
export function SplitWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {words.map((w, i) => (
        <span key={i} className="split__mask" aria-hidden="true">
          <motion.span
            className="split__word"
            variants={{
              hidden: { y: "110%", rotate: 4, opacity: 0 },
              show: { y: "0%", rotate: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, delay: delay + i * 0.05, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}

/* Desplazamiento suave a una sección */
export function scrollToId(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
