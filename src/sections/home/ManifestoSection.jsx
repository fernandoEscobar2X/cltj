import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Img from "../../components/media/Img";
import Reveal from "../../components/shared/Reveal";

// Manifiesto: qué se corta y para qué, con fotos reales metidas en el texto.
// Las palabras se encienden conforme se recorre la sección; las fotos crecen
// al pasar el cursor (desktop) para enseñar la pieza sin salir de la frase.
const phrase = [
  { t: "Cortamos" },
  { img: "letrero-agara", alt: "Letrero de acrílico espejo dorado" },
  { t: "acrílico," },
  { img: "mapa-mundi-led", alt: "Mapamundi de madera con luz LED" },
  { t: "madera," },
  { img: "vinil-felica", alt: "Vinil en cristal de escaparate" },
  { t: "vinil" },
  { t: "y" },
  { img: "papel-picado-logo", alt: "Papel picado con logotipo" },
  { t: "papel" },
  { t: "para" },
  { t: "que" },
  { t: "tu" },
  { t: "marca" },
  { t: "se" },
  { t: "vea" },
  { t: "en" },
  { t: "la" },
  { t: "calle," },
  { t: "en" },
  { t: "el" },
  { t: "mostrador" },
  { t: "y" },
  { t: "en" },
  { t: "la" },
  { t: "fiesta.", accent: true },
];

const facts = [
  { value: "24 h", label: "para recibir precio y muestra digital" },
  { value: "1", label: "pieza mínima en letreros, trofeos y regalos" },
  { value: "20", label: "diseños de papel picado listos para tu nombre" },
];

// Las palabras pasan de gris a tinta. El gris de partida conserva contraste
// de texto grande (3:1 sobre el papel), así que se lee aun sin animación.
const FROM = "#8b857e";
const TO_INK = "#141215";
const TO_ACCENT = "#8a2ac9";

function Word({ children, progress, range, accent }) {
  const color = useTransform(progress, range, [FROM, accent ? TO_ACCENT : TO_INK]);
  return (
    <m.span style={{ color }} className={accent ? "t-script text-[1.25em] leading-none" : undefined}>
      {children}
    </m.span>
  );
}

function InlineShot({ id, alt, progress, range }) {
  const scale = useTransform(progress, range, [0.6, 1]);
  return (
    <m.span
      style={{ scale }}
      className="group relative mx-[0.08em] inline-block h-[0.78em] w-[1.35em] -translate-y-[0.04em] align-baseline transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:w-[2.4em]"
    >
      <Img id={id} alt={alt} sizes="(min-width: 768px) 16vw, 24vw" className="absolute inset-0 rounded-full" />
    </m.span>
  );
}

export default function ManifestoSection() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const total = phrase.length;

  return (
    <section ref={ref} className="defer-render bg-[var(--paper)] py-24 md:py-36" aria-labelledby="manifiesto">
      <div className="shell">
        <h2 id="manifiesto" className="sr-only">
          Qué hacemos
        </h2>
        <p className="max-w-[26ch] font-statement text-[clamp(2.3rem,5.6vw,5.8rem)] font-bold leading-[1.02] tracking-[-0.02em] [font-stretch:80%]">
          {phrase.map((item, i) => {
            const start = i / total;
            const range = reduceMotion ? [0, 0] : [start * 0.9, start * 0.9 + 0.12];
            return item.img ? (
              <InlineShot key={i} id={item.img} alt={item.alt} progress={scrollYProgress} range={range} />
            ) : (
              <span key={i}>
                <Word progress={scrollYProgress} range={range} accent={item.accent}>
                  {item.t}
                </Word>{" "}
              </span>
            );
          })}
        </p>

        <dl className="mt-16 grid gap-10 border-t border-[var(--line-2)] pt-10 sm:grid-cols-3 md:mt-24">
          {facts.map((fact, i) => (
            <Reveal key={fact.value} delay={i * 0.08}>
              <dt className="t-display text-[clamp(4rem,9vw,8rem)] text-[var(--ink)]">{fact.value}</dt>
              <dd className="m-0 mt-3 max-w-[22ch] text-[1.08rem] text-[var(--ink-2)]">{fact.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
