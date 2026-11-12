/* Genera lib/illinois.ts con la silueta real de Illinois y sus condados
   a partir de us-atlas (datos del US Census, escala 1:10m).
   Uso: node scripts/build-illinois.mjs */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("us-atlas/counties-10m.json"), "utf8"));

const counties = feature(topo, topo.objects.counties).features.filter((f) => String(f.id).startsWith("17"));
const state = feature(topo, topo.objects.states).features.find((f) => String(f.id) === "17");

// Proyección equirectangular corregida por la latitud media (suficiente para un solo estado)
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
const walk = (g, fn) => {
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  polys.forEach((p) => p.forEach((ring) => ring.forEach(fn)));
};
walk(state.geometry, ([x, y]) => {
  minX = Math.min(minX, x); maxX = Math.max(maxX, x);
  minY = Math.min(minY, y); maxY = Math.max(maxY, y);
});
const k = Math.cos(((minY + maxY) / 2) * (Math.PI / 180));
const H = 600;
const scale = H / (maxY - minY);
const W = Math.round((maxX - minX) * k * scale);
const PAD = 8;
const proj = ([lon, lat]) => [+((lon - minX) * k * scale + PAD).toFixed(1), +((maxY - lat) * scale + PAD).toFixed(1)];

const toPath = (g) => {
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  return polys
    .map((p) => p.map((ring) => "M" + ring.map((c) => proj(c).join(",")).join("L") + "Z").join(""))
    .join("");
};

// Condados del centro de Illinois (zona del código de área 217)
const CENTRAL = new Set([
  "17001", "17009", "17017", "17019", "17021", "17023", "17029", "17035", "17039", "17041",
  "17045", "17049", "17061", "17107", "17115", "17117", "17129", "17135", "17137", "17139",
  "17147", "17149", "17167", "17169", "17171", "17173", "17183",
]);

const out = counties.map((f) => ({
  id: String(f.id),
  name: f.properties.name,
  central: CENTRAL.has(String(f.id)),
  d: toPath(f.geometry),
}));

const CITIES = [
  { name: "Springfield", lon: -89.6501, lat: 39.7817, major: true },
  { name: "Champaign", lon: -88.2434, lat: 40.1164, major: true },
  { name: "Decatur", lon: -88.9548, lat: 39.8403, major: true },
  { name: "Danville", lon: -87.63, lat: 40.1245 },
  { name: "Mattoon", lon: -88.3728, lat: 39.4831 },
  { name: "Quincy", lon: -91.4099, lat: 39.9356 },
  { name: "Jacksonville", lon: -90.2290, lat: 39.7339 },
  { name: "Chicago", lon: -87.6298, lat: 41.8781, ref: true },
  { name: "St. Louis", lon: -90.1994, lat: 38.627, ref: true },
].map((c) => {
  const [x, y] = proj([c.lon, c.lat]);
  return { name: c.name, x, y, major: !!c.major, ref: !!c.ref };
});

const file = `/* Generado por scripts/build-illinois.mjs — no editar a mano.
   Fuente: us-atlas (US Census Bureau, 1:10m). */
export const IL_VIEWBOX = "0 0 ${W + PAD * 2} ${H + PAD * 2}";
export const IL_OUTLINE = ${JSON.stringify(toPath(state.geometry))};
export const IL_COUNTIES: { id: string; name: string; central: boolean; d: string }[] = ${JSON.stringify(out)};
export const IL_CITIES: { name: string; x: number; y: number; major: boolean; ref: boolean }[] = ${JSON.stringify(CITIES)};
`;
writeFileSync(new URL("../lib/illinois.ts", import.meta.url), file);
console.log(`counties: ${out.length}, central: ${out.filter((c) => c.central).length}, viewBox ${W}x${H}, ${(file.length / 1024).toFixed(0)} KB`);
