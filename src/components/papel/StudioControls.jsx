import { useState } from "react";
import { m } from "framer-motion";
import { Check, Image as ImageIcon, TextT, Trash, UploadSimple } from "@phosphor-icons/react";
import {
  findColor,
  findDesign,
  findSize,
  formatMXN,
  papelColors,
  papelDesigns,
  papelFonts,
  papelKinds,
  papelLimits,
  papelPackages,
  papelSizes,
  papelSvg,
  papelWholesaleFrom,
} from "../../data/papelPicado";

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "nombre", label: "Con nombre" },
  { id: "libre", label: "Nombre o logo" },
  { id: "listo", label: "Listos" },
];

/** Píldoras con indicador que se desliza (layoutId). */
export function Pills({ items, value, onChange, id, className = "", dark = false, compact = false }) {
  return (
    <div role="tablist" className={`flex gap-1 rounded-full p-1 ${dark ? "bg-white/10" : "bg-[var(--paper-2)]"} ${className}`}>
      {items.map((item) => {
        const on = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(item.id)}
            className={`relative isolate flex-1 whitespace-nowrap rounded-full ${compact ? "px-2 py-2.5 text-[0.95rem]" : "px-4 py-2.5 text-[0.98rem]"} font-semibold transition-colors ${
              on ? (dark ? "text-[var(--ink)]" : "text-[var(--paper)]") : dark ? "text-[var(--on-night-2)]" : "text-[var(--ink-2)]"
            }`}
          >
            {on ? (
              <m.span
                layoutId={`pill-${id}`}
                className={`absolute inset-0 -z-10 rounded-full ${dark ? "bg-[var(--paper)]" : "bg-[var(--ink)]"}`}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            ) : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function Swatch({ designId, color, className = "" }) {
  return (
    <span
      className={`papel-swatch block ${className}`}
      style={{ "--mask": `url(${papelSvg(designId)})`, "--swatch": color }}
      aria-hidden="true"
    />
  );
}

export function DesignPicker({ state, set, variant = "desktop" }) {
  const [filter, setFilter] = useState("all");
  const color = findColor(state.colorId);
  const list = papelDesigns.filter((d) => filter === "all" || d.kind === filter);

  const choose = (d) =>
    set({
      designId: d.id,
      // Al cambiar de diseño, el texto vuelve a su valor (cada diseño tiene su largo).
      text: "",
      mode: d.kind === "libre" ? state.mode : "text",
    });

  return (
    <div className="grid gap-5">
      <div className="hide-scrollbar -mx-1 overflow-x-auto px-1">
        <Pills id={`filter-${variant}`} items={FILTERS} value={filter} onChange={setFilter} className="w-max min-w-full" />
      </div>
      <div
        role="radiogroup"
        aria-label="Diseño"
        className={
          variant === "mobile"
            ? "snap-x-mandatory hide-scrollbar -mx-[clamp(1.1rem,4vw,3.5rem)] flex gap-3 overflow-x-auto px-[clamp(1.1rem,4vw,3.5rem)] pb-2"
            : "grid grid-cols-2 gap-3 xl:grid-cols-3"
        }
      >
        {list.map((d) => {
          const on = d.id === state.designId;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => choose(d)}
              className={`group relative rounded-[var(--radius-m)] border p-3 text-left transition-[border-color,transform] duration-300 ${
                variant === "mobile" ? "w-[44vw] max-w-[12rem] shrink-0 snap-start" : ""
              } ${on ? "border-[var(--ink)] bg-[var(--card)]" : "border-[var(--line)] bg-[var(--card)]/60 hover:-translate-y-0.5 hover:border-[var(--line-2)]"}`}
            >
              <div className="wall-day grid aspect-[5/4] place-items-center rounded-[calc(var(--radius-m)-4px)] p-2.5">
                <Swatch designId={d.id} color={color.hex} className="h-full w-full transition-transform duration-500 group-hover:rotate-[-2deg]" />
              </div>
              <span className="mt-2.5 block font-statement text-[1.15rem] font-bold leading-tight [font-stretch:85%]">{d.name}</span>
              <span className="block text-[0.95rem] text-[var(--ink-3)]">{papelKinds[d.kind].short}</span>
              {on ? (
                <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
                  <Check size={14} weight="bold" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="rounded-[var(--radius-m)] bg-[var(--paper-2)] px-4 py-3 text-[0.98rem] leading-snug text-[var(--ink-2)]">
        Un diseño por pedido: toda la tira lleva el mismo corte.
      </p>
    </div>
  );
}

export function PersonalizePanel({ state, set, logo, onLogo, logoError, onClearLogo, invert, setInvert }) {
  const design = findDesign(state.designId);
  const [dragging, setDragging] = useState(false);

  if (design.kind === "listo") {
    return (
      <div className="grid gap-4">
        <p className="font-statement text-[1.5rem] font-bold leading-tight [font-stretch:85%]">{design.name} se pide tal cual.</p>
        <p className="text-[1.02rem] leading-relaxed text-[var(--ink-2)]">
          Es un diseño listo del taller. Si quieres tu nombre o tu logo, elige uno marcado como “Con nombre” o “Nombre o logo”.
        </p>
      </div>
    );
  }

  const layout = design.text;
  const useLogo = design.kind === "libre" && state.mode === "logo";

  return (
    <div className="grid gap-6">
      {design.kind === "libre" ? (
        <Pills
          id="mode"
          items={[
            { id: "text", label: "Nombre" },
            { id: "logo", label: "Logo" },
          ]}
          value={state.mode}
          onChange={(mode) => set({ mode })}
        />
      ) : null}

      {!useLogo ? (
        <>
          <label className="grid gap-2">
            <span className="t-label flex items-center justify-between text-[var(--ink-2)]">
              <span className="inline-flex items-center gap-2">
                <TextT size={18} />
                {design.id.startsWith("boda-iniciales") ? "Iniciales" : "Nombre o texto"}
              </span>
              <span className="tabular-nums text-[var(--ink-3)]">
                {state.text.length}/{layout.max}
              </span>
            </span>
            <input
              value={state.text}
              onChange={(e) => set({ text: e.target.value.slice(0, layout.max) })}
              placeholder={layout.default}
              maxLength={layout.max}
              className="h-16 w-full rounded-[var(--radius-m)] border border-[var(--line-2)] bg-[var(--card)] px-5 font-display text-[1.8rem] font-bold uppercase tracking-wide outline-none placeholder:text-[var(--ink-3)]/55 focus:border-[var(--ink)]"
            />
          </label>
          <div className="grid gap-2">
            <span className="t-label text-[var(--ink-2)]">Letra de corte</span>
            <div role="radiogroup" aria-label="Letra de corte" className="grid grid-cols-3 gap-2">
              {Object.entries(papelFonts).map(([key, f]) => {
                const on = (state.font || layout.font) === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set({ font: key })}
                    className={`rounded-[var(--radius-m)] border px-3 py-3 text-center transition-colors ${
                      on ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line-2)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <span className="block text-[1.5rem] leading-none" style={{ fontFamily: `"${f.family}"`, fontWeight: f.weight }}>
                      Aa
                    </span>
                    <span className="mt-1 block text-[0.95rem]">{f.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[0.95rem] leading-snug text-[var(--ink-3)]">
              Letras stencil: llevan puentes para que los centros de la O, la A o la B no se caigan del papel.
            </p>
          </div>
        </>
      ) : (
        <div className="grid gap-4">
          {logo ? (
            <>
              <div className="flex items-center gap-4 rounded-[var(--radius-m)] border border-[var(--line-2)] bg-[var(--card)] p-3">
                <span className="grid h-14 w-14 place-items-center rounded-[var(--radius-s)] bg-[var(--paper-2)]">
                  <ImageIcon size={22} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[1rem]">{logo.name}</span>
                <button type="button" onClick={onClearLogo} className="grid h-11 w-11 place-items-center rounded-full hover:bg-[var(--paper-2)]" aria-label="Quitar logo">
                  <Trash size={18} />
                </button>
              </div>
              <label className="grid gap-2">
                <span className="t-label flex justify-between text-[var(--ink-2)]">
                  <span>Tamaño del logo</span>
                  <span className="tabular-nums text-[var(--ink-3)]">{Math.round(state.logoScale * 100)}%</span>
                </span>
                <input
                  type="range"
                  min="0.6"
                  max="1.2"
                  step="0.02"
                  value={state.logoScale}
                  onChange={(e) => set({ logoScale: Number(e.target.value) })}
                  className="w-full accent-[var(--ink)]"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-[1rem]">
                <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} className="h-5 w-5 accent-[var(--ink)]" />
                Invertir: cortar el fondo en vez del logo
              </label>
            </>
          ) : (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                onLogo(e.dataTransfer.files?.[0]);
              }}
              className={`grid cursor-pointer place-items-center gap-3 rounded-[var(--radius-l)] border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragging ? "border-[var(--laser)] bg-[var(--laser)]/10" : "border-[var(--line-2)] hover:border-[var(--ink)]"
              }`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
                <UploadSimple size={24} />
              </span>
              <span className="font-statement text-[1.35rem] font-bold [font-stretch:85%]">Sube tu logo</span>
              <span className="text-[0.98rem] text-[var(--ink-3)]">PNG, JPG, WebP o SVG. Lo recortamos en silueta.</span>
              <input
                type="file"
                accept={papelLimits.logoTypes.join(",")}
                className="sr-only"
                onChange={(e) => onLogo(e.target.files?.[0])}
              />
            </label>
          )}
          {logoError ? <p className="text-[1rem] text-[#b3261e]">{logoError}</p> : null}
          <p className="text-[0.95rem] leading-snug text-[var(--ink-3)]">
            Antes de cortar, el taller ajusta tu logo con puentes para que ninguna parte se caiga. Te lo mostramos en la muestra.
          </p>
        </div>
      )}
    </div>
  );
}

export function ColorPanel({ state, set }) {
  const color = findColor(state.colorId);
  return (
    <div className="grid gap-5">
      <p className="font-statement text-[1.5rem] font-bold leading-none [font-stretch:85%]">
        {color.label}
        <span className="ml-2 text-[1rem] font-normal text-[var(--ink-3)] [font-stretch:100%]">papel de china</span>
      </p>
      <div role="radiogroup" aria-label="Color del papel" className="grid grid-cols-6 gap-3">
        {papelColors.map((c) => {
          const on = c.id === state.colorId;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={c.label}
              title={c.label}
              onClick={() => set({ colorId: c.id })}
              className={`aspect-square rounded-full border border-black/10 transition-transform duration-300 ${
                on ? "scale-110 ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--paper)]" : "hover:scale-105"
              }`}
              style={{ background: c.hex }}
            />
          );
        })}
      </div>
      <p className="rounded-[var(--radius-m)] bg-[var(--paper-2)] px-4 py-3 text-[0.98rem] leading-snug text-[var(--ink-2)]">
        Un color por pedido. ¿Quieres otro tono? Pídelo en la cotización.
      </p>
    </div>
  );
}

export function OrderPanel({ state, set }) {
  const size = findSize(state.sizeId);
  return (
    <div className="grid gap-7">
      <div className="grid gap-3">
        <span className="t-label text-[var(--ink-2)]">Medida del banderín</span>
        <div role="radiogroup" aria-label="Medida" className="grid grid-cols-2 gap-3">
          {papelSizes.map((s) => {
            const on = s.id === state.sizeId;
            const k = s.id === "grande" ? 1 : 0.7;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set({ sizeId: s.id })}
                className={`grid gap-3 rounded-[var(--radius-m)] border p-4 text-left transition-colors ${
                  on ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line-2)] hover:border-[var(--ink)]"
                }`}
              >
                <span className="flex h-14 items-end">
                  <span
                    className={`block rounded-[3px] border-2 ${on ? "border-[var(--laser)]" : "border-current"}`}
                    style={{ width: `${3.4 * k}rem`, height: `${2.4 * k}rem` }}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-display text-[2rem] font-extrabold uppercase leading-none">{s.label}</span>
                <span className={`text-[0.98rem] ${on ? "text-[var(--paper)]/75" : "text-[var(--ink-3)]"}`}>{s.dims}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3">
        <span className="t-label text-[var(--ink-2)]">Paquete</span>
        <div role="radiogroup" aria-label="Paquete" className="grid gap-2">
          {papelPackages.map((pack) => {
            const on = state.pack === pack;
            const price = size.prices[pack];
            return (
              <button
                key={pack}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set({ pack })}
                className={`flex items-center justify-between gap-4 rounded-[var(--radius-m)] border px-4 py-3.5 text-left transition-colors ${
                  on ? "border-[var(--ink)] bg-[var(--card)]" : "border-[var(--line-2)] hover:border-[var(--ink)]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${on ? "border-[var(--ink)]" : "border-[var(--line-2)]"}`}>
                    {on ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink)]" /> : null}
                  </span>
                  <span className="font-statement text-[1.3rem] font-bold [font-stretch:85%]">{pack} piezas</span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-[1.7rem] font-extrabold leading-none">{formatMXN(price)}</span>
                  <span className="block text-[0.95rem] text-[var(--ink-3)]">${(price / pack).toFixed(2).replace(/\.00$/, "")} c/u</span>
                </span>
              </button>
            );
          })}
          <button
            type="button"
            role="radio"
            aria-checked={state.pack === "mayoreo"}
            onClick={() => set({ pack: "mayoreo" })}
            className={`flex items-center justify-between gap-4 rounded-[var(--radius-m)] border border-dashed px-4 py-3.5 text-left transition-colors ${
              state.pack === "mayoreo" ? "border-[var(--ink)] bg-[var(--card)]" : "border-[var(--line-2)] hover:border-[var(--ink)]"
            }`}
          >
            <span className="font-statement text-[1.3rem] font-bold [font-stretch:85%]">Mayoreo</span>
            <span className="text-[1rem] text-[var(--ink-2)]">desde {papelWholesaleFrom} piezas · se cotiza</span>
          </button>
        </div>
      </div>
    </div>
  );
}
