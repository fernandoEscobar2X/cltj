import { useEffect, useRef, useState } from "react";
import { trustFacts } from "../../data/siteContent";

function parseNumeric(raw) {
  const match = String(raw).match(/(\d+)(\D*)$/);
  if (!match) return null;
  return { value: Number(match[1]), suffix: match[2] ?? "" };
}

function CountUp({ target, suffix, duration = 1400 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(target * eased));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export default function TrustSection() {
  const [f1, f2, f3] = trustFacts;
  const p1 = parseNumeric(f1.value);
  const p2 = parseNumeric(f2.value);
  const p3 = parseNumeric(f3.value);

  return (
    <section id="confianza" className="bg-[var(--bg)] pt-20 pb-16 lg:pt-32 lg:pb-24 border-b-[3px] border-[var(--ink)]">
      <div className="layout-shell">
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12 items-end">
          
          {/* Columna Principal - Enorme */}
          <article className="lg:col-span-5 lg:border-b-4 border-[var(--ink)] pb-6">
            <h3 className="text-[6rem] lg:text-[9rem] font-black text-[var(--ink)] leading-[0.8] tracking-tighter mb-6">
              {p1 ? <CountUp target={p1.value} suffix={p1.suffix} /> : f1.value}
              <span className="text-[var(--laser)] text-[5rem] lg:text-[7rem] leading-none">+</span>
            </h3>
            <p className="font-mono text-sm uppercase tracking-widest text-[var(--ink-mute)] mb-4">{f1.label}</p>
            <p className="text-xl text-[var(--ink-soft)] max-w-sm leading-relaxed">{f1.description}</p>
          </article>

          {/* Columna Secundaria - Grande */}
          <article className="lg:col-span-4 lg:border-b-4 border-[var(--ink)] pb-6">
            <h3 className="text-[5rem] lg:text-[7rem] font-black text-[var(--ink)] leading-[0.8] tracking-tighter mb-6">
              {p2 ? <CountUp target={p2.value} suffix={p2.suffix} /> : f2.value}
            </h3>
            <p className="font-mono text-sm uppercase tracking-widest text-[var(--ink-mute)] mb-4">{f2.label}</p>
            <p className="text-xl text-[var(--ink-soft)] max-w-sm leading-relaxed">{f2.description}</p>
          </article>

          {/* Columna Terciaria - Mediana */}
          <article className="lg:col-span-3 pb-6">
            <h3 className="text-[4rem] lg:text-[5rem] font-black text-[var(--ink)] leading-[0.8] tracking-tighter mb-6">
              {p3 ? <CountUp target={p3.value} suffix={p3.suffix} /> : f3.value}
            </h3>
            <p className="font-mono text-sm uppercase tracking-widest text-[var(--ink-mute)] mb-4">{f3.label}</p>
            <p className="text-xl text-[var(--ink-soft)] max-w-sm leading-relaxed">{f3.description}</p>
          </article>

        </div>
      </div>
    </section>
  );
}
