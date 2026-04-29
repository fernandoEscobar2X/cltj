import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Lightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}) {
  if (!item) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(20,16,13,0.86)] p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative grid w-full max-w-6xl gap-4 overflow-hidden border border-[var(--line-strong)] bg-[var(--bg)] p-4 shadow-[0_40px_90px_rgba(0,0,0,0.5)] lg:grid-cols-[minmax(0,1.4fr)_380px]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="cut-btn cut-btn--ghost cut-btn--sm absolute right-4 top-4 z-10 !min-h-10 !w-10 !px-0"
          aria-label="Cerrar imagen"
        >
          <X size={18} strokeWidth={2.25} />
        </button>

        <div className="overflow-hidden border border-[var(--line)] bg-[var(--bg-ink)]">
          <img
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            className="max-h-[72vh] w-full object-contain"
          />
        </div>

        <div className="grid content-start gap-4 p-2 pt-14 lg:pt-2">
          <p className="section-eyebrow">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <h2
            id="lightbox-title"
            className="font-display text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold leading-[0.9] text-[var(--ink)]"
          >
            {item.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="sticker sticker--paper">{item.categoryLabel}</span>
            <span className="sticker">{item.material}</span>
          </div>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            {item.description}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={total < 2}
              className="cut-btn cut-btn--ghost cut-btn--sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={14} strokeWidth={2.25} />
              Anterior
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={total < 2}
              className="cut-btn cut-btn--laser cut-btn--sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
              <ChevronRight size={14} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
