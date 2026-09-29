import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, DownloadSimple, LinkSimple, Moon, Sun, WhatsappLogo } from "@phosphor-icons/react";
import PapelScene from "./engine/PapelScene";
import { loadFont, logoSilhouette } from "./engine/compose";
import { ColorPanel, DesignPicker, OrderPanel, PersonalizePanel, Pills } from "./StudioControls";
import { quoteSummary, readStudioState, studioSearch } from "./studioState";
import { findColor, findDesign, findSize, formatMXN, papelKinds, papelLimits, papelPrice } from "../../data/papelPicado";
import { waUrl } from "../../lib/whatsappQuote";
import useMediaQuery from "../../hooks/useMediaQuery";

const TABS = [
  { id: "diseno", label: "Diseño" },
  { id: "personaliza", label: "Personaliza" },
  { id: "color", label: "Color" },
  { id: "pedido", label: "Pedido" },
];

const WALLS = {
  day: [
    [0, "#efe8dc"],
    [1, "#ddd2c1"],
  ],
  night: [
    [0, "#1d1622"],
    [1, "#0f0c13"],
  ],
};

function PriceLine({ state, className = "", dark = false }) {
  const price = papelPrice(state.sizeId, state.pack);
  const size = findSize(state.sizeId);
  return (
    <div className={className}>
      <p className={`text-[0.98rem] ${dark ? "text-[var(--on-night-2)]" : "text-[var(--ink-2)]"}`}>
        {state.pack === "mayoreo" ? "Mayoreo" : `${state.pack} piezas`} · {size.label} {size.dims}
      </p>
      <p className="font-display text-[2.4rem] font-extrabold leading-none">{price ? formatMXN(price) : "Por cotizar"}</p>
    </div>
  );
}

