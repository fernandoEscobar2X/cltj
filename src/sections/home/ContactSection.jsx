import { InstagramLogo } from "@phosphor-icons/react";
import Reveal from "../../components/shared/Reveal";
import { ctaFinal } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";

// Cierre. Titular grande, una nota de qué pasa al escribir, y una sola acción.
// Con foto (ctaFinal.image) el bloque se vuelve fotográfico con el texto
// encima; sin foto, es tipográfico sobre blanco.
export default function ContactSection() {
  const photo = ctaFinal.image;
  const handle = siteConfig.social.instagram.replace(/\/$/, "").split("/").pop();
  const tone = photo ? "text-white" : "text-[var(--ink)]";
  const soft = photo ? "text-white/75" : "text-[var(--ink-soft)]";

  return (
    <section
      id="contacto"
      className={`relative overflow-hidden border-t border-[var(--line)] py-24 md:py-36 ${photo ? "bg-[#111113]" : "bg-[var(--bg)]"} ${tone}`}
    >
      {photo ? (
        <>
          <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />
        </>
      ) : null}

      <div className="layout-shell relative grid gap-12 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <h2 className="m-0 text-[clamp(3rem,10vw,8.5rem)] font-semibold leading-[0.9] tracking-tight">{ctaFinal.title}</h2>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-5">
          <p className={`m-0 max-w-[30ch] text-lg leading-snug ${soft}`}>{ctaFinal.note}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="cut-btn cut-btn--accent cut-btn--lg">
              Cotizar por WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phoneIntl.replace(/\s/g, "")}`}
              className="text-lg font-medium tabular-nums transition-colors hover:text-[var(--laser-ink)]"
            >
              {siteConfig.phoneDisplay}
            </a>
          </div>

          <div className={`mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-6 text-sm ${photo ? "border-white/20" : "border-[var(--line)]"} ${soft}`}>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 transition-colors ${photo ? "hover:text-white" : "hover:text-[var(--ink)]"}`}
            >
              <InstagramLogo size={18} />@{handle}
            </a>
            <span>{siteConfig.location}</span>
            <span>Envíos a todo México</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
