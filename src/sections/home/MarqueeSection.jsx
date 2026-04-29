import { marqueeText } from "../../data/siteContent";

const items = Array.from({ length: 10 }, () => marqueeText);

export default function MarqueeSection() {
  return (
    <section aria-hidden="true" className="ticker-band">
      <div className="marquee">
        <div className="marquee__track font-display text-[clamp(2.4rem,6vw,4.5rem)] font-black uppercase tracking-[-0.02em]">
          {[...items, ...items].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-12 whitespace-nowrap">
              <span>{item}</span>
              <span className="text-[var(--laser)]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
