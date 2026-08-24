import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export default function ContactSection() {
  return (
    <section id="contacto" className="bg-[var(--laser)] py-16 text-[var(--ink)] sm:py-20 lg:py-28">
      <div className="layout-shell">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">Tijuana · Pedidos por WhatsApp</p>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end lg:gap-16">
          <div>
            <h2 className="max-w-[10ch] text-[clamp(3.3rem,10vw,8rem)] font-bold leading-[0.84] tracking-[-0.065em]">
              ¿Qué quieres hacer realidad?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-black/72 sm:text-xl sm:leading-8">
              Mándanos tu logo, una referencia o una nota de voz. Te orientamos
              con tamaño, material y acabado antes de fabricar.
            </p>
          </div>

          <div className="lg:pb-2">
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-16 w-full items-center justify-between gap-5 bg-[var(--ink)] px-6 text-base font-bold !text-white transition-transform hover:-translate-y-1 sm:min-h-20 sm:px-8 sm:text-lg"
            >
              Cuéntanos tu idea <ArrowUpRight size={24} />
            </a>
            <p className="mt-4 text-sm font-semibold leading-6 text-black/68">
              Cotización sin compromiso · Hecho en Tijuana · Envíos nacionales
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
