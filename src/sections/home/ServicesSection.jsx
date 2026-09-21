import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import Parallax from "../../components/shared/Parallax";
import Reveal from "../../components/shared/Reveal";
import Shot from "../../components/shared/Shot";
import { services } from "../../data/siteContent";
import { waUrl } from "../../lib/whatsappQuote";

const EASE = [0.16, 1, 0.3, 1];

function Pieces({ items, className = "" }) {
  return (
    <ul className={`m-0 flex flex-wrap gap-x-4 gap-y-1 p-0 ${className}`}>
      {items.map((piece) => (
        <li key={piece} className="list-none">
          {piece}
        </li>
      ))}
    </ul>
  );
}

export default function ServicesSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = services[active] ?? services[0];

  return (
    <section id="servicios" className="bg-[var(--bg)] py-20 md:py-28">
      <div className="layout-shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <h2 className="sr-only">Servicios</h2>

          {/* Móvil: tarjeta completa por servicio, con piezas y CTA. */}
          <div className="grid gap-12 lg:hidden">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.05} y={24}>
                <article>
                  <Shot className="aspect-[4/5] bg-[var(--bg-deep)]">
                    <img src={service.image} alt={service.imageAlt} className="h-full w-full object-cover" loading="lazy" />
                  </Shot>
                  <h3 className="mt-5 text-[2.2rem] font-semibold leading-[1] tracking-tight">{service.title}</h3>
                  <Pieces items={service.pieces} className="mt-3 text-[var(--ink-soft)]" />
                  <a
                    href={waUrl(service.quote)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
                  >
                    {service.cta}
                    <ArrowUpRight size={16} weight="bold" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Desktop: lista fluida; la info vive en el panel de la derecha. */}
          <ul className="hidden divide-y divide-[var(--line)] lg:block">
            {services.map((service, index) => {
              const isActive = index === active;
              return (
                <li key={service.id}>
                  <Reveal delay={index * 0.06} y={24}>
                    <a
                      href={waUrl(service.quote)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className="group grid grid-cols-[1fr_auto] items-center gap-5 py-8"
                    >
                      <span
                        className={`block text-[clamp(2.6rem,5vw,4.6rem)] leading-[1] tracking-tight transition-[font-weight,transform] duration-300 ${
                          isActive ? "translate-x-2 font-semibold" : "font-light"
                        }`}
                      >
                        {service.title}
                      </span>
                      <ArrowRight
                        size={30}
                        className={`shrink-0 transition-all duration-300 ${
                          isActive
                            ? "translate-x-0 text-[var(--laser-ink)] opacity-100"
                            : "-translate-x-3 text-[var(--ink-mute)] opacity-0"
                        }`}
                      />
                    </a>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden lg:col-span-6 lg:block">
          <Parallax distance={30} className="sticky top-28">
            <div className="shot relative aspect-[4/5] bg-[var(--bg-deep)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                  exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <motion.img
                    src={current.image}
                    alt={current.imageAlt}
                    className="h-full w-full object-cover"
                    initial={reduceMotion ? false : { scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: EASE }}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pt-24" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${current.id}-info`}
                  className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 text-white"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                >
                  <Pieces items={current.pieces} className="max-w-[26rem] text-sm text-white/85" />
                  <a
                    href={waUrl(current.quote)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 border-b border-white/40 pb-0.5 font-medium transition-colors hover:border-[var(--laser)] hover:text-[var(--laser)]"
                  >
                    {current.cta}
                    <ArrowUpRight size={16} weight="bold" />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
