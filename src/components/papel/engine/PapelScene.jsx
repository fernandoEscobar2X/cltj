import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { findColor, findDesign } from "../../../data/papelPicado";
import { composePanel, loadDesign, loadFont } from "./compose";

// Escena de papel picado: una tira colgada de un hilo, en un solo <canvas>.
//
// Física por banderín (barata, sin librerías):
// - columpio (theta): péndulo amortiguado alrededor del punto donde cuelga;
// - giro (phi): torsión sobre su eje vertical, con resorte;
// - viento: suma de senos desfasados por banderín, con rachas;
// - mano: al pasar el cursor o el dedo empuja según su velocidad; al agarrar
//   un banderín se puede columpiar y soltar.
//
// Eficiencia: el banderín se compone una vez (engine/compose.js) y cada
// cuadro solo dibuja ese lienzo transformado. El bucle se detiene fuera de
// pantalla o con la pestaña oculta; con movimiento reducido pinta un solo cuadro.

const DPR_CAP = 2;

function wind(t, i, strength) {
  const gust = 0.55 + 0.45 * Math.sin(t * 0.21 + i * 0.4) ** 2;
  return (
    strength *
    gust *
    (Math.sin(t * 0.93 + i * 1.71) * 0.55 + Math.sin(t * 1.67 + i * 0.63) * 0.28 + Math.sin(t * 0.41 + i * 2.93) * 0.4)
  );
}

