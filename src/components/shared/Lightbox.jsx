import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import Img from "../media/Img";
import { setOverlayOpen } from "../../lib/overlay";
import { waUrl } from "../../lib/whatsappQuote";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function LightboxDialog({ item, index, total, onClose, onPrev, onNext }) {
  const dialogRef = useRef(null);

  // Detiene el scroll suave mientras la imagen está abierta.
  useEffect(() => {
    setOverlayOpen(true);
    return () => setOverlayOpen(false);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const getFocusable = () => Array.from(dialog.querySelectorAll(FOCUSABLE));

    getFocusable()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusable();

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", onKeyDown);

    return () => {
      dialog.removeEventListener("keydown", onKeyDown);

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  const quoteHref = waUrl(
    `Hola, vi ${item.title} en la galería y quiero cotizar una pieza similar.`,
  );

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-start overflow-y-auto lg:place-items-center lg:overflow-hidden"
      onClick={onClose}
      role="presentation"
    >
      <div className="pointer-events-none fixed inset-0 bg-[var(--night)]/97 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
        className="relative flex min-h-svh w-full flex-col text-white lg:flex-row"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 lg:absolute lg:right-8 lg:top-8"
          aria-label="Cerrar imagen"
        >
          <X size={22} />
        </button>

        <div className="relative flex h-[55svh] w-full items-center justify-center p-4 md:p-8 lg:h-screen lg:w-[68vw] lg:p-16">
          <Img
            id={item.media}
            alt={item.alt}
            fit="contain"
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="h-full w-full !bg-transparent ![background-image:none]"
          />
        </div>

        <div className="flex min-h-[45svh] w-full flex-col justify-center border-white/10 p-6 md:p-12 lg:h-[100dvh] lg:w-[32vw] lg:border-l lg:pr-16">
          <p className="text-[1rem] tabular-nums text-white/60">
            {index + 1} de {total}
          </p>
          <h2
            id="lightbox-title"
            className="mt-3 font-display text-[clamp(2.6rem,5vw,4.2rem)] font-extrabold uppercase leading-[0.9]"
          >
            {item.title}
          </h2>
          <p className="mt-3 text-[1.05rem] text-white/70">
            {item.categoryLabel}
            {item.material ? ` · ${item.material}` : ""}
          </p>
          {item.description ? <p className="mt-4 max-w-[34ch] text-[1.08rem] leading-relaxed text-white/80">{item.description}</p> : null}

          <a
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--laser btn--lg mt-8 w-fit"
          >
            Quiero algo así
          </a>

          <div className="mt-8 flex gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={total < 2}
              className="flex h-11 flex-1 items-center justify-center gap-1 rounded-full border border-white/25 text-[0.98rem] disabled:opacity-30"
            >
              <CaretLeft size={16} />
              Anterior
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={total < 2}
              className="flex h-11 flex-1 items-center justify-center gap-1 rounded-full border border-white/25 text-[0.98rem] disabled:opacity-30"
            >
              Siguiente
              <CaretRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lightbox({ item, ...props }) {
  if (!item) {
    return null;
  }

  return <LightboxDialog item={item} {...props} />;
}
