import { m, useReducedMotion } from "framer-motion";
import { Phone, WhatsappLogo } from "@phosphor-icons/react";
import { ctaFinal } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";

// Cierre: una sola acción, gigante. El haz del láser "corta" el titular al
// entrar en pantalla.
export default function ContactSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="contacto" className="defer-render relative overflow-hidden bg-[var(--night)] pb-24 pt-28 text-[var(--on-night)] md:pb-32 md:pt-40" data-header="dark" aria-labelledby="contacto-titulo">
      <div className="shell relative">
        <div className="relative w-fit">
          <m.h2
            id="contacto-titulo"
            className="t-mega relative"
            initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          >
            {ctaFinal.title}
          </m.h2>
          {!reduceMotion ? (
            <m.span
              aria-hidden="true"
              className="absolute bottom-0 top-0 w-[2px] bg-[var(--laser)] shadow-[0_0_24px_6px_var(--laser-glow)]"
              initial={{ left: "0%", opacity: 0 }}
              whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
            />
          ) : null}
        </div>
        <p className="t-script t-script--light -mt-[0.1em] ml-[0.1em] rotate-[-4deg] text-[clamp(2.8rem,6vw,6rem)]">{ctaFinal.script}</p>

        <div className="mt-14 grid gap-8 border-t border-[var(--line-night)] pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="t-lead max-w-[34ch] text-[var(--on-night-2)]">{ctaFinal.note}</p>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--laser btn--lg">
              <WhatsappLogo size={20} weight="fill" />
              {siteConfig.ctaLabel}
            </a>
            <a href={`tel:${siteConfig.phoneIntl.replace(/\s/g, "")}`} className="btn btn--ghost-light btn--lg tabular-nums">
              <Phone size={18} />
              {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
