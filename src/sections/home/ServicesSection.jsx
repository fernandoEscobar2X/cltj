import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

const routes = [
  {
    number: "01",
    title: "Que mi negocio se vea",
    description: "Letreros, logotipos, señalética y vinil para fachada, recepción o interior.",
    detail: "ACRÍLICO · MDF · VINIL · ESPEJO",
    image: "/img-featured/letrero-agara.webp",
    alt: "Letrero comercial Agara en acrílico espejo",
    position: "object-center",
  },
  {
    number: "02",
    title: "Que mi mostrador comunique",
    description: "Displays, menús QR, porta-precios y piezas NFC diseñadas para tu marca.",
    detail: "DISPLAY · QR · NFC · MENÚ",
    image: "/img-featured/display-santiago.webp",
    alt: "Display de mostrador para Santiago Reyes Studio",
    position: "object-[center_62%]",
  },
  {
    number: "03",
    title: "Que algo sea solo mío",
    description: "Tags, llaveros, toppers, recuerdos y detalles hechos con nombre, color o mensaje.",
    detail: "TAGS · LLAVEROS · EVENTOS · REGALOS",
    image: "/img-featured/tags-mochila.webp",
    alt: "Tags personalizados de acrílico con nombres",
    position: "object-center",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="bg-[var(--bg)] py-16 text-[var(--ink)] sm:py-20 lg:py-28">
      <div className="layout-shell">
        <header className="mb-9 max-w-3xl sm:mb-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-deep)]">
            Empieza por lo que necesitas
          </p>
          <h2 className="text-[clamp(2.7rem,8vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.055em]">
            No tienes que saber de materiales. Solo cuéntanos la idea.
          </h2>
        </header>

        <div className="space-y-3 sm:space-y-4">
          {routes.map((route) => (
            <a
              key={route.number}
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block min-h-[27rem] overflow-hidden bg-[var(--ink)] text-white sm:min-h-[30rem] lg:min-h-[35rem]"
            >
              <img
                src={route.image}
                alt={route.alt}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover ${route.position} transition-transform duration-700 group-hover:scale-[1.025]`}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,10,0.08)_10%,rgba(8,7,10,0.88)_100%)] sm:bg-[linear-gradient(90deg,rgba(8,7,10,0.92)_0%,rgba(8,7,10,0.58)_48%,rgba(8,7,10,0.08)_100%)]" />

              <div className="relative flex min-h-[27rem] flex-col justify-between p-5 sm:min-h-[30rem] sm:p-8 lg:min-h-[35rem] lg:max-w-[62%] lg:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.18em] text-[var(--laser-bright)]">{route.number}</span>
                  <span className="text-right text-[0.62rem] font-bold tracking-[0.14em] text-white/62 sm:text-xs">{route.detail}</span>
                </div>

                <div>
                  <h3 className="max-w-[11ch] text-[clamp(2.8rem,8vw,6rem)] font-bold leading-[0.88] tracking-[-0.055em]">
                    {route.title}
                  </h3>
                  <div className="mt-5 flex items-end justify-between gap-5 border-t border-white/32 pt-5">
                    <p className="max-w-xl text-sm leading-6 text-white/78 sm:text-lg sm:leading-7">{route.description}</p>
                    <ArrowUpRight className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={24} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