const PapelScene = forwardRef(function PapelScene(
  {
    designId,
    colorId,
    text = "",
    font = null,
    logo = null,
    logoScale = 1,
    mode = "text",
    night = false,
    panels = 5,
    zoom = 1,
    top = 0.12,
    sag = 0.1,
    windStrength = 1,
    interactive = true,
    className = "",
    label,
    onReady,
  },
  ref,
) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const state = useRef({
    size: { w: 0, h: 0, dpr: 1 },
    art: null,
    layout: null,
    bodies: [],
    pointer: { x: -1e4, y: -1e4, vx: 0, vy: 0, t: 0, inside: false },
    grab: null,
    visible: false,
    raf: 0,
    last: 0,
    time: Math.random() * 100,
    reduce: false,
    night,
    windStrength,
  });
  const [ready, setReady] = useState(false);
  const design = findDesign(designId);
  const color = findColor(colorId);

  state.current.night = night;
  state.current.windStrength = windStrength;

  // Geometría: ancho de banderín, hilo y puntos de cuelgue.
  const layoutFor = (w, h) => {
    const [vw, vh] = design.vb;
    const aspect = vh / vw;
    const gapRatio = 0.07;
    const byWidth = (w * zoom) / (panels + (panels - 1) * gapRatio);
    const topY = h * top;
    const sagY = h * sag;
    const byHeight = (h - topY - sagY) / (aspect * 1.12);
    const pw = Math.min(byWidth, byHeight);
    const ph = pw * aspect;
    const stride = pw * (1 + gapRatio);
    const x0 = w / 2 - (stride * (panels - 1)) / 2;
    const anchors = Array.from({ length: panels }, (_, i) => {
      const x = x0 + i * stride;
      const u = (x / w) * 2 - 1;
      return { x, y: topY + sagY * (1 - u * u) };
    });
    return { pw, ph, anchors, topY, sagY };
  };

  const draw = () => {
    const s = state.current;
    const canvas = canvasRef.current;
    const { art, layout, bodies, size } = s;
    if (!canvas || !art || !layout) return;
    const ctx = canvas.getContext("2d");
    const { dpr, w } = size;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { pw, ph, anchors, topY, sagY } = layout;
    const k = 1 / dpr;
    const isNight = s.night;

    // Hilo (catenaria aproximada con parábola), de borde a borde.
    const drawString = (alpha, dy = 0) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = isNight ? "#e8d9c4" : "#2a2522";
      ctx.lineWidth = Math.max(1, pw * 0.006);
      ctx.beginPath();
      const segments = 24;
      for (let n = 0; n <= segments; n += 1) {
        const x = (n / segments) * w;
        const u = (x / w) * 2 - 1;
        const y = topY + sagY * (1 - u * u) + dy;
        if (n === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Sombras sobre la pared (de día).
    if (!isNight) {
      ctx.globalAlpha = 0.34;
      bodies.forEach((b, i) => {
        const a = anchors[i];
        ctx.save();
        ctx.translate(a.x + pw * 0.05, a.y + ph * 0.07);
        ctx.rotate(b.theta * 0.92);
        ctx.scale(Math.cos(b.phi) * 1.02, 1.02);
        ctx.drawImage(art.shadow, -pw / 2 - art.pad * k, -art.pad * k, (art.w + art.pad * 2) * k, (art.h + art.pad * 2) * k);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      drawString(0.1, ph * 0.06);
    }

    // Banderines.
    bodies.forEach((b, i) => {
      const a = anchors[i];
      const sx = Math.cos(b.phi);
      const skew = Math.sin(b.phi) * 0.07;
      ctx.save();
      ctx.translate(a.x, a.y - ph * 0.02);
      ctx.rotate(b.theta);
      ctx.transform(sx, skew, 0, 1, 0, 0);
      if (isNight && art.glow) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.26;
        ctx.drawImage(art.glow, -pw / 2 - art.gpad * k, -art.gpad * k, (art.w + art.gpad * 2) * k, (art.h + art.gpad * 2) * k);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
      ctx.drawImage(art.paper, -pw / 2, 0, pw, ph);
      const shadeAlpha = Math.min(0.6, (1 - sx) * 0.9 + Math.abs(b.theta) * 0.25 + (isNight ? 0.1 : 0));
      if (shadeAlpha > 0.01) {
        ctx.globalAlpha = shadeAlpha;
        ctx.drawImage(art.shade, -pw / 2, 0, pw, ph);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    });

    drawString(0.85);

    // Noche: focos cálidos en el hilo, entre banderines.
    if (isNight) {
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i <= anchors.length; i += 1) {
        const x = i === 0 ? anchors[0].x - pw * 0.535 : anchors[i - 1].x + pw * 0.535;
        const u = (x / w) * 2 - 1;
        const y = topY + sagY * (1 - u * u) + 3;
        const flicker = 0.85 + 0.15 * Math.sin(s.time * 3.1 + i * 2.3);
        const r = pw * 0.24;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, `rgba(255,222,165,${0.95 * flicker})`);
        grd.addColorStop(0.1, `rgba(255,196,120,${0.6 * flicker})`);
        grd.addColorStop(1, "rgba(255,160,80,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = "source-over";
    }
  };

  // Integración física.
  const step = (dt) => {
    const s = state.current;
    const { bodies, pointer, layout } = s;
    if (!layout) return;
    s.time += dt;
    const t = s.time;
    const pw = layout.pw;
    const decay = Math.exp(-dt * 6);
    pointer.vx *= decay;
    pointer.vy *= decay;

    bodies.forEach((b, i) => {
      const a = layout.anchors[i];
      let torque = wind(t, i, 0.55 * s.windStrength);
      let twist = wind(t * 1.3 + 11, i + 3, 1.1 * s.windStrength);

      // Mano: si el puntero pasa sobre el banderín, lo empuja.
      if (pointer.inside && !s.grab) {
        const dx = pointer.x - a.x;
        const dy = pointer.y - a.y;
        if (Math.abs(dx) < pw * 0.55 && dy > -pw * 0.05 && dy < layout.ph * 1.05) {
          const lever = Math.min(1, dy / layout.ph + 0.25);
          torque += (pointer.vx / pw) * 5.5 * lever;
          twist += (pointer.vx / pw) * 7 * (dx > 0 ? 1 : -1);
        }
      }

      if (s.grab && s.grab.index === i) {
        const target = Math.atan2(-(pointer.x - a.x), Math.max(1, pointer.y - a.y));
        const clamped = Math.max(-1.05, Math.min(1.05, target));
        b.omega += (clamped - b.theta) * 60 * dt;
        b.omega *= Math.exp(-dt * 8);
      }

      b.omega += (-11 * Math.sin(b.theta) - 1.25 * b.omega + torque) * dt;
      b.theta += b.omega * dt;
      b.psi += (-16 * b.phi - 2.6 * b.psi + twist) * dt;
      b.phi = Math.max(-1.25, Math.min(1.25, b.phi + b.psi * dt));
    });
  };

  // Tamaño del lienzo (CSS px y DPR) y recomposición del banderín.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    let alive = true;
    let timer = 0;

    const build = async () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const layout = layoutFor(w, h);
      const [image] = await Promise.all([loadDesign(design.id), design.text ? loadFont(font || design.text.font) : null]);
      if (!alive) return;
      const art = composePanel({ design, image, color, text, font, logo, logoScale, mode, width: layout.pw * dpr, night });
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const s = state.current;
      s.size = { w, h, dpr };
      s.art = art;
      s.layout = layout;
      if (s.bodies.length !== panels) {
        s.bodies = Array.from({ length: panels }, () => ({
          theta: (Math.random() - 0.5) * 0.08,
          omega: 0,
          phi: (Math.random() - 0.5) * 0.2,
          psi: 0,
        }));
      }
      draw();
      setReady(true);
      onReady?.();
    };

    build();
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 120);
    });
    ro.observe(wrap);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design.id, color.hex, text, font, logo, logoScale, mode, night, panels, zoom, top, sag]);

  // Bucle: solo con la escena visible y la pestaña activa.
  useEffect(() => {
    const s = state.current;
    const canvas = canvasRef.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = (now) => {
      const dt = Math.min(1 / 30, (now - (s.last || now)) / 1000);
      s.last = now;
      step(dt);
      draw();
      s.raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (s.raf || s.reduce || !s.visible || document.hidden) return;
      s.last = 0;
      s.raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      if (s.visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Con movimiento reducido no hay bucle: se repinta en cada render.
  useEffect(() => {
    if (state.current.reduce) draw();
  });

  // Puntero: velocidad suavizada y agarre.
  useEffect(() => {
    if (!interactive) return undefined;
    const canvas = canvasRef.current;
    const s = state.current;
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e) => {
      const p = local(e);
      const now = performance.now();
      const dt = Math.max(8, now - (s.pointer.t || now - 16)) / 1000;
      if (s.pointer.inside) {
        s.pointer.vx = s.pointer.vx * 0.6 + ((p.x - s.pointer.x) / dt) * 0.4;
        s.pointer.vy = s.pointer.vy * 0.6 + ((p.y - s.pointer.y) / dt) * 0.4;
      }
      s.pointer.x = p.x;
      s.pointer.y = p.y;
      s.pointer.t = now;
      s.pointer.inside = true;
    };
    const onLeave = () => {
      s.pointer.inside = false;
      s.grab = null;
    };
    const onDown = (e) => {
      const p = local(e);
      const layout = s.layout;
      if (!layout) return;
      const index = layout.anchors.findIndex(
        (a) => Math.abs(p.x - a.x) < layout.pw * 0.5 && p.y > a.y && p.y < a.y + layout.ph,
      );
      if (index >= 0) {
        s.grab = { index };
        canvas.setPointerCapture?.(e.pointerId);
      }
      onMove(e);
    };
    const onUp = () => {
      s.grab = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [interactive]);

  useImperativeHandle(ref, () => ({
    /** PNG de la vista actual, con la pared (lista de [stop, color]) de fondo. */
    async toBlob(background) {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const out = document.createElement("canvas");
      out.width = canvas.width;
      out.height = canvas.height;
      const ctx = out.getContext("2d");
      if (background) {
        const grd = ctx.createLinearGradient(0, 0, 0, out.height);
        background.forEach(([stop, c]) => grd.addColorStop(stop, c));
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, out.width, out.height);
      }
      ctx.drawImage(canvas, 0, 0);
      return new Promise((resolve) => out.toBlob(resolve, "image/png"));
    },
    /** Un empujón de viento: al cambiar algo, la tira reacciona. */
    nudge(power = 1) {
      state.current.bodies.forEach((b, i) => {
        b.omega += (Math.random() - 0.5) * 1.4 * power;
        b.psi += (i % 2 ? 1 : -1) * 2.6 * power;
      });
    },
  }));

  return (
    <div ref={wrapRef} className={className.includes("absolute") || className.includes("fixed") ? className : `relative ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label ?? `Tira de papel picado ${design.name} en ${color.label.toLowerCase()}`}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"} ${
          interactive ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""
        }`}
      />
    </div>
  );
});

export default PapelScene;
