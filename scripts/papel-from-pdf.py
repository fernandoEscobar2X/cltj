# Extrae los diseños de papel picado del PDF del taller a SVG.
#
# El PDF (CorelDRAW, vectorial) trae todos los diseños en una hoja. Cada diseño
# es un "cuerpo" de color (el papel) y encima formas blancas (los cortes). Este
# script localiza cada cuerpo, junta los cortes que caen dentro y escribe
# public/papel/<id>.svg: una máscara con el papel en blanco y los cortes en
# negro, de modo que el SVG resultante es papel opaco con huecos transparentes.
# El motor (src/components/papel/engine/compose.js) lo pinta del color elegido.
#
# En los diseños "con nombre" se quitan los cortes del texto original (EXCLUDE)
# para que el motor corte el texto del cliente en su lugar. El texto vivo del
# PDF (FRANCISCO, en Stencilia) no se dibuja: solo se usan trazos.
#
# Uso: python scripts/papel-from-pdf.py [ruta.pdf]
# Requiere PyMuPDF (pip install pymupdf). Al terminar, subir papelAssetVersion
# en src/data/papelPicado.js para invalidar la caché de los SVG.
import os
import sys

import fitz  # PyMuPDF

PDF = sys.argv[1] if len(sys.argv) > 1 else "assets/papel-picado/disenos.pdf"
OUT = "public/papel"

# Orden de lectura del PDF (filas de arriba abajo, izquierda a derecha) -> id.
IDS = [
    "cielito-lindo", "bebe", "charro", "paloma",
    "baby-shower-palomas", "baby-shower-flores", "primera-comunion", "bautizo",
    "boda-iniciales", "boda-nombres", "marco", "fiesta-roja",
    "dinosaurios", "happy-halloween", "calabaza", "corazones",
    "abanicos", "catrina", "muneca", "calavera-charra",
]

# Índices de dibujo (page.get_drawings()) del texto original que se quita.
EXCLUDE = {
    "bautizo": {1842},  # MI BAUTIZO
    "boda-iniciales": {1942, 1943, 1944},  # J & I
    "boda-nombres": {2025, 2028, 2068},  # Jesús & Isela (y sus puntos)
}


def fmt(v):
    s = f"{v:.1f}"
    s = s[:-2] if s.endswith(".0") else s
    if s.startswith("-0."):
        return "-" + s[2:]
    return s[1:] if s.startswith("0.") else s


def path_d(drawing, ox, oy):
    d, cur = [], None

    def move(p):
        return cur is None or abs(cur.x - p.x) > 0.01 or abs(cur.y - p.y) > 0.01

    for item in drawing["items"]:
        kind = item[0]
        if kind == "l":
            a, b = item[1], item[2]
            if move(a):
                d.append(f"M{fmt(a.x - ox)} {fmt(a.y - oy)}")
            d.append(f"L{fmt(b.x - ox)} {fmt(b.y - oy)}")
            cur = b
        elif kind == "c":
            a, c1, c2, b = item[1], item[2], item[3], item[4]
            if move(a):
                d.append(f"M{fmt(a.x - ox)} {fmt(a.y - oy)}")
            d.append(f"C{fmt(c1.x - ox)} {fmt(c1.y - oy)} {fmt(c2.x - ox)} {fmt(c2.y - oy)} {fmt(b.x - ox)} {fmt(b.y - oy)}")
            cur = b
        elif kind == "re":
            r = item[1]
            d.append(f"M{fmt(r.x0 - ox)} {fmt(r.y0 - oy)}H{fmt(r.x1 - ox)}V{fmt(r.y1 - oy)}H{fmt(r.x0 - ox)}Z")
            cur = None
        elif kind == "qu":
            q = item[1]
            d.append(
                f"M{fmt(q.ul.x - ox)} {fmt(q.ul.y - oy)}L{fmt(q.ur.x - ox)} {fmt(q.ur.y - oy)}"
                f"L{fmt(q.lr.x - ox)} {fmt(q.lr.y - oy)}L{fmt(q.ll.x - ox)} {fmt(q.ll.y - oy)}Z"
            )
            cur = None
    d.append("Z")
    return "".join(d).replace(" -", "-")


def main():
    page = fitz.open(PDF)[0]
    drawings = page.get_drawings()

    # Cuerpos: rellenos de color (no blancos). Uno por diseño.
    bodies = [
        (i, x) for i, x in enumerate(drawings)
        if x["type"] == "fs" and x.get("fill") and min(x["fill"]) < 0.97
    ]
    bodies.sort(key=lambda b: (round(b[1]["rect"].y0 / 300), b[1]["rect"].x0))
    if len(bodies) != len(IDS):
        sys.exit(f"Se esperaban {len(IDS)} diseños y el PDF trae {len(bodies)}. Actualiza IDS.")

    os.makedirs(OUT, exist_ok=True)
    for (body_index, body), design_id in zip(bodies, IDS):
        r = body["rect"]
        ox, oy, w, h = r.x0, r.y0, r.width, r.height
        rule = ' fill-rule="evenodd"' if body.get("even_odd") else ""
        parts = [f'<path d="{path_d(body, ox, oy)}" fill="#fff"{rule}/>']
        skip = EXCLUDE.get(design_id, set())
        for i, x in enumerate(drawings):
            if i <= body_index or i in skip:
                continue
            if x["type"] == "fs" and x.get("fill") and min(x["fill"]) < 0.97:
                continue  # otro cuerpo
            xr = x["rect"]
            if not r.contains(fitz.Point((xr.x0 + xr.x1) / 2, (xr.y0 + xr.y1) / 2)):
                continue
            if x["type"] == "s":
                parts.append(f'<path d="{path_d(x, ox, oy)}" fill="none" stroke="#fff" stroke-width="{fmt(x.get("width") or 1)}"/>')
            else:
                eo = ' fill-rule="evenodd"' if x.get("even_odd") else ""
                parts.append(f'<path d="{path_d(x, ox, oy)}"{eo}/>')
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w)} {fmt(h)}">'
            f'<mask id="c" maskUnits="userSpaceOnUse" x="-2" y="-2" width="{fmt(w + 4)}" height="{fmt(h + 4)}">{"".join(parts)}</mask>'
            f'<rect x="-2" y="-2" width="{fmt(w + 4)}" height="{fmt(h + 4)}" mask="url(#c)"/></svg>'
        )
        with open(os.path.join(OUT, f"{design_id}.svg"), "w", encoding="utf-8") as fh:
            fh.write(svg)
        print(f"  {design_id:22} {w:.1f} x {h:.1f}  ({len(parts) - 1} cortes)")


if __name__ == "__main__":
    main()