export default function PapelStudio() {
  const desktop = useMediaQuery("(min-width: 1024px)", true);
  const [state, setState] = useState(readStudioState);
  const [tab, setTab] = useState(() => (findDesign(readStudioState().designId).kind === "listo" ? "diseno" : "personaliza"));
  const [night, setNight] = useState(false);
  const [logo, setLogo] = useState(null); // { canvas, name, file }
  const [invert, setInvert] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const sceneRef = useRef(null);

  const design = findDesign(state.designId);
  const color = findColor(state.colorId);
  const set = (patch) => {
    setState((prev) => ({ ...prev, ...patch }));
    if (patch.designId || patch.colorId) sceneRef.current?.nudge(0.9);
  };

  // Estado → URL (compartible) sin llenar el historial.
  useEffect(() => {
    const t = window.setTimeout(() => {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${studioSearch(state)}`);
    }, 250);
    return () => window.clearTimeout(t);
  }, [state]);

  // El header cambia de tono con la escena (día claro, noche oscura).
  useEffect(() => {
    window.dispatchEvent(new Event("tj:header-sync"));
  }, [night]);

  // Las tres stencil, para que las muestras "Aa" se vean con su letra.
  useEffect(() => {
    ["saira", "rotulo", "stardos"].forEach(loadFont);
  }, []);

  // Silueta del logo (se recalcula al invertir).
  useEffect(() => {
    if (!logo?.file) return undefined;
    let alive = true;
    logoSilhouette(logo.file, invert).then((canvas) => {
      if (!alive) return;
      if (!canvas) setLogoError("No encontramos un logo en esa imagen. Prueba con fondo liso o PNG transparente.");
      else setLogo((prev) => (prev ? { ...prev, canvas } : prev));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo?.file, invert]);

  const acceptLogo = (file) => {
    if (!file) return;
    if (!papelLimits.logoTypes.includes(file.type)) {
      setLogoError("Usa PNG, JPG, WebP o SVG.");
      return;
    }
    if (file.size > papelLimits.logoMaxBytes) {
      setLogoError("El archivo pasa de 6 MB.");
      return;
    }
    setLogoError("");
    setLogo({ file, name: file.name, canvas: null });
  };

  const shareLink = () => `${window.location.origin}${window.location.pathname}?${studioSearch(state)}`;

  const exportFile = async () => {
    const blob = await sceneRef.current?.toBlob(night ? WALLS.night : WALLS.day);
    return blob ? new File([blob], `papel-picado-${design.id}-${color.id}.png`, { type: "image/png" }) : null;
  };

  const download = async () => {
    setBusy(true);
    try {
      const file = await exportFile();
      if (!file) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sin portapapeles: el enlace ya está en la barra */
    }
  };

  const message = useMemo(() => quoteSummary(state, { hasLogo: Boolean(logo) }), [state, logo]);

  // En el teléfono se intenta compartir la imagen junto con el mensaje; si no
  // se puede, se abre WhatsApp con el resumen y el enlace al diseño.
  const order = async () => {
    const text = quoteSummary(state, { hasLogo: Boolean(logo), link: shareLink() });
    setBusy(true);
    try {
      const file = await exportFile();
      if (file && !desktop && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "Mi papel picado TJ Láser" });
        return;
      }
    } catch {
      /* compartir cancelado: seguimos con WhatsApp */
    } finally {
      setBusy(false);
    }
    window.open(waUrl(text), "_blank", "noopener,noreferrer");
  };

  const scene = (
    <PapelScene
      ref={sceneRef}
      designId={state.designId}
      colorId={state.colorId}
      text={state.text}
      font={state.font}
      logo={design.kind === "libre" && state.mode === "logo" ? logo?.canvas ?? null : null}
      logoScale={state.logoScale}
      mode={state.mode}
      night={night}
      panels={desktop ? 5 : 3}
      zoom={desktop ? 2.05 : 1.32}
      top={desktop ? 0.24 : 0.3}
      sag={desktop ? 0.12 : 0.1}
      className="absolute inset-0"
    />
  );

  const panel = (variant) => (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {tab === "diseno" ? <DesignPicker state={state} set={set} variant={variant} /> : null}
        {tab === "personaliza" ? (
          <PersonalizePanel
            state={state}
            set={set}
            logo={logo}
            onLogo={acceptLogo}
            logoError={logoError}
            onClearLogo={() => setLogo(null)}
            invert={invert}
            setInvert={setInvert}
          />
        ) : null}
        {tab === "color" ? <ColorPanel state={state} set={set} /> : null}
        {tab === "pedido" ? <OrderPanel state={state} set={set} /> : null}
      </m.div>
    </AnimatePresence>
  );

  const lightToggle = (
    <button
      type="button"
      onClick={() => setNight((v) => !v)}
      className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[0.98rem] font-semibold backdrop-blur-md transition-colors ${
        night ? "bg-white/12 text-[var(--on-night)]" : "bg-white/60 text-[var(--ink)]"
      }`}
      aria-pressed={night}
    >
      {night ? <Sun size={18} /> : <Moon size={18} />}
      {night ? "Ver de día" : "Ver de noche"}
    </button>
  );

  const title = (
    <div>
      <p className={`t-label ${night ? "text-[var(--on-night-2)]" : "text-[var(--ink-2)]"}`}>
        {papelKinds[design.kind].label} · {design.occasion}
      </p>
      <h2 className={`mt-1 font-display text-[clamp(2.8rem,5.4vw,5.6rem)] font-extrabold uppercase leading-[0.86] ${night ? "text-[var(--on-night)]" : "text-[var(--ink)]"}`}>
        {design.name}
      </h2>
    </div>
  );

  if (desktop) {
    return (
      <div className="grid h-[100svh] min-h-[44rem] grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_29rem]">
        <div className={`relative overflow-hidden transition-colors duration-700 ${night ? "wall-night" : "wall-day"}`} data-header={night ? "dark" : undefined}>
          {scene}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 xl:p-10">
            <div className="pointer-events-auto">{title}</div>
            <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
              {lightToggle}
              <button
                type="button"
                onClick={download}
                disabled={busy}
                className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[0.98rem] font-semibold backdrop-blur-md ${night ? "bg-white/12 text-[var(--on-night)]" : "bg-white/60"}`}
              >
                <DownloadSimple size={18} />
                Descargar
              </button>
              <button
                type="button"
                onClick={copyLink}
                className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[0.98rem] font-semibold backdrop-blur-md ${night ? "bg-white/12 text-[var(--on-night)]" : "bg-white/60"}`}
              >
                <LinkSimple size={18} />
                {copied ? "Copiado" : "Copiar enlace"}
              </button>
            </div>
          </div>
          <p className={`pointer-events-none absolute left-8 top-[calc(var(--header-h)+1.5rem)] text-[1rem] xl:left-10 ${night ? "text-[var(--on-night-3)]" : "text-[var(--ink-3)]"}`}>
            Pasa el cursor o agarra un banderín
          </p>
        </div>

        <aside className="flex min-h-0 flex-col border-l border-[var(--line)] bg-[var(--paper)] pt-[var(--header-h)]" aria-label="Opciones del papel picado">
          <div className="px-6 pb-4 pt-4">
            <Pills id="tabs" items={TABS} value={tab} onChange={setTab} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6" data-lenis-prevent>
            {panel("desktop")}
          </div>
          <div className="border-t border-[var(--line)] bg-[var(--card)] px-6 py-5">
            <PriceLine state={state} />
            <button type="button" onClick={order} disabled={busy} className="btn btn--laser btn--lg mt-4 w-full disabled:opacity-60">
              <WhatsappLogo size={20} weight="fill" />
              {state.pack === "mayoreo" ? "Cotizar mayoreo" : "Pedir por WhatsApp"}
            </button>
            <p className="sr-only" aria-live="polite">
              {message}
            </p>
          </div>
        </aside>
      </div>
    );
  }

  // Móvil: escena fija arriba, pestañas debajo y barra de pedido abajo.
  return (
    <div className="pb-28">
      <div className={`sticky top-0 z-20 h-[48svh] min-h-[19rem] overflow-hidden transition-colors duration-700 ${night ? "wall-night" : "wall-day"}`}>
        {scene}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="pointer-events-auto min-w-0">
            <p className={`t-label truncate ${night ? "text-[var(--on-night-2)]" : "text-[var(--ink-2)]"}`}>{papelKinds[design.kind].short}</p>
            <h2 className={`font-display text-[2.6rem] font-extrabold uppercase leading-[0.86] ${night ? "text-[var(--on-night)]" : ""}`}>{design.name}</h2>
          </div>
          <div className="pointer-events-auto flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setNight((v) => !v)}
              aria-pressed={night}
              aria-label={night ? "Ver de día" : "Ver de noche"}
              className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur-md ${night ? "bg-white/12 text-[var(--on-night)]" : "bg-white/60"}`}
            >
              {night ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={download}
              aria-label="Descargar imagen"
              className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur-md ${night ? "bg-white/12 text-[var(--on-night)]" : "bg-white/60"}`}
            >
              <DownloadSimple size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="sticky top-[48svh] z-10 border-b border-[var(--line)] bg-[var(--paper)]/95 py-3 backdrop-blur-md">
        <div className="px-[clamp(0.75rem,3vw,3.5rem)]">
          <Pills id="tabs-m" items={TABS} value={tab} onChange={setTab} compact className="w-full" />
        </div>
      </div>

      <div className="shell pt-6">{panel("mobile")}</div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--card)]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <PriceLine state={state} className="min-w-0" />
          <button type="button" onClick={order} disabled={busy} className="btn btn--laser shrink-0 disabled:opacity-60">
            {state.pack === "mayoreo" ? "Cotizar" : "Pedir"}
            <ArrowUpRight size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
