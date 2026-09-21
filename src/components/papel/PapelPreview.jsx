import { useEffect, useId, useState } from "react";
import { papelColors, papelLimits, papelTemplates } from "../../data/papelPicado";
import PapelPattern from "./papelPatterns";

const FONT = '"Bricolage Grotesque Variable", "Bricolage Grotesque", Arial, sans-serif';

// Ajusta el tamaño de fuente para que el texto llene la caja sin desbordar.
function useFitFont(text, box) {
  const [size, setSize] = useState(() => Math.min(box.h * 0.8, (box.w / Math.max(text.length, 1)) * 1.5));

  useEffect(() => {
    if (!text) return undefined;
    let alive = true;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const measure = () => {
      if (!alive || !ctx) return;
      ctx.font = `600 100px ${FONT}`;
      const width = ctx.measureText(text).width || 1;
      setSize(Math.min(box.h * 0.82, (box.w / width) * 100));
    };
    measure();
    document.fonts?.ready.then(measure);
    return () => {
      alive = false;
    };
  }, [text, box.w, box.h]);

  return size;
}

export default function PapelPreview({
  templateId = "fiesta",
  text = "",
  colorId = "rojo",
  logoUrl,
  logoScale = 1,
  showGuides = false,
  className = "",
}) {
  const uid = useId().replace(/:/g, "");
  const color = papelColors.find((item) => item.id === colorId) ?? papelColors[0];
  const template = papelTemplates.find((item) => item.id === templateId) ?? papelTemplates[0];
  const display = text.slice(0, papelLimits.maxChars).toUpperCase();
  const fontSize = useFitFont(display, template.textBox);
  const { textBox, logoBox } = template;

  // El logo escala desde el centro de su zona.
  const lw = logoBox.w * logoScale;
  const lh = logoBox.h * logoScale;
  const lx = logoBox.x + (logoBox.w - lw) / 2;
  const ly = logoBox.y + (logoBox.h - lh) / 2;

  const ids = {
    mask: `papel-mask-${uid}`,
    toWhite: `papel-white-${uid}`,
    toBlack: `papel-black-${uid}`,
    grain: `papel-grain-${uid}`,
    light: `papel-light-${uid}`,
  };

  return (
    <svg
      viewBox="0 0 900 560"
      className={className}
      role="img"
      aria-label={`Papel picado ${template.name} en ${color.label.toLowerCase()}${display ? ` con el texto ${display}` : ""}`}
    >
      <defs>
        <filter id={ids.toWhite} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <filter id={ids.toBlack} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id={ids.grain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id={ids.light} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>

        <mask id={ids.mask} maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="560">
          {template.image ? (
            <image
              href={template.image}
              width="900"
              height="560"
              preserveAspectRatio="none"
              filter={`url(#${ids.toWhite})`}
            />
          ) : (
            <>
              <rect width="900" height="560" fill="#fff" />
              <PapelPattern template={template} />
            </>
          )}
          {logoUrl ? (
            <image
              href={logoUrl}
              x={lx}
              y={ly}
              width={lw}
              height={lh}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${ids.toBlack})`}
            />
          ) : null}
          {display ? (
            <text
              x="450"
              y={textBox.y + textBox.h / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#000"
              fontFamily={FONT}
              fontSize={fontSize}
              fontWeight="600"
              letterSpacing="1"
            >
              {display}
            </text>
          ) : null}
        </mask>
      </defs>

      <g mask={`url(#${ids.mask})`}>
        <rect width="900" height="560" fill={color.hex} />
        <rect width="900" height="560" filter={`url(#${ids.grain})`} opacity="0.14" style={{ mixBlendMode: "multiply" }} />
        <rect width="900" height="560" fill={`url(#${ids.light})`} />
      </g>

      {showGuides && !logoUrl ? (
        <rect
          x={logoBox.x}
          y={logoBox.y}
          width={logoBox.w}
          height={logoBox.h}
          rx="8"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
      ) : null}
    </svg>
  );
}
