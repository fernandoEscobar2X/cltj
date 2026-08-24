import { ArrowUpRight, Gift, QrCode, Store } from "lucide-react";
import seasonalTags from "../../assets/seasonal-tags.webp";
import Button from "../../components/ui/Button";
import { siteConfig } from "../../data/siteConfig";

const solutions = [
  {
    icon: Store,
    eyebrow: "Para que te encuentren",
    title: "Haz visible tu negocio",
    description:
      "Letreros, logotipos, señalética y vinil diseñados para tu fachada, recepción o espacio de atención.",
    items: "Letreros · Señalética · Vinil · Acrílico espejo",
    image: "/img-featured/letrero-agara.webp",
    alt: "Letrero comercial de Agara en acrílico espejo dorado",
    className: "lg:col-span-7",
  },
  {
    icon: QrCode,
    eyebrow: "Para vender y atender mejor",
    title: "Dale vida a tu mostrador",
    description:
      "Displays, porta-menús, códigos QR y piezas NFC que organizan información sin perder el estilo de tu marca.",
    items: "Displays · Menús QR · NFC · Porta-precios",
    image: "/img-featured/display-santiago.webp",
    alt: "Display de mostrador para Santiago Reyes Studio",
    className: "lg:col-span-5",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="overflow-hidden bg-[var(--bg)] py-20 lg:py-28">
      <div className="layout-shell">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-deep)]">
              Lo que podemos hacer contigo
            </p>
            <h2 className="max-w-[11ch] font-['Saira_Condensed'] text-[clamp(3.8rem,7vw,7rem)] font-black leading-[0.82] tracking-[-0.04em]">
              No vendemos cortes. Creamos presencia.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[var(--ink-soft)] lg:justify-self-end">
            Empezamos por lo que quieres comunicar y dónde se va a usar. Después
            elegimos material, tamaño y acabado para que la pieza funcione de
            verdad en tu negocio, evento o regalo.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <article
                key={solution.title}
                className={`group relative min-h-[34rem] overflow-hidden rounded-[1rem] bg-[var(--ink)] ${solution.className}`}
              >
                <img
                  src={solution.image}
                  alt={solution.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <Icon size={28} strokeWidth={1.6} className="mb-5 text-[var(--laser-bright)]" />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/62">{solution.eyebrow}</p>
                  <h3 className="mt-2 font-['Saira_Condensed'] text-5xl font-black leading-[0.86] tracking-[-0.03em] md:text-6xl">
                    {solution.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-white/76">{solution.description}</p>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--hazard)]">{solution.items}</p>
                </div>
              </article>
            );
          })}

          <article className="relative overflow-hidden rounded-[1rem] bg-[#111] text-white lg:col-span-12 lg:min-h-[30rem]">
            <img
              src={seasonalTags}
              alt="Tags y llaveros personalizados fabricados por TJ Láser"
              width="1280"
              height="960"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-78"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent lg:bg-gradient-to-r lg:from-black/95 lg:via-black/65 lg:to-black/5" />
            <div className="relative flex min-h-[34rem] max-w-2xl flex-col justify-end p-6 md:p-8 lg:min-h-[30rem] lg:justify-center lg:p-12">
              <Gift size={30} strokeWidth={1.6} className="mb-5 text-[var(--hazard)]" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--hazard)]">Para regalar, celebrar o identificar</p>
              <h3 className="mt-3 font-['Saira_Condensed'] text-5xl font-black leading-[0.85] tracking-[-0.03em] md:text-7xl">
                Personaliza lo que importa.
              </h3>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/76">
                Llaveros, tags, toppers, recuerdos y decoración con nombres,
                mensajes o diseños hechos especialmente para cada ocasión.
              </p>
              <div className="mt-7">
                <Button href={siteConfig.whatsappUrl} variant="hazard" size="lg">
                  Quiero personalizar algo <ArrowUpRight size={20} />
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
