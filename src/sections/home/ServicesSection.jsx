import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Img from "../../components/media/Img";
import { services } from "../../data/siteContent";
import { waUrl } from "../../lib/whatsappQuote";

const EASE = [0.16, 1, 0.3, 1];

function ServiceAction({ service, className = "", light = false }) {
  const cls = `btn ${light ? "btn--light" : "btn--laser"} ${className}`;
  if (service.to) {
    return (
      <Link to={service.to} className={cls}>
        Diseñar el mío
        <ArrowUpRight size={18} weight="bold" />
      </Link>
    );
  }
  return (
    <a href={waUrl(service.quote)} target="_blank" rel="noopener noreferrer" className={cls}>
      Pedir precio
      <ArrowUpRight size={18} weight="bold" />
    </a>
  );
}

// Desktop: lista de rótulos. Al pasar por uno, su foto llena la sección.
function DesktopList() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <div className="relative hidden min-h-[100svh] overflow-hidden bg-[var(--night)] text-[var(--on-night)] lg:block" data-header="dark">
      <AnimatePresence initial={false}>
        <m.div
          key={current.id}
          className="absolute inset-0"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Img id={current.media} alt={current.alt} sizes="100vw" className="absolute inset-0" />
        </m.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,13,16,0.94)_0%,rgba(14,13,16,0.82)_45%,rgba(14,13,16,0.35)_100%)]" />

      <div className="shell relative grid min-h-[100svh] grid-cols-12 items-center gap-8 py-28">
        <div className="col-span-7">
          <p className="t-script t-script--light text-[3rem]">lo que hacemos</p>
          <ul className="m-0 mt-4 p-0">
            {services.map((service, index) => {
              const on = index === active;
              return (
                <li key={service.id} className="list-none border-b border-[var(--line-night)]">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    aria-expanded={on}
                    className="group flex w-full items-center justify-between gap-6 py-3 text-left"
                  >
                    <span
                      className={`font-display text-[clamp(3rem,5.6vw,5.8rem)] font-extrabold uppercase leading-[0.92] transition-[color,transform] duration-500 ${
                        on ? "translate-x-4 text-[var(--on-night)]" : "text-[var(--on-night-3)] group-hover:text-[var(--on-night-2)]"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--laser)] text-[var(--ink)] transition-all duration-500 ${
                        on ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      }`}
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={22} weight="bold" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="col-span-4 col-start-9 self-end">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-[var(--radius-l)] bg-[var(--night)]/70 p-7 backdrop-blur-xl"
            >
              <h3 className="t-h3">{current.long}</h3>
              <p className="mt-3 text-[1.08rem] leading-relaxed text-[var(--on-night-2)]">{current.description}</p>
              <ul className="m-0 mt-5 flex flex-wrap gap-2 p-0">
                {current.tags.map((tag) => (
                  <li key={tag} className="list-none rounded-full border border-[var(--line-night)] px-3.5 py-1.5 text-[0.95rem] text-[var(--on-night-2)]">
                    {tag}
                  </li>
                ))}
              </ul>
              <ServiceAction service={current} className="mt-6 w-full" />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Móvil: tarjetas grandes que se deslizan con el dedo.
function MobileCards() {
  return (
    <div className="bg-[var(--night)] py-20 text-[var(--on-night)] lg:hidden" data-header="dark">
      <div className="shell">
        <p className="t-script t-script--light text-[2.6rem]">lo que hacemos</p>
        <h2 className="t-h2 mt-1">Seis cosas que cortamos bien</h2>
      </div>
      <ul className="snap-x-mandatory hide-scrollbar m-0 mt-8 flex gap-3 overflow-x-auto px-[clamp(1.1rem,4vw,3.5rem)] pb-2">
        {services.map((service) => (
          <li key={service.id} className="w-[84vw] max-w-[25rem] shrink-0 snap-center list-none">
            <article className="overflow-hidden rounded-[var(--radius-l)] bg-[var(--night-2)]">
              <Img id={service.media} alt={service.alt} sizes="84vw" className="aspect-[4/5]" />
              <div className="p-5">
                <h3 className="font-display text-[2.6rem] font-extrabold uppercase leading-[0.9]">{service.title}</h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-[var(--on-night-2)]">{service.description}</p>
                <ServiceAction service={service} className="mt-5 w-full" />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="defer-render scroll-mt-0">
      <h2 id="servicios-titulo" className="sr-only">
        Servicios de corte láser, publicidad y regalos en Tijuana
      </h2>
      <DesktopList />
      <MobileCards />
    </section>
  );
}
