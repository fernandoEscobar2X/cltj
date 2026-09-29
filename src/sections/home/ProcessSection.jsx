import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Plus } from "@phosphor-icons/react";
import Reveal from "../../components/shared/Reveal";
import { faqs, process } from "../../data/siteContent";

const EASE = [0.16, 1, 0.3, 1];

function Faq({ item, open, onToggle, id }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="border-b border-[var(--line-2)]">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-statement text-[clamp(1.35rem,2vw,1.75rem)] font-bold leading-tight [font-stretch:85%]">{item.question}</span>
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line-2)] transition-all duration-500 ${
              open ? "rotate-45 border-[var(--laser)] bg-[var(--laser)]" : ""
            }`}
            aria-hidden="true"
          >
            <Plus size={18} weight="bold" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <m.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] pb-7 text-[1.1rem] leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// Cómo se pide + preguntas frecuentes. Las respuestas son cortas y literales:
// las mismas alimentan el FAQPage del JSON-LD que leen buscadores y asistentes.
export default function ProcessSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="proceso" className="defer-render bg-[var(--card)] py-24 md:py-36" aria-labelledby="proceso-titulo">
      <div className="shell">
        <Reveal>
          <h2 id="proceso-titulo" className="t-h2">
            Cómo se pide
          </h2>
          <p className="t-script -mt-[0.05em] rotate-[-3deg] text-[clamp(2.4rem,4.4vw,4rem)]">sin vueltas</p>
        </Reveal>

        <ol className="m-0 mt-14 grid gap-12 p-0 md:mt-20 md:grid-cols-3 md:gap-10">
          {process.map((step, i) => (
            <Reveal as="li" key={step.word} delay={i * 0.1} className="list-none">
                <p className="font-display text-[clamp(3.4rem,6.4vw,6.2rem)] font-extrabold uppercase leading-[0.85]" aria-hidden="true">
                  {step.word}
                </p>
                <div className="mt-5 h-[3px] w-16 bg-[var(--laser)]" />
                <p className="mt-5 max-w-[30ch] text-[1.12rem] leading-relaxed text-[var(--ink-2)]">
                  <span className="sr-only">{step.word}. </span>
                  {step.body}
                </p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-24 grid gap-10 border-t border-[var(--line-2)] pt-14 md:mt-36 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-h2" id="preguntas">
              Preguntas
            </h2>
            <p className="t-lead mt-4 max-w-[28ch] text-[var(--ink-2)]">Lo que más nos preguntan por WhatsApp, contestado aquí.</p>
          </div>
          <div className="lg:col-span-8">
            {faqs.map((item, i) => (
              <Faq key={item.question} id={`faq-${i}`} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
