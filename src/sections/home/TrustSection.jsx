import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
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
  return (
    <section id="confianza" className="relative overflow-hidden bg-[var(--bg)] py-10 lg:py-14">
      <div className="bleed-shell grid gap-0 border-y-2 border-[var(--ink)] md:grid-cols-3">
        {trustFacts.map((fact, index) => {
          const parsed = parseNumeric(fact.value);
          return (
            <article
              key={fact.label}
              className={`relative grid gap-3 py-8 md:py-10 ${
                index !== 0 ? "md:border-l-2 md:border-[var(--ink)]" : ""
              } ${index !== trustFacts.length - 1 ? "border-b-2 border-[var(--ink)] md:border-b-0" : ""} ${
                index % 2 === 1 ? "md:pl-8" : "md:pl-6"
              } pr-6 pl-6`}
            >
              <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[var(--ink-mute)]">
                {String(index + 1).padStart(2, "0")} · {fact.label}
              </p>
              <strong className="text-display-xl text-[var(--ink)]">
                {parsed ? (
                  <>
                    <CountUp target={parsed.value} suffix={parsed.suffix} />
                    {fact.value.includes("+") && !parsed.suffix.includes("+") ? "+" : ""}
                  </>
                ) : (
                  fact.value
                )}
              </strong>
              <p className="max-w-xs text-sm leading-7 text-[var(--ink-soft)]">
                {fact.description}
              </p>
              {index === 1 ? (
                <Sparkles
                  size={18}
                  strokeWidth={2}
                  className="absolute right-5 top-5 text-[var(--laser)]"
                />
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
