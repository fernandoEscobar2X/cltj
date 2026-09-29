import { useEffect, useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { ArrowUpRight, Check, DownloadSimple, LinkSimple, Minus, Plus, UploadSimple, X } from "@phosphor-icons/react";
import PapelPreview from "./PapelPreview";
import PapelTira from "./PapelTira";
import {
  papelColors,
  papelDefaults,
  papelLimits,
  papelMaterials,
  papelSizes,
  papelTemplates,
} from "../../data/papelPicado";
import { papelQuoteMessage, waUrl } from "../../lib/whatsappQuote";
import { siteConfig } from "../../data/siteConfig";

const STORAGE_KEY = "tj-papel-v1";

// Estado compartible: vive en la URL (para mandar el diseño) y en localStorage
// (para no perderlo al volver). El logo no viaja: es un archivo local.
const PARAMS = {
  t: "templateId",
  c: "colorId",
  x: "text",
  s: "sizeId",
  m: "materialId",
  q: "quantity",
  mc: "multicolor",
};

function readState() {
  const state = { ...papelDefaults };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") Object.assign(state, saved);
  } catch {
    // localStorage bloqueado o corrupto: seguimos con defaults.
  }
  const search = new URLSearchParams(window.location.search);
  for (const [short, key] of Object.entries(PARAMS)) {
    const raw = search.get(short);
    if (raw === null) continue;
    if (key === "quantity") state.quantity = Number(raw);
    else if (key === "multicolor") state.multicolor = raw !== "0";
    else state[key] = raw;
  }
  // Saneamos contra los catálogos.
  if (!papelTemplates.some((item) => item.id === state.templateId)) state.templateId = papelDefaults.templateId;
  if (!papelColors.some((item) => item.id === state.colorId)) state.colorId = papelDefaults.colorId;
  if (!papelSizes.some((item) => item.id === state.sizeId)) state.sizeId = papelDefaults.sizeId;
  if (!papelMaterials.some((item) => item.id === state.materialId)) state.materialId = papelDefaults.materialId;
  state.text = String(state.text ?? "").slice(0, papelLimits.maxChars);
  state.quantity = Math.min(papelLimits.maxQuantity, Math.max(papelLimits.minQuantity, Math.round(state.quantity) || 1));
  state.logoScale = Math.min(1.4, Math.max(0.6, Number(state.logoScale) || 1));
  return state;
}

function writeState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Sin persistencia: no pasa nada.
  }
  const search = new URLSearchParams();
  search.set("t", state.templateId);
  search.set("c", state.colorId);
  if (state.text) search.set("x", state.text);
  search.set("s", state.sizeId);
  search.set("m", state.materialId);
  search.set("q", String(state.quantity));
  if (!state.multicolor) search.set("mc", "0");
  const url = `${window.location.pathname}?${search.toString()}`;
  window.history.replaceState(null, "", url);
  return `${window.location.origin}${url}`;
}

function Step({ number, title, hint, children }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="flex items-baseline gap-3">
        <span className="text-sm tabular-nums text-[var(--laser-ink)]">{String(number).padStart(2, "0")}</span>
        <span className="text-lg font-medium">{title}</span>
        {hint ? <span className="text-sm text-[var(--ink-mute)]">{hint}</span> : null}
      </legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function Segmented({ options, value, onChange, label, render }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => {
        const checked = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.id)}
            className={`rounded-[var(--radius-field)] border px-3 py-3 text-left transition-colors ${
              checked ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]" : "border-[var(--line-strong)] hover:border-[var(--ink)]"
            }`}
          >
            {render(option, checked)}
          </button>
        );
      })}
    </div>
  );
}

