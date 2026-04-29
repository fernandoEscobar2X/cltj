export default function WorkTile({ item, onOpen, aspectClass = "aspect-[4/5]" }) {
  return (
    <article className={`work-tile group relative overflow-hidden border border-[var(--ink)] bg-[var(--bg-ink)] ${aspectClass}`}>
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="absolute inset-0 text-left"
        aria-label={`Abrir ${item.title}`}
      >
        <img
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          loading="lazy"
          decoding="async"
        />

        {/* Default label (visible, no hover) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 grid gap-2 bg-gradient-to-t from-[rgba(20,16,13,0.82)] via-[rgba(20,16,13,0.2)] to-transparent p-5 text-[var(--bg)] transition-opacity duration-300 group-hover:opacity-0">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[var(--bg-deep)]">
            {item.categoryLabel} / {item.material}
          </p>
          <h3 className="font-display text-[1.7rem] font-black leading-[0.95]">
            {item.title}
          </h3>
        </div>

        {/* Blueprint overlay (hover) */}
        <div className="blueprint-overlay">
          <span className="blueprint-corner blueprint-corner--tl" />
          <span className="blueprint-corner blueprint-corner--tr" />
          <span className="blueprint-corner blueprint-corner--bl" />
          <span className="blueprint-corner blueprint-corner--br" />

          <div className="absolute inset-0 flex flex-col justify-between p-6 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--bg)]">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[var(--laser-soft)]">FICHA · {item.id}</span>
              <span>↗</span>
            </div>
            <div className="grid gap-3">
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-black normal-case leading-[0.92] tracking-[-0.02em] text-[var(--bg)]">
                {item.title}
              </h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[0.68rem] tracking-[0.2em]">
                <dt className="text-[var(--laser-soft)]">Categoría</dt>
                <dd>{item.categoryLabel}</dd>
                <dt className="text-[var(--laser-soft)]">Material</dt>
                <dd>{item.material}</dd>
                <dt className="text-[var(--laser-soft)]">Formato</dt>
                <dd>{item.orientation === "wide" ? "Horizontal" : "Vertical"}</dd>
              </dl>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}
