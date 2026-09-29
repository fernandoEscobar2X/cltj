# TJ Láser

Sitio de TJ Láser, taller de corte y grabado láser en Tijuana: letreros, displays con QR, vinil, trofeos, regalos y papel picado personalizado. Cotización por WhatsApp.

## Stack

React 19 · Vite · Tailwind CSS 4 · framer-motion (LazyMotion) · Lenis · React Router · React Helmet Async · Netlify. Prerender con Puppeteer para SEO.

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Home: hero con muro de trabajos, servicios, gancho de papel picado en vivo, trabajos, reels de Instagram, proceso y preguntas frecuentes. |
| `/papel-picado` | Estudio de papel picado: 20 diseños reales, nombre o logo, color, medida, paquete y precio en vivo. Pedido por WhatsApp. |
| `/galeria` | Galería filtrable con lightbox. |
| `/privacidad` | Aviso de privacidad. |

Cada ruta nueva hay que darla de alta en `scripts/prerender.mjs`, `src/routes.jsx` y `public/sitemap.xml`.

## Scripts

```bash
npm run dev          # desarrollo
npm run build        # build + prerender (lo que corre Netlify)
npm run serve:dist   # sirve dist/ con las cabeceras de netlify.toml
npm run audit        # Lighthouse contra dist servido (node scripts/audit.mjs <url> mobile|desktop)

npm run media        # regenera fotos y video (AVIF/WebP) desde assets/
npm run fonts        # regenera las fuentes subsetteadas en public/fonts/
npm run papel        # regenera los SVG del papel picado desde el PDF
```

## Fotos y video

Los originales viven en `assets/originales-img-featured/` (fotos) y `assets/originales-video/` (video). `npm run media` genera en `public/media/` versiones AVIF y WebP en varios anchos con un hash en el nombre (caché inmutable), un LQIP y el color dominante, y escribe `src/data/media.json`. En el código se usan con `<Img id="..." sizes="..." />`.

Para sumar un trabajo: poner la foto en `assets/originales-img-featured/<id>.jpeg`, correr `npm run media` y agregarlo en `src/data/portfolio.js`.

## Tipografía

`npm run fonts` toma los woff2 de `@fontsource` y los recorta a los glifos del español (y a los ejes variables que se usan):

- **Big Shoulders Stencil**: titulares (stencil de rótulo, como una pieza cortada).
- **Yellowtail**: acento de rotulista.
- **Bricolage Grotesque** (negrita, condensada): frases y subtítulos.
- **Instrument Sans**: texto.
- **Saira Stencil / Stardos Stencil**: letras con que el motor corta el nombre del cliente.

## Motor de papel picado

- Diseños: `assets/papel-picado/disenos.pdf` → `npm run papel` → `public/papel/<id>.svg` (papel opaco, cortes transparentes). En los diseños con nombre el script quita el texto original para que el motor corte el del cliente. Al regenerarlos, subir `papelAssetVersion` en `src/data/papelPicado.js`.
- Catálogo, colores, medidas y precios: `src/data/papelPicado.js`. Reglas: un diseño y un color por pedido, solo papel de china.
- Composición del banderín (texto stencil, logo en silueta, textura, doblez, sombra): `src/components/papel/engine/compose.js`.
- Escena con física (viento, empujar y columpiar con el cursor o el dedo, día y noche): `src/components/papel/engine/PapelScene.jsx`. Un solo `<canvas>`; se pausa fuera de pantalla.

## SEO

- HTML prerenderizado por ruta (`scripts/prerender.mjs`); el JS arranca después del primer pintado.
- JSON-LD: `LocalBusiness` único (`src/data/schema.js`), `FAQPage`, `Product` con precios del papel picado, `CollectionPage` de la galería y `BreadcrumbList`.
- `public/llms.txt` resume el negocio para asistentes de IA; `robots.txt` los permite.
