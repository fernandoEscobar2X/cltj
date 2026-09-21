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
        {eyebrow ? <p className="text-sm font-medium text-[var(--ink-mute)]">{eyebrow}</p> : null}
        <h2 className="m-0 max-w-[14ch] text-[clamp(2.1rem,5vw,3.8rem)] font-semibold leading-[1.02] tracking-tight">
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
