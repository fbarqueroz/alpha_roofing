# Alpha Roofing & Gutters — Next.js

Sitio de Alpha Roofing & Gutters con **Next.js 16 (App Router)**, **React 19** y **Motion**.

## Correr

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Idiomas (inglés / español)

- `/` redirige a `/en` o `/es` (`proxy.ts`): primero respeta el idioma que el visitante eligió a mano
  (cookie `lang`, dura 1 año); si no hay, usa el idioma del navegador (`Accept-Language`).
- Cada idioma se genera como página estática ya traducida (sin parpadeo de inglés → español).
- El selector **EN | ES** del menú cambia el idioma al instante, actualiza la URL y guarda la elección.
- Textos en `lib/content.ts`.

## Formulario → correo

El formulario envía a `app/api/contact/route.ts`, que valida los datos, filtra bots (campo trampa)
y manda un **correo HTML con formato** (encabezado de marca, tabla de datos, mensaje, botones de
"Llamar" y "Responder") más una versión de texto plano. "Responder" contesta directo al cliente.

1. Copia `.env.example` a `.env.local` y llena los datos SMTP (Gmail, Yahoo o Resend con contraseña de aplicación).
2. En desarrollo, si no hay SMTP configurado, el correo no se envía: se guarda una vista previa en
   `.email-previews/latest.html` para revisarlo.
3. En producción, configura las mismas variables en tu hosting (por ejemplo Vercel → Settings → Environment Variables).

> El sitio necesita un servidor Node (Vercel, Netlify, etc.) por la ruta de correo y el proxy de idioma; no sirve como exportación estática pura.

## Mapa de Illinois

`lib/illinois.ts` se genera con datos reales del US Census (paquete `us-atlas`):

```bash
node scripts/build-illinois.mjs
```

Para cambiar los condados resaltados o las ciudades, edita las listas `CENTRAL` y `CITIES` del script y vuelve a correrlo.