export default function PapelStudio() {
  const [state, setState] = useState(readState);
  const [logo, setLogo] = useState(null); // { url, name }
  const [logoError, setLogoError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const tiraRef = useRef(null);
  const shareUrl = useRef("");

  const set = (patch) => setState((prev) => ({ ...prev, ...patch }));
  const template = papelTemplates.find((item) => item.id === state.templateId) ?? papelTemplates[0];
  const color = papelColors.find((item) => item.id === state.colorId) ?? papelColors[0];
  const size = papelSizes.find((item) => item.id === state.sizeId) ?? papelSizes[0];
  const material = papelMaterials.find((item) => item.id === state.materialId) ?? papelMaterials[0];

  useEffect(() => {
    shareUrl.current = writeState(state);
  }, [state]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => () => logo?.url && URL.revokeObjectURL(logo.url), [logo]);

  const acceptLogo = (file) => {
    if (!file) return;
    if (!papelLimits.logoTypes.includes(file.type)) {
      setLogoError("Usa PNG, JPG, WebP o SVG.");
      return;
    }
    if (file.size > papelLimits.logoMaxBytes) {
      setLogoError("El archivo pasa de 4 MB.");
      return;
    }
    setLogoError("");
    setLogo({ url: URL.createObjectURL(file), name: file.name });
  };

  const exportPng = async () => {
    if (!tiraRef.current) return null;
    const blob = await toBlob(tiraRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#111113" });
    return blob
      ? new File([blob], `papel-picado-${state.templateId}-${state.colorId}.png`, { type: "image/png" })
      : null;
  };

  const download = async () => {
    setBusy(true);
    try {
      const file = await exportPng();
      if (file) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl.current);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin clipboard: la URL ya está en la barra del navegador.
    }
  };

  const message = useMemo(
    () =>
      papelQuoteMessage({
        template: template.name,
        text: state.text,
        color: color.label,
        multicolor: state.multicolor,
        size: `${size.label} (${size.dims})`,
        material: material.label,
        quantity: state.quantity,
        hasLogo: Boolean(logo),
        link: shareUrl.current,
      }),
    [template, state, color, size, material, logo],
  );

  const sendQuote = async () => {
    setBusy(true);
    try {
      const file = await exportPng();
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: message, title: "Papel picado TJ Láser" });
        return;
      }
    } catch {
      // Compartir cancelado o no disponible: seguimos con el mensaje.
    } finally {
      setBusy(false);
    }
    window.open(waUrl(message), "_blank", "noopener,noreferrer");
  };

  const step = (delta) =>
    set({ quantity: Math.min(papelLimits.maxQuantity, Math.max(papelLimits.minQuantity, state.quantity + delta)) });

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      {/* Vista: sticky en ambos dispositivos; en móvil es la cabecera de la página. */}
      <div className="lg:col-span-7">
        <div className="sticky top-[68px] z-10 -mx-4 flex flex-col justify-center bg-[var(--bg-ink)] px-4 pb-5 pt-2 text-white/70 md:mx-0 md:rounded-[var(--radius-media)] md:px-6 lg:top-28 lg:min-h-[calc(100dvh-9rem)] lg:pb-8">
          <PapelTira
            ref={tiraRef}
            panels={desktop ? 5 : 3}
            zoom={desktop ? 1.35 : 1.35}
            templateId={state.templateId}
            colorId={state.colorId}
            text={state.text}
            logoUrl={logo?.url}
            logoScale={state.logoScale}
            multicolor={state.multicolor}
            showGuides
          />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/55">
            <span>{template.name}</span>
            <span aria-hidden="true">·</span>
            <span>{color.label}{state.multicolor ? " + colores" : ""}</span>
            <span aria-hidden="true">·</span>
            <span>{size.dims}</span>
            <span aria-hidden="true">·</span>
            <span>{material.label}</span>
            <span aria-hidden="true">·</span>
            <span>{state.quantity} {state.quantity === 1 ? "tira" : "tiras"}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-10 lg:col-span-5 lg:mt-0">
        <Step number={1} title="Plantilla">
          <div role="radiogroup" aria-label="Plantilla" className="grid grid-cols-2 gap-3">
            {papelTemplates.map((item) => {
              const checked = item.id === state.templateId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => set({ templateId: item.id })}
                  className={`rounded-[var(--radius-media)] border p-2 text-left transition-colors ${
                    checked ? "border-[var(--ink)]" : "border-[var(--line)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  <div className="shot bg-[var(--bg-ink)] p-3">
                    <PapelPreview templateId={item.id} colorId={state.colorId} className="block w-full" />
                  </div>
                  <span className="mt-2 flex items-center justify-between px-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    {checked ? <Check size={14} weight="bold" /> : null}
                  </span>
                  <span className="block px-1 text-xs text-[var(--ink-mute)]">{item.use}</span>
                </button>
              );
            })}
          </div>
        </Step>

        <Step number={2} title="Color" hint={color.label}>
          <div role="radiogroup" aria-label="Color del papel" className="flex flex-wrap gap-2.5">
            {papelColors.map((item) => {
              const checked = item.id === state.colorId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => set({ colorId: item.id })}
                  className={`h-10 w-10 rounded-full border transition-transform ${
                    checked
                      ? "scale-110 border-[var(--ink)] ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--bg)]"
                      : "border-[var(--line)]"
                  }`}
                  style={{ background: item.hex }}
                />
              );
            })}
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={state.multicolor}
              onChange={(event) => set({ multicolor: event.target.checked })}
              className="h-4 w-4 accent-[var(--ink)]"
            />
            Tira multicolor: el resto de banderines alterna colores
          </label>
        </Step>

        <Step number={3} title="Texto" hint={`${state.text.length}/${papelLimits.maxChars}`}>
          <div className="relative">
            <input
              value={state.text}
              maxLength={papelLimits.maxChars}
              onChange={(event) => set({ text: event.target.value })}
              placeholder="Nombre, marca o fecha"
              aria-label="Texto del papel picado"
              className="min-h-14 w-full rounded-[var(--radius-field)] border border-[var(--line-strong)] bg-[var(--bg-raised)] px-4 pr-12 text-lg uppercase tracking-wide outline-none focus:border-[var(--ink)]"
            />
            {state.text ? (
              <button
                type="button"
                onClick={() => set({ text: "" })}
                aria-label="Borrar texto"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--ink-mute)] hover:bg-[var(--bg-deep)]"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </Step>

        <Step number={4} title="Logo" hint="opcional">
          {logo ? (
            <div className="grid gap-4">
              <div className="flex items-center gap-4 rounded-[var(--radius-field)] border border-[var(--line)] p-3">
                <img src={logo.url} alt="" className="h-12 w-12 rounded-md bg-[var(--bg-deep)] object-contain p-1" />
                <span className="min-w-0 flex-1 truncate text-sm">{logo.name}</span>
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="text-sm text-[var(--ink-mute)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                >
                  Quitar
                </button>
              </div>
              <label className="grid gap-2 text-sm">
                <span className="flex justify-between text-[var(--ink-mute)]">
                  <span>Tamaño del logo</span>
                  <span className="tabular-nums">{Math.round(state.logoScale * 100)}%</span>
                </span>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.05"
                  value={state.logoScale}
                  onChange={(event) => set({ logoScale: Number(event.target.value) })}
                  className="w-full accent-[var(--ink)]"
                />
              </label>
            </div>
          ) : (
            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                acceptLogo(event.dataTransfer.files?.[0]);
              }}
              className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-field)] border border-dashed p-4 text-sm transition-colors ${
                dragging ? "border-[var(--ink)] bg-[var(--bg-deep)]" : "border-[var(--line-strong)] hover:border-[var(--ink)]"
              }`}
            >
              <UploadSimple size={20} />
              <span>
                Sube tu logo
                <span className="block text-xs text-[var(--ink-mute)]">PNG, SVG o JPG. Se recorta en silueta.</span>
              </span>
              <input
                type="file"
                accept={papelLimits.logoTypes.join(",")}
                className="sr-only"
                onChange={(event) => acceptLogo(event.target.files?.[0])}
              />
            </label>
          )}
          {logoError ? <p className="mt-2 text-sm text-[var(--laser-ink)]">{logoError}</p> : null}
        </Step>

        <Step number={5} title="Tamaño">
          <Segmented
            label="Tamaño del banderín"
            options={papelSizes}
            value={state.sizeId}
            onChange={(id) => set({ sizeId: id })}
            render={(option, checked) => (
              <>
                <span className="block text-sm font-medium">{option.label}</span>
                <span className={`block text-xs ${checked ? "text-[var(--bg)]/70" : "text-[var(--ink-mute)]"}`}>{option.dims}</span>
              </>
            )}
          />
        </Step>

        <Step number={6} title="Material">
          <Segmented
            label="Material"
            options={papelMaterials}
            value={state.materialId}
            onChange={(id) => set({ materialId: id })}
            render={(option, checked) => (
              <>
                <span className="block text-sm font-medium">{option.label}</span>
                <span className={`block text-xs ${checked ? "text-[var(--bg)]/70" : "text-[var(--ink-mute)]"}`}>{option.note}</span>
              </>
            )}
          />
        </Step>

        <Step number={7} title="Cantidad" hint="tiras de 5 m aprox.">
          <div className="inline-flex items-center rounded-[var(--radius-field)] border border-[var(--line-strong)]">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={state.quantity <= papelLimits.minQuantity}
              aria-label="Menos tiras"
              className="flex h-12 w-12 items-center justify-center disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={papelLimits.minQuantity}
              max={papelLimits.maxQuantity}
              value={state.quantity}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isFinite(next)) {
                  set({ quantity: Math.min(papelLimits.maxQuantity, Math.max(papelLimits.minQuantity, Math.round(next))) });
                }
              }}
              aria-label="Número de tiras"
              className="h-12 w-16 border-x border-[var(--line-strong)] bg-transparent text-center text-lg tabular-nums outline-none"
            />
            <button
              type="button"
              onClick={() => step(1)}
              disabled={state.quantity >= papelLimits.maxQuantity}
              aria-label="Más tiras"
              className="flex h-12 w-12 items-center justify-center disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
        </Step>

        <div className="border-t border-[var(--line)] pt-8">
          <button
            type="button"
            onClick={sendQuote}
            disabled={busy}
            className="cut-btn cut-btn--accent cut-btn--lg w-full disabled:opacity-60"
          >
            {busy ? "Preparando…" : siteConfig.ctaLabel}
            <ArrowUpRight size={18} weight="bold" />
          </button>
          <p className="mt-3 text-sm text-[var(--ink-mute)]">
            Se abre WhatsApp con tu diseño y los datos. Te regresamos precio y muestra en 24 h.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="inline-flex items-center gap-2 text-[var(--ink-soft)] underline-offset-4 hover:text-[var(--ink)] hover:underline disabled:opacity-60"
            >
              <DownloadSimple size={16} />
              Descargar vista
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 text-[var(--ink-soft)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
            >
              <LinkSimple size={16} />
              {copied ? "Enlace copiado" : "Copiar enlace del diseño"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
