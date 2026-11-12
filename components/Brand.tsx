"use client";

import { useId } from "react";
import { motion } from "motion/react";

/* Logo "A" de doble techo. Con `draw` el trazo se dibuja al aparecer. */
export function RooflineMark({ size = 40, draw = false, delay = 0 }: { size?: number; draw?: boolean; delay?: number }) {
  const id = useId().replace(/:/g, "");
  const grad = `gold-${id}`;
  const stroke = {
    stroke: `url(#${grad})`,
    strokeWidth: 4.5,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    fill: "none",
  };
  const pathAnim = (d: number) =>
    draw
      ? {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 1.1, delay: delay + d, ease: [0.65, 0, 0.35, 1] as const },
        }
      : {};
  const sq = (d: number) =>
    draw
      ? {
          initial: { scale: 0, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true },
          transition: { type: "spring" as const, stiffness: 380, damping: 18, delay: delay + 0.9 + d },
        }
      : {};

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd89a" />
          <stop offset="0.5" stopColor="#e8a33d" />
          <stop offset="1" stopColor="#b5741f" />
        </linearGradient>
      </defs>
      <motion.path d="M6 30 L32 6 L58 30 M6 30 L15 30 M58 30 L49 30" {...stroke} {...pathAnim(0)} />
      <motion.path d="M10 46 L32 26 L54 46 M10 46 L18 46 M54 46 L46 46" {...stroke} {...pathAnim(0.25)} />
      {[
        [27, 34, 1],
        [33, 34, 1],
        [27, 40, 0.75],
        [33, 40, 0.75],
      ].map(([x, y, o], i) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width="4"
          height="4"
          fill="#e8a33d"
          opacity={o}
          style={{ transformOrigin: `${x + 2}px ${y + 2}px` }}
          {...sq(i * 0.06)}
        />
      ))}
    </svg>
  );
}

/* Divisor de techos que se "dibuja" al entrar en pantalla */
export function RoofDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  let pts = "0,20";
  for (let i = 0; i < 10; i++) {
    const o = i * 32;
    pts += ` ${o + 8},4 ${o + 16},20 ${o + 24},4 ${o + 32},20`;
  }
  const d = "M" + pts.split(" ").join(" L");
  return (
    <div className={`roofdiv ${flip ? "roofdiv--flip" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 320 20" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`div-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e8a33d" stopOpacity="0" />
            <stop offset="0.5" stopColor="#e8a33d" stopOpacity="0.9" />
            <stop offset="1" stopColor="#e8a33d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={d}
          fill="none"
          stroke={`url(#div-${id})`}
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </div>
  );
}
