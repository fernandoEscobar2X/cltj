import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import Reveal from "../../components/shared/Reveal";
import { findDesign, formatMXN, papelColors, papelSizes, papelSvg } from "../../data/papelPicado";
import { studioUrl } from "../../components/papel/studioState";
import useMediaQuery from "../../hooks/useMediaQuery";

const PapelScene = lazy(() => import("../../components/papel/engine/PapelScene"));

const DESIGNS = ["charro", "corazones", "boda-nombres", "marco"];
const COLORS = ["rosa", "naranja", "amarillo", "verde", "cielo", "morado"];
const fromPrice = Math.min(...papelSizes.map((s) => s.prices[25]));

// Gancho del home: escribes un nombre y lo ves cortado en papel picado al
// instante. El motor se descarga cuando la sección se acerca a la pantalla.
export default function PapelHookSection() {
  const ref = useRef(null);
  const sceneRef = useRef(null);
  const [near, setNear] = useState(false);
  const [designId, setDesignId] = useState("charro");
  const [colorId, setColorId] = useState("rosa");
  const [name, setName] = useState("");
  const design = findDesign(designId);
  const wide = useMediaQuery("(min-width: 768px)", true);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "600px 0px" });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const pick = (fn) => (value) => {
    fn(value);
    sceneRef.current?.nudge(0.8);
  };

  const max = design.text?.max ?? 14;

  return (
    <section ref={ref} id="papel-picado" className="defer-render wall-day relative overflow-hidden" aria-labelledby="papel-titulo">
      <div className="shell relative z-10 pt-24 md:pt-32">
        <Reveal>
          <h2 id="papel-titulo" className="t-display text-[var(--ink)]">
            Papel picado
          </h2>
          <p className="t-script -mt-[0.05em] ml-[0.2em] rotate-[-4deg] text-[clamp(2.8rem,6vw,5.6rem)]">con tu nombre</p>
        </Reveal>
      </div>

      <div className="relative -mt-6 h-[52svh] min-h-[20rem] md:-mt-24 md:h-[78svh] md:min-h-[32rem]">
        {near ? (
          <Suspense fallback={null}>
            <PapelScene
              ref={sceneRef}
              designId={designId}
              colorId={colorId}
              text={name}
              panels={wide ? 5 : 3}
              zoom={wide ? 1.28 : 1.42}
              top={wide ? 0.2 : 0.16}
              sag={0.1}
              className="absolute inset-0"
            />
          </Suspense>
        ) : null}
      </div>

      <div className="shell relative z-10 pb-20 md:pb-28">
        <div className="grid gap-6 rounded-[var(--radius-l)] bg-[var(--card)]/85 p-5 shadow-[0_30px_80px_-40px_rgba(40,20,10,0.5)] backdrop-blur-xl md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-end md:gap-8 md:p-7">
          <label className="grid gap-2">
            <span className="t-label text-[var(--ink-2)]">Escribe un nombre</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, max))}
              placeholder={design.text?.default ?? "Tu nombre"}
              maxLength={max}
              className="h-16 w-full rounded-[var(--radius-m)] border border-[var(--line-2)] bg-[var(--paper)] px-5 font-display text-[1.9rem] font-bold uppercase tracking-wide outline-none placeholder:text-[var(--ink-3)]/60 focus:border-[var(--ink)]"
              aria-describedby="papel-hint"
            />
            <span id="papel-hint" className="text-[0.95rem] text-[var(--ink-3)]">
              Se corta con letra stencil para que no se caiga ningún centro.
            </span>
          </label>

          <div className="grid gap-4">
            <div role="radiogroup" aria-label="Diseño" className="flex flex-wrap gap-2">
              {DESIGNS.map((id) => {
                const d = findDesign(id);
                const on = id === designId;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => pick(setDesignId)(id)}
                    className={`inline-flex h-11 items-center gap-2 rounded-full border px-3 pr-4 text-[0.98rem] font-medium transition-colors ${
                      on ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line-2)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <span
                      className="papel-swatch h-5 w-7"
                      style={{ "--mask": `url(${papelSvg(id)})`, "--swatch": on ? "var(--paper)" : "var(--ink)" }}
                      aria-hidden="true"
                    />
                    {d.name}
                  </button>
                );
              })}
            </div>
            <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-2.5">
              {COLORS.map((id) => {
                const c = papelColors.find((x) => x.id === id);
                const on = id === colorId;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={c.label}
                    title={c.label}
                    onClick={() => pick(setColorId)(id)}
                    className={`h-10 w-10 rounded-full transition-transform ${on ? "scale-110 ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--card)]" : "hover:scale-105"}`}
                    style={{ background: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid gap-2 md:justify-items-end">
            <p className="text-[1rem] text-[var(--ink-2)]">
              Desde <strong className="font-semibold text-[var(--ink)]">{formatMXN(fromPrice)}</strong> el paquete de 25
            </p>
            <Link
              to={studioUrl({ designId, colorId, text: name })}
              className="btn btn--ink btn--lg w-full md:w-auto"
            >
              Seguir en el estudio
              <ArrowUpRight size={18} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
