import ActionLink from "../../components/shared/ActionLink";
import Reveal from "../../components/shared/Reveal";
import { ctaFinal } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";

export default function ContactSection() {
  return (
    <section id="contacto" className="py-18 lg:py-24">
      <div className="layout-shell">
        <Reveal>
          <div className="editorial-card glass-panel relative overflow-hidden px-6 py-10 text-center sm:px-8 lg:px-10 lg:py-14">
            <div className="absolute inset-x-[15%] top-10 hidden h-3 rounded-full bg-[linear-gradient(90deg,transparent,rgba(198,91,255,0.9),rgba(233,199,255,0.95),rgba(198,91,255,0.9),transparent)] opacity-80 lg:block" />
            <div className="mx-auto grid max-w-3xl gap-6">
              <h2 className="font-['Saira_Condensed'] text-[clamp(2.8rem,6vw,5.2rem)] font-extrabold leading-[0.88] tracking-[-0.03em] text-[var(--paper)]">
                {ctaFinal.title}
              </h2>
              <p className="text-base leading-8 text-[var(--paper-soft)]">
                {ctaFinal.subtitle}
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ActionLink href={siteConfig.whatsappUrl} size="lg" variant="dark">
                  Cotizar ahora
                </ActionLink>
                <ActionLink to="/galeria" size="lg" variant="soft">
                  Ver galería
                </ActionLink>
              </div>
              <p className="text-sm leading-7 text-[var(--paper-soft)]">
                WhatsApp: {siteConfig.phoneDisplay}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
