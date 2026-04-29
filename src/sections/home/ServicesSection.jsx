import { ArrowUpRight, KeyRound, Nfc, Signpost, Stamp } from "lucide-react";
import Button from "../../components/ui/Button";
import Sticker from "../../components/ui/Sticker";
import { services } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";

const iconMap = {
  Signpost,
  KeyRound,
  Stamp,
  Nfc,
};

/**
 * Bento layout:
 *  ┌──────────────────────┬────────────────┐
 *  │ NFC (destacado)      │ Displays       │
 *  │ 2 filas / 7 cols     │ 1 fila / 5 cols│
 *  │                      ├────────────────┤
 *  │                      │ Llaveros       │
 *  │                      │ 1 fila / 5 cols│
 *  └──────────────────────┴────────────────┘
 *  ┌──────────────────────────────────────┐
 *  │ Grabado (banda ancha 12 cols)        │
 *  └──────────────────────────────────────┘
 */

const tiles = [
  { key: "Nfc",      cls: "md:col-span-7 md:row-span-2 bg-[var(--bg-ink)] text-[var(--bg)]" },
  { key: "Signpost", cls: "md:col-span-5 bg-[var(--bg-raised)]" },
  { key: "KeyRound", cls: "md:col-span-5 bg-[var(--hazard)]" },
  { key: "Stamp",    cls: "md:col-span-12 bg-[var(--bg-raised)]" },
];

function ServiceTile({ service, style }) {
  const Icon = iconMap[service.icon];
  const isDark = style.cls.includes("bg-[var(--bg-ink)]");
  const textMute = isDark ? "text-[var(--paper-mute)]" : "text-[var(--ink-mute)]";
  const textSoft = isDark ? "text-[var(--bg-deep)]" : "text-[var(--ink-soft)]";
  const textHead = isDark ? "text-[var(--bg)]" : "text-[var(--ink)]";
  const iconColor = service.highlight
    ? "text-[var(--laser)]"
    : isDark
    ? "text-[var(--bg)]"
    : "text-[var(--ink)]";

  return (
    <article
      className={`relative flex flex-col justify-between gap-8 border border-[var(--ink)] p-7 transition hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(20,16,13,0.18)] md:p-9 ${style.cls}`}
    >
      {service.highlight ? (
        <div className="absolute right-5 top-5">
          <Sticker variant="laser">Nuevo · TJ</Sticker>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        {Icon ? <Icon size={44} strokeWidth={1.5} className={iconColor} /> : null}
        <span className={`font-mono text-[0.7rem] uppercase tracking-[0.24em] ${textMute}`}>
          {String(tiles.indexOf(style) + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="grid gap-3">
        <h3 className={`text-display-xl ${textHead}`}>{service.title}</h3>
        <p className={`max-w-md text-sm leading-7 ${textSoft}`}>{service.description}</p>
      </div>
    </article>
  );
}

export default function ServicesSection() {
  const tileMap = Object.fromEntries(
    services.map((service) => [service.icon, service]),
  );

  return (
    <section id="servicios" className="relative overflow-hidden bg-[var(--bg)] py-20 lg:py-28">
      <div className="bleed-shell grid gap-10">
        {/* Intro asimétrica */}
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className="grid gap-4">
            <p className="font-mono text-[0.78rem] uppercase tracking-[0.26em] text-[var(--ink-mute)]">
              01 · Lo que hacemos
            </p>
            <h2 className="m-0 text-display-xl text-[var(--ink)]">
              Servicios que venden,
              <span className="block laser-text">señalizan y recuerdan.</span>
            </h2>
          </div>
          <div className="grid gap-4 lg:justify-items-end">
            <p className="max-w-sm text-sm leading-7 text-[var(--ink-soft)]">
              Cortamos y grabamos con precisión láser. Cada pieza es única y
              hecha a medida para tu negocio o proyecto.
            </p>
            <Button href={siteConfig.whatsappUrl} variant="ghost" size="md">
              Pedir cotización
              <ArrowUpRight size={16} strokeWidth={2.25} />
            </Button>
          </div>
        </div>

        {/* Bento */}
        <div className="grid gap-0 md:grid-cols-12 md:[&>article]:-ml-px md:[&>article]:-mt-px">
          {tiles.map((style) => {
            const service = tileMap[style.key];
            if (!service) return null;
            return <ServiceTile key={style.key} service={service} style={style} />;
          })}
        </div>
      </div>
    </section>
  );
}
