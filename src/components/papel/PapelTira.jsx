import { forwardRef } from "react";
import PapelPreview from "./PapelPreview";
import { papelTiraPalette } from "../../data/papelPicado";

// Tira de papel picado colgada: el panel central es el personalizado, los
// laterales repiten la plantilla (en otros colores si `multicolor`), como en
// una tira real. Los paneles siguen la curva del hilo (parábola) y el hilo se
// dibuja encima, como si el papel estuviera doblado sobre él. `zoom` acerca la
// tira: los paneles laterales quedan recortados por los bordes, como en una foto.
const SAG = 1.6; // rem de caída del hilo al centro
const TOP = 0.75; // rem entre el borde superior y el hilo

const PapelTira = forwardRef(function PapelTira(
  {
    templateId,
    colorId,
    text = "",
    logoUrl,
    logoScale = 1,
    showGuides = false,
    panels = 3,
    zoom = 1,
    multicolor = true,
    sideText = false,
    className = "",
  },
  ref,
) {
  const half = Math.floor(panels / 2);
  const sidePalette = papelTiraPalette.filter((id) => id !== colorId);
  const items = Array.from({ length: panels }, (_, index) => {
    const offset = index - half;
    const t = half ? offset / half : 0;
    const drop = SAG * (1 - t * t);
    const center = offset === 0;
    return {
      key: center ? "center" : `side-${index}`,
      center,
      drop,
      colorId: center || !multicolor ? colorId : sidePalette[index % sidePalette.length],
      text: center || sideText ? text : "",
      logoUrl: center || sideText ? logoUrl : undefined,
    };
  });

  const halfWidth = half ? (half * 100) / panels : 50;
  const edgeT = 50 / halfWidth;
  const yEdge = TOP + SAG * (1 - edgeT * edgeT);
  const yControl = 2 * (TOP + SAG) - yEdge;
  const stringHeight = SAG + TOP + 0.5;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div className="relative" style={{ width: `${zoom * 100}%`, marginLeft: `${-(zoom - 1) * 50}%` }}>
        <div
          className="grid items-start gap-[2.5%] px-[3%]"
          style={{ gridTemplateColumns: `repeat(${panels}, minmax(0, 1fr))`, paddingTop: `${TOP}rem` }}
        >
          {items.map((item, index) => (
            <div
              key={item.key}
              className={index % 2 === 0 ? "papel-sway w-full" : "papel-sway papel-sway--alt w-full"}
              style={{ marginTop: `${item.drop}rem`, animationDelay: `${(index * 0.9) % 2.7}s` }}
            >
              <div className="drop-shadow-[0_18px_28px_rgba(0,0,0,0.28)]">
                <PapelPreview
                  templateId={templateId}
                  colorId={item.colorId}
                  text={item.text}
                  logoUrl={item.logoUrl}
                  logoScale={logoScale}
                  showGuides={item.center && showGuides}
                  className="block w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <svg
          className="pointer-events-none absolute inset-x-0 top-0 w-full"
          style={{ height: `${stringHeight}rem` }}
          viewBox={`0 0 100 ${stringHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={`M0 ${yEdge} Q50 ${yControl} 100 ${yEdge}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.75"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
});

export default PapelTira;
