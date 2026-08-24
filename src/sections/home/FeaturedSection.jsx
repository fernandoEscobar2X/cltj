import { ArrowUpRight, Expand } from "lucide-react";
import Lightbox from "../../components/shared/Lightbox";
import Button from "../../components/ui/Button";
import { portfolioItems } from "../../data/portfolio";
import useLightbox from "../../hooks/useLightbox";

const selectedIds = [
  "letrero-wafflix",
  "tags-mochila",
  "display-shulas",
  "llavero-roberto",
  "topper-feliz-cumple",
  "papel-picado-personalizado",
];

const showcase = selectedIds.map((id) => portfolioItems.find((item) => item.id === id)).filter(Boolean);

const frames = [
  "col-span-2 sm:col-span-4 sm:row-span-2",
  "sm:col-span-2 sm:row-span-1",
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-2 sm:row-span-1",
  "sm:col-span-2 sm:row-span-2",
  "col-span-2 sm:col-span-4 sm:row-span-1",
];

export default function FeaturedSection() {
  const lightbox = useLightbox(showcase);

  return (
    <section id="trabajos" className="bg-white py-16 text-[var(--ink)] sm:py-20 lg:py-28">
      <div className="layout-shell">
        <header className="mb-9 flex flex-col gap-5 border-b-2 border-[var(--ink)] pb-7 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-deep)]">Así se ve lo que hacemos</p>
            <h2 className="text-[clamp(3rem,8vw,6.2rem)] font-bold leading-[0.88] tracking-[-0.06em]">
              Hecho aquí.<br />Fotografiado aquí.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
            No usamos imágenes de catálogo. Son trabajos reales para negocios,
            regalos y eventos de nuestros clientes.
          </p>
        </header>

        <div className="grid auto-rows-[13rem] grid-cols-2 gap-x-2 gap-y-7 sm:auto-rows-[18rem] sm:grid-cols-6 sm:gap-x-4 sm:gap-y-9 lg:auto-rows-[21rem]">
          {showcase.map((item, index) => (
            <article key={item.id} className={`group min-w-0 ${frames[index]}`}>
              <button
                type="button"
                onClick={() => lightbox.open(item.id)}
                className="relative block h-[calc(100%_-_3.5rem)] min-h-[9rem] w-full overflow-hidden bg-[#ece9ef] text-left"
                aria-label={`Abrir ${item.title}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
                <span className="absolute right-2 top-2 grid h-9 w-9 place-items-center bg-white text-black opacity-90 sm:right-3 sm:top-3">
                  <Expand size={16} strokeWidth={1.8} />
                </span>
              </button>
              <div className="flex items-start justify-between gap-2 pt-2.5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold sm:text-base">{item.title}</h3>
                  <p className="mt-0.5 truncate text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--ink-mute)] sm:text-xs">
                    {item.categoryLabel}
                  </p>
                </div>
                <span className="text-[0.62rem] font-bold text-[var(--laser-deep)] sm:text-xs">0{index + 1}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-14">
          <Button to="/galeria" variant="ghost" size="lg">
            Ver todos los trabajos <ArrowUpRight size={18} />
          </Button>
        </div>
      </div>

      <Lightbox
        item={lightbox.activeItem}
        index={lightbox.activeIndex}
        total={showcase.length}
        onClose={lightbox.close}
        onPrev={lightbox.goPrev}
        onNext={lightbox.goNext}
      />
    </section>
  );
}
