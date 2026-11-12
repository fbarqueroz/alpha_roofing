"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IL_CITIES, IL_COUNTIES, IL_OUTLINE, IL_VIEWBOX } from "@/lib/illinois";
import { EASE } from "./Motion";

/* Solo se rotulan las ciudades principales (las demás quedan como punto)
   para que las etiquetas no se encimen. */
const LABELS: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  Springfield: { dx: 0, dy: -11, anchor: "middle" },
  Decatur: { dx: 0, dy: 17, anchor: "middle" },
  Champaign: { dx: 0, dy: -11, anchor: "middle" },
  Chicago: { dx: -8, dy: 4, anchor: "end" },
  "St. Louis": { dx: 8, dy: 4, anchor: "start" },
};

/* Mapa real de Illinois (condados del US Census). Los condados del centro
   del estado se resaltan en dorado; al pasar el cursor se ve el nombre. */
export function IllinoisMap({ label }: { label: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const centralIdx = new Map(IL_COUNTIES.filter((c) => c.central).map((c, i) => [c.id, i]));

  return (
    <div className="ilmap">
      <svg viewBox={IL_VIEWBOX} role="img" aria-label={label}>
        <g className="ilmap__counties">
          {IL_COUNTIES.map((c) => {
            const i = centralIdx.get(c.id);
            const central = i !== undefined;
            return (
              <motion.path
                key={c.id}
                d={c.d}
                className={`ilmap__county ${central ? "is-central" : ""}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: central ? 0.9 + (i ?? 0) * 0.03 : 0.2 }}
                onMouseEnter={() => setHover(`${c.name} County`)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </g>
        <motion.path
          d={IL_OUTLINE}
          className="ilmap__outline"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
        />
        {IL_CITIES.map((c, i) => (
          <motion.g
            key={c.name}
            className={`ilmap__city ${c.major ? "is-major" : ""} ${c.ref ? "is-ref" : ""}`}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.6 + i * 0.07, ease: EASE }}
          >
            {c.major && <circle cx={c.x} cy={c.y} r="10" className="ilmap__pulse" />}
            <circle cx={c.x} cy={c.y} r={c.major ? 4.5 : 3} className="ilmap__dot" />
            {LABELS[c.name] && (
              <text x={c.x + LABELS[c.name].dx} y={c.y + LABELS[c.name].dy} textAnchor={LABELS[c.name].anchor}>
                {c.name}
              </text>
            )}
          </motion.g>
        ))}
      </svg>
      <div className={`ilmap__tip ${hover ? "is-on" : ""}`} aria-hidden="true">
        {hover ?? " "}
      </div>
    </div>
  );
}
