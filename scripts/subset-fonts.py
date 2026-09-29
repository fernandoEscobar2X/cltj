# Genera las fuentes auto-hospedadas del sitio en public/fonts/.
#
# Toma los woff2 de @fontsource (node_modules) y los reduce a los glifos que un
# sitio 100% en espanol puede pintar: latin basico + latin-1 (acentos, n, ¿ ¡),
# puntuacion tipografica y flechas. Las variables se recortan a los ejes que el
# sitio usa (ver cada entrada de FONTS).
#
# Uso: python scripts/subset-fonts.py
import io
import os

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

UNICODES = [
    (0x0020, 0x007E),  # latin basico
    (0x00A0, 0x00FF),  # latin-1: acentos, n, ¿ ¡, ·, º, ª
    (0x2010, 0x2027),  # guiones, comillas tipograficas, puntos suspensivos
    (0x2030, 0x203A),
    (0x2190, 0x2199),  # flechas
]

NM = "node_modules"
FONTS = [
    # (origen, destino, instancia de ejes variables o None)
    # Titulares: stencil de rótulo industrial. Se fija el tamaño óptico de
    # display y se conserva el peso variable (se anima con el scroll).
    (f"{NM}/@fontsource-variable/big-shoulders-stencil/files/big-shoulders-stencil-latin-standard-normal.woff2", "big-shoulders-stencil.woff2", {"opsz": 72, "wght": (300, 900)}),
    # Acento: script de rotulista.
    (f"{NM}/@fontsource/yellowtail/files/yellowtail-latin-400-normal.woff2", "yellowtail.woff2", None),
    # Frases y subtítulos: grotesca condensada. El sitio la usa siempre en
    # negrita y al 82% de ancho, así que se fija esa instancia (pasa de ~120 KB
    # a ~25 KB).
    (f"{NM}/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2", "bricolage.woff2", {"opsz": 48, "wght": 700, "wdth": 82}),
    # Texto corrido y UI. Ya vive subsetteada en public/fonts (variable wght 400-700).
    ("public/fonts/instrument-sans.woff2", "instrument-sans.woff2", None),
    # Motor de papel picado: stencils para cortar el nombre del cliente.
    (f"{NM}/@fontsource-variable/saira-stencil/files/saira-stencil-latin-standard-normal.woff2", "saira-stencil.woff2", {"wdth": 100, "wght": 760}),
    (f"{NM}/@fontsource/stardos-stencil/files/stardos-stencil-latin-700-normal.woff2", "stardos-stencil-700.woff2", None),
]

wanted = set()
for start, end in UNICODES:
    wanted.update(range(start, end + 1))

for src, name, axes in FONTS:
    dest = os.path.join("public/fonts", name)
    with open(src, "rb") as fh:
        font = TTFont(io.BytesIO(fh.read()))
    size_before = os.path.getsize(src)
    options = Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=wanted)
    subsetter.subset(font)
    if axes:
        font = instancer.instantiateVariableFont(font, axes)
    font.flavor = "woff2"
    font.save(dest)
    print(f"  {name:32} {size_before // 1024:>4} KB -> {os.path.getsize(dest) // 1024:>4} KB")

# Archivos de la tipografia anterior que ya no se usan.
for old in os.listdir("public/fonts"):
    if old.startswith(("jetbrains-mono-", "saira-condensed-", "instrument-serif")) or old in (
        "instrument-sans-400.woff2",
        "instrument-sans-500.woff2",
        "instrument-sans-600.woff2",
        "instrument-sans-700.woff2",
    ):
        os.remove(os.path.join("public/fonts", old))
        print(f"  eliminado  {old}")
