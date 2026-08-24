import { trustFacts } from "../../data/siteContent";

export default function TrustSection() {
  return (
    <section id="confianza" className="bg-[var(--hazard)] text-[var(--ink)]">
      <h2 className="sr-only">Por qué confiar en TJ Láser</h2>
      <div className="layout-shell grid divide-y divide-black/15 py-3 md:grid-cols-3 md:divide-x md:divide-y-0">
        {trustFacts.map((fact) => (
          <article key={fact.label} className="flex items-center gap-5 px-2 py-5 md:px-7">
            <p className="shrink-0 font-['Saira_Condensed'] text-5xl font-black leading-none tracking-[-0.04em]">
              {fact.value}
            </p>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.08em]">{fact.label}</h3>
              <p className="mt-1 max-w-xs text-sm leading-5 text-black/70">{fact.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
