export default function SectionIntro({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}) {
  return (
    <div
      className={`grid gap-4 ${
        compact ? "max-w-2xl" : "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
      }`}
    >
      <div className="grid gap-3">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="max-w-[14ch] font-['Saira_Condensed'] text-[clamp(2.35rem,6vw,4.8rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--paper)]">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-7 text-[var(--paper-soft)]">
          {description}
        </p>
      </div>

      {action ? <div className="lg:justify-self-end">{action}</div> : null}
    </div>
  );
}
