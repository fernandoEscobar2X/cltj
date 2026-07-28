# Reduce cada woff2 a los glifos que el sitio realmente puede usar.
#
# Google entrega el subset "latin" completo (~244 glifos, 29 KB por peso). Este
# sitio es 100% en espanol, asi que la mayor parte de ese archivo nunca se pinta.
# Se conserva latin basico + latin-1 (acentos, n con virgulilla, ¿ ¡, ·, º, ª),
# la puntuacion tipografica, las flechas (↗ del WorkTile) y ✦ (separador del
# marquee), con margen de sobra para copy nuevo en espanol.
#
# Uso: python scripts/subset-fonts.py
import glob
import os

from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont

UNICODES = [
    (0x0020, 0x007E),  # latin basico
    (0x00A0, 0x00FF),  # latin-1: acentos, n, ¿ ¡, ·, º, ª
    (0x0152, 0x0153),  # ligadura oe
    (0x2010, 0x2027),  # guiones, comillas tipograficas, puntos suspensivos
    (0x2030, 0x203A),
    (0x20AC, 0x20AC),  # euro
    (0x2122, 0x2122),  # tm
    (0x2190, 0x21FF),  # flechas
    (0x2713, 0x2714),  # palomitas
    (0x2726, 0x2726),  # ✦
]

wanted = set()
for start, end in UNICODES:
    wanted.update(range(start, end + 1))

total_before = 0
total_after = 0

# Los -latin-ext se eliminan: su cobertura (centroeuropeo) no aplica al sitio y
# el subset resultante ya incluye todo lo que el espanol necesita.
for path in sorted(glob.glob("public/fonts/*-latin-ext.woff2")):
    os.remove(path)
    print(f"  eliminado  {os.path.basename(path)}")

for path in sorted(glob.glob("public/fonts/*-latin.woff2")):
    before = os.path.getsize(path)
    total_before += before

    font = TTFont(path)
    options = Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk"]
    options.desubroutinize = True
    options.name_IDs = ["*"]
    options.name_legacy = False
    options.notdef_outline = False
    options.recalc_bounds = True

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=wanted)
    subsetter.subset(font)

    out = path.replace("-latin.woff2", ".woff2")
    font.flavor = "woff2"
    font.save(out)
    font.close()

    if out != path:
        os.remove(path)

    after = os.path.getsize(out)
    total_after += after
    print(
        f"  {os.path.basename(out):38} {before / 1024:6.1f} KB -> {after / 1024:5.1f} KB"
    )

print(
    f"\n  total {total_before / 1024:.0f} KB -> {total_after / 1024:.0f} KB "
    f"({100 - total_after * 100 / total_before:.0f}% menos)"
)
