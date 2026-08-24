import { ArrowUpRight, Expand } from "lucide-react";
import Lightbox from "../../components/shared/Lightbox";
import Button from "../../components/ui/Button";
import { featuredPortfolio } from "../../data/portfolio";
import useLightbox from "../../hooks/useLightbox";

const showcase = featuredPortfolio.slice(0, 4);

export default function FeaturedSection() {
  const lightbox = useLightbox(showcase);

  return (
    <section id="trabajos" className="bg-[#f8f3e8] py-20 lg:py-28">
      <div className="layout-shell">
        <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-deep)]">Hecho por TJ Láser</p>
            <h2 className="max-w-[10ch] font-['Saira_Condensed'] text-[clamp(4rem,7vw,7rem)] font-black leading-[0.8] tracking-[-0.04em]">
              Mira cómo se ve una idea terminada.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="mb-6 text-lg leading-8 text-[var(--ink-soft)]">
              Piezas reales para negocios y personas en Tijuana. Cada trabajo se
              adapta al espacio, la marca y el uso que tendrá.
            </p>
            <Button to="/galeria" variant="ghost">
              Explorar la galería <ArrowUpRight size={18} />
            </Button>
          </div>
        </div>

        <div className="grid auto-rows-[16rem] gap-5 md:grid-cols-12 md:auto-rows-[18rem]">
          {showcase.map((item, index) => {
            const positions = [
              "md:col-span-7 md:row-span-2",
              "md:col-span-5 md:row-span-1",
              "md:col-span-5 md:row-span-2",
              "md:col-span-7 md:row-span-1",
            ];
            return (
              <article key={item.id} className={`group relative overflow-hidden rounded-[1rem] bg-[var(--ink)] ${positions[index]}`}>
                <button
                  type="button"
                  onClick={() => lightbox.open(item.id)}
                  className="absolute inset-0 w-full text-left"
                  aria-label={`Abrir ${item.title}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-white md:p-7">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/62">{item.categoryLabel} · {item.material}</p>
                      <h3 className="mt-2 font-['Saira_Condensed'] text-3xl font-black leading-none md:text-4xl">{item.title}</h3>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/45 bg-black/25 backdrop-blur">
                      <Expand size={17} strokeWidth={1.8} />
                    </span>
                  </div>
                </button>
              </article>
            );
          })}
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
