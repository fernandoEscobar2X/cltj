// Cortes procedimentales por plantilla. Negro = hueco. Todo se dibuja en el
// lienzo 900x560 y esquiva las zonas de texto y logo de la plantilla, igual
// que lo hará el PNG real. Layout determinista: la misma plantilla siempre
// se ve igual.

const W = 900;
const H = 560;

function inBox(x, y, box, margin) {
  return x > box.x - margin && x < box.x + box.w + margin && y > box.y - margin && y < box.y + box.h + margin;
}

function isClear(template, x, y, margin = 22) {
  return !inBox(x, y, template.textBox, margin) && !inBox(x, y, template.logoBox, margin);
}

// ─── Primitivas ────────────────────────────────────────────────────────────

function Rhombus({ x, y, s }) {
  return <polygon points={`${x},${y - s} ${x + s * 0.62},${y} ${x},${y + s} ${x - s * 0.62},${y}`} />;
}

function Star({ x, y, s }) {
  const pts = [];
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? s : s * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`);
  }
  return <polygon points={pts.join(" ")} />;
}

function Heart({ x, y, s }) {
  // Corazón centrado en (x, y) con "ancho" s.
  const k = s / 20;
  return (
    <path
      transform={`translate(${x} ${y}) scale(${k})`}
      d="M0,6 C-2,-2 -12,-4 -12,3 C-12,9 -4,13 0,17 C4,13 12,9 12,3 C12,-4 2,-2 0,6 Z"
    />
  );
}

function Teardrop({ x, y, s, rotate = 0 }) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${rotate})`}
      d={`M0,${-s} C${s * 0.55},${-s * 0.3} ${s * 0.55},${s * 0.4} 0,${s * 0.55} C${-s * 0.55},${s * 0.4} ${-s * 0.55},${-s * 0.3} 0,${-s} Z`}
    />
  );
}

// Flecos: dientes en el borde inferior. Común a todas las plantillas.
function Fringe({ depth = 34, step = 44 }) {
  const teeth = [];
  for (let x = 0; x < W; x += step) {
    teeth.push(`${x},${H} ${x + step / 2},${H - depth} ${x + step},${H}`);
  }
  return teeth.map((pts, i) => <polygon key={`f-${i}`} points={pts} />);
}

// Puntilla: hilera de cortes pequeños paralela a un borde.
function Lace({ y, r = 7, step = 36, offset = 18 }) {
  const dots = [];
  for (let x = offset; x < W; x += step) dots.push(<circle key={`l-${y}-${x}`} cx={x} cy={y} r={r} />);
  return dots;
}

// ─── Plantillas ────────────────────────────────────────────────────────────

function Fiesta({ template }) {
  const field = [];
  for (let row = 0; row < 7; row += 1) {
    const y = 88 + row * 60;
    const shift = row % 2 ? 36 : 0;
    for (let col = 0; col < 12; col += 1) {
      const x = 78 + shift + col * 72;
      if (x > W - 60 || !isClear(template, x, y)) continue;
      field.push(<Rhombus key={`d-${row}-${col}`} x={x} y={y} s={13} />);
    }
  }
  // Medallón alrededor del logo.
  const ring = [];
  const cx = template.logoBox.x + template.logoBox.w / 2;
  const cy = template.logoBox.y + template.logoBox.h / 2;
  const R = Math.max(template.logoBox.w, template.logoBox.h) / 2 + 26;
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2;
    ring.push(<Teardrop key={`r-${i}`} x={cx + Math.cos(a) * R} y={cy + Math.sin(a) * R} s={9} rotate={(a * 180) / Math.PI + 90} />);
  }
  return (
    <g fill="#000">
      <Lace y={26} />
      {field}
      {ring}
      <Fringe />
    </g>
  );
}

function Negocio({ template }) {
  const slits = [];
  for (let x = 96; x < W - 80; x += 44) slits.push(<rect key={`s-${x}`} x={x} y={30} width="8" height="22" rx="4" />);
  const frame = 44;
  const gap = 90;
  return (
    <g fill="#000">
      {slits}
      {/* Marco con esquinas abiertas */}
      <rect x={frame + gap} y={frame + 26} width={W - 2 * (frame + gap)} height="4" />
      <rect x={frame} y={frame + gap + 26} width="4" height={H - 2 * (frame + gap) - 60} />
      <rect x={W - frame - 4} y={frame + gap + 26} width="4" height={H - 2 * (frame + gap) - 60} />
      {/* Esquinas */}
      {[[frame, frame + 26], [W - frame - 26, frame + 26], [frame, H - frame - 90], [W - frame - 26, H - frame - 90]].map(
        ([x, y]) => <rect key={`c-${x}-${y}`} x={x} y={y} width="26" height="26" />,
      )}
      {/* Motivos laterales */}
      {[130, W - 130].map((x) => (
        <g key={`m-${x}`}>
          <circle cx={x} cy={200} r={22} />
          <circle cx={x} cy={262} r={15} />
          <circle cx={x} cy={306} r={9} />
        </g>
      ))}
      <Fringe depth={26} step={36} />
    </g>
  );
}

function Corazon({ template }) {
  const cx = 450;
  const cy = 236;
  const dots = [];
  for (let i = 0; i < 36; i += 1) {
    const t = (i / 36) * Math.PI * 2;
    // Curva de corazón paramétrica.
    const hx = 16 * Math.sin(t) ** 3;
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const x = cx + hx * 9.2;
    const y = cy + hy * 9.2;
    dots.push(<circle key={`h-${i}`} cx={x} cy={y} r={8} />);
  }
  const corners = [
    [64, 70],
    [W - 64, 70],
    [64, H - 110],
    [W - 64, H - 110],
  ].map(([x, y]) => <Heart key={`hc-${x}-${y}`} x={x} y={y - 8} s={22} />);
  return (
    <g fill="#000">
      <Lace y={24} r={6} step={30} />
      {dots}
      {corners}
      <Fringe depth={30} step={40} />
    </g>
  );
}

function Celebracion({ template }) {
  const stars = [
    [90, 96, 20],
    [240, 70, 14],
    [450, 84, 26],
    [660, 70, 14],
    [810, 96, 20],
    [150, 470, 12],
    [300, 495, 16],
    [600, 495, 16],
    [750, 470, 12],
  ];
  const confetti = [
    [180, 130, 6],
    [330, 118, 5],
    [570, 118, 5],
    [720, 130, 6],
    [80, 300, 7],
    [820, 300, 7],
    [110, 400, 5],
    [790, 400, 5],
  ];
  return (
    <g fill="#000">
      {stars
        .filter(([x, y]) => isClear(template, x, y, 10))
        .map(([x, y, s]) => <Star key={`s-${x}-${y}`} x={x} y={y} s={s} />)}
      {confetti
        .filter(([x, y]) => isClear(template, x, y, 10))
        .map(([x, y, r]) => <circle key={`c-${x}-${y}`} cx={x} cy={y} r={r} />)}
      <Fringe depth={36} step={50} />
    </g>
  );
}

const patterns = { fiesta: Fiesta, negocio: Negocio, corazon: Corazon, celebracion: Celebracion };

export default function PapelPattern({ template }) {
  const Pattern = patterns[template.id] ?? Fiesta;
  return <Pattern template={template} />;
}
