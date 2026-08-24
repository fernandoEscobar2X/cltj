import { ArrowUpRight, Clock3, MapPin, MessageSquareText } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export default function ContactSection() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-[#0b0a09] py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute -bottom-44 -right-28 h-[32rem] w-[32rem] rounded-full bg-[var(--laser)]/18 blur-[90px]" />
      <div className="layout-shell relative z-10 grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-bright)]">Tu idea puede empezar aquí</p>
          <h2 className="max-w-[9ch] font-['Saira_Condensed'] text-[clamp(4.4rem,8vw,8.5rem)] font-black leading-[0.78] tracking-[-0.04em]">
            Cuéntanos qué quieres hacer.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/68">
            Mándanos una foto, tu logo o incluso una explicación rápida. Te
            ayudamos a aterrizar material, tamaño y acabado antes de fabricar.
          </p>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex min-h-16 items-center gap-4 rounded-[0.7rem] bg-[var(--laser)] px-7 text-base font-bold text-black transition-transform hover:-translate-y-1"
          >
            Cotizar por WhatsApp <ArrowUpRight size={22} />
          </a>
        </div>

        <div className="grid gap-0 border-y border-white/12">
          {[
            { icon: MessageSquareText, title: "Cotización sin compromiso", text: "Dinos qué necesitas y para cuándo." },
            { icon: Clock3, title: "Respuesta rápida", text: "Recibe orientación y muestra digital." },
            { icon: MapPin, title: "Hecho en Tijuana", text: "Entrega local y envíos a toda la república." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-5 border-b border-white/12 py-6 last:border-b-0">
              <Icon size={24} strokeWidth={1.6} className="mt-1 shrink-0 text-[var(--hazard)]" />
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/55">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
