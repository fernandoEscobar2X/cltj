import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function LightboxDialog({ item, index, total, onClose, onPrev, onNext }) {
  const dialogRef = useRef(null);

  // Atrapa el foco dentro del modal y lo devuelve al elemento que lo abrio.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const getFocusable = () => Array.from(dialog.querySelectorAll(FOCUSABLE));

    getFocusable()[0]?.focus();

    // Solo Tab: Escape y las flechas ya las escucha useLightbox en document.
    // Manejarlas tambien aqui las duplicaba, porque el evento burbujea desde el
    // dialogo hasta document y cada flecha avanzaba dos piezas.
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
    // Sin dependencias a proposito: onPrev/onNext/onClose son funciones nuevas
    // en cada render, asi que listarlas reejecutaba el efecto continuamente y su
    // limpieza devolvia el foco al disparador varias veces por segundo.
  }, []);

  return (
    <div
      // place-items-center centraba el dialogo dentro del scroll: cuando el
      // contenido superaba la altura del viewport, el sobrante de arriba se
      // recortaba y quedaba fuera de alcance, con el boton de cerrar dentro.
      // Alineado al inicio se comporta igual cuando cabe y scrollea cuando no.
      className="fixed inset-0 z-[100] grid place-items-start overflow-y-auto lg:place-items-center lg:overflow-hidden"
      onClick={onClose}
      role="presentation"
    >
      {/* El fondo y su desenfoque van en su propia capa. Con backdrop-filter
          aplicado al contenedor de scroll, este pasaba a ser el bloque
          contenedor de sus hijos position:fixed, asi que el boton de cerrar
          quedaba anclado al contenido y se iba con el scroll. */}
      <div
        className="pointer-events-none fixed inset-0 bg-[#050505]/95 backdrop-blur-3xl"
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative flex flex-col lg:flex-row w-full min-h-svh text-white"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
      >
        {/* Absolute Close Button */}
        <button
          type="button"
          onClick={onClose}
          // fixed en movil: anclado al dialogo se iba con el scroll y dejaba al
          // usuario sin salida. Misma posicion y mismo estilo, pero siempre a la
          // vista. En escritorio no scrollea, asi que sigue absolute.
          className="fixed right-4 top-4 lg:absolute lg:right-8 lg:top-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-[var(--laser)] hover:text-black hover:scale-110 backdrop-blur-md"
          aria-label="Cerrar imagen"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Massive Image Container */}
        {/* svh y no vh: con vh las dos mitades sumaban 100vh contra un dialogo
            de 100svh, asi que en movil el contenido siempre desbordaba. */}
        <div className="w-full lg:w-[70vw] h-[55svh] lg:h-screen flex items-center justify-center p-4 md:p-8 lg:p-16 relative">
          <img
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Content Container */}
        <div className="w-full lg:w-[30vw] min-h-[45svh] lg:h-screen flex flex-col justify-center p-6 md:p-12 lg:pr-16 bg-[#050505]/50 border-l border-white/10">
          <div className="grid content-start gap-6">
            <p className="font-mono text-sm tracking-[0.3em] text-white/50 uppercase">
              {String(index + 1).padStart(2, "0")} <span className="mx-2">/</span> {String(total).padStart(2, "0")}
            </p>
            
            <h2
              id="lightbox-title"
              className="font-['Saira_Condensed'] text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[0.9] text-white tracking-[-0.02em]"
            >
              {item.title}
            </h2>
            
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] backdrop-blur-md text-white border border-white/20">
                {item.categoryLabel}
              </span>
              <span className="rounded-full bg-[var(--laser)]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] backdrop-blur-md text-[var(--laser)] border border-[var(--laser)]/30">
                {item.material}
              </span>
            </div>
            
            <p className="text-base leading-8 text-white/70 mt-2 font-light">
              {item.description}
            </p>
            
            <div className="flex gap-4 pt-8 mt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onPrev}
                disabled={total < 2}
                className="flex flex-1 h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 text-sm font-bold uppercase tracking-widest transition-all hover:bg-white/20 disabled:opacity-20 disabled:hover:bg-white/5"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
                Anterior
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={total < 2}
                className="flex flex-1 h-14 items-center justify-center gap-2 rounded-full border border-transparent bg-[var(--laser)] text-black text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(198,91,255,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(198,91,255,0.4)] disabled:opacity-20 disabled:hover:scale-100"
              >
                Siguiente
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
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
