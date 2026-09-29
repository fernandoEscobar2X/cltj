import { useReducedMotion } from "framer-motion";
import { clients } from "../../data/siteContent";

// Banda de clientes: nombres reales cuyo trabajo aparece en el sitio. Sigue la
// noche del hero, así que se lee como su continuación.
export default function ClientsBand() {
  const reduceMotion = useReducedMotion();
  const row = [...clients, ...clients];

  return (
    <section className="overflow-hidden border-y border-[var(--line-night)] bg-[var(--night)] py-6 text-[var(--on-night)] md:py-8" data-header="dark" aria-label="Clientes">
      <h2 className="sr-only">Negocios que confían en TJ Láser</h2>
      <div className="marquee" style={{ "--marquee-speed": "52s", animationPlayState: reduceMotion ? "paused" : "running" }}>
        {row.map((name, i) => (
          <span key={`${name}-${i}`} className="flex shrink-0 items-center" aria-hidden={i >= clients.length}>
            <span className="font-statement text-[clamp(1.5rem,2.6vw,2.4rem)] font-bold [font-stretch:80%] text-[var(--on-night-2)]">
              {name}
            </span>
            <span className="mx-7 h-2 w-2 rotate-45 bg-[var(--laser)] md:mx-10" />
          </span>
        ))}
      </div>
    </section>
  );
}
