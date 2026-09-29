import Reveal from "../../components/shared/Reveal";
import { process } from "../../data/siteContent";

export default function ProcessSection() {
  return (
    <section id="proceso" className="border-t border-[var(--line)] bg-[var(--bg-raised)] py-20 md:py-28">
      <div className="layout-shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <h2 className="m-0 text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1] tracking-tight">{process.title}</h2>
        </Reveal>

        <div className="lg:col-span-8">
          <ol className="m-0 grid gap-8 p-0 md:grid-cols-3">
            {process.steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <li className="list-none border-t border-[var(--ink)] pt-4">
                  <span className="text-sm tabular-nums text-[var(--laser-ink)]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-semibold leading-tight tracking-tight">{step.title}</h3>
                  <p className="mt-2 max-w-[26ch] text-[var(--ink-soft)]">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <dl className="mt-14 grid gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-3">
            {process.facts.map((fact, index) => (
              <Reveal key={fact.label} delay={0.2 + index * 0.06}>
                <dt className="text-sm text-[var(--ink-mute)]">{fact.label}</dt>
                <dd className="m-0 mt-1 font-medium">{fact.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
