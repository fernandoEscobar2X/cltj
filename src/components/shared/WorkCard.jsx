export default function WorkCard({ item, onOpen, featured = false }) {
  return (
    <article className={featured ? "xl:col-span-2" : ""}>
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="work-card__button group block w-full text-left"
        // aria-labelledby y no aria-label: con un label inventado, el nombre
        // accesible no coincidia con el texto visible y el control por voz
        // ("abrir Shulas Boutique") no encontraba el boton.
        aria-labelledby={`work-card-title-${item.id}`}
      >
        <div className="work-card__frame editorial-card glass-panel overflow-hidden transition duration-300">
          <div
            className={`relative overflow-hidden ${
              featured ? "aspect-[16/10]" : item.orientation === "wide" ? "aspect-[16/11]" : "aspect-[4/5]"
            }`}
          >
            <img
              className="work-card__image h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={item.src}
              srcSet={`${item.src.replace(/\.webp$/, "-small.webp")} ${Math.round(item.width / 2)}w, ${item.src} ${item.width}w`}
              sizes={
                featured
                  ? "(min-width: 1280px) 66vw, 100vw"
                  : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              }
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
            />
            {/* Absolute Contrast Gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 grid gap-2 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/18 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] backdrop-blur">
                  {item.categoryLabel}
                </span>
                <span className="rounded-full bg-black/24 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] backdrop-blur">
                  {item.material}
                </span>
              </div>
              <div>
                <h3
                  id={`work-card-title-${item.id}`}
                  className="font-['Saira_Condensed'] text-[1.8rem] leading-[0.95] tracking-[-0.02em]"
                >
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/78">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}
