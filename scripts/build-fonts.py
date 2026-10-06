"""Subset the Hán/Nôm fonts to the characters the dictionaries actually use.

Usage: python3 scripts/build-fonts.py <NomNaTong-Regular.otf> <BabelStoneHan.ttf>

Writes public/fonts/nom-na-tong-subset.woff2 and babelstone-han-subset.woff2.
Fonts are not guessed per character: Nom Na Tong is primary (as in the 2026 PDF),
BabelStone Han only receives the characters Nom Na Tong has no glyph for.
"""
import io, json, sys, zipfile
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
ZIP = ROOT / "data/sources/dnqatv/v024/dnqatv.individual.letters.v024.zip"
OUT = ROOT / "public/fonts"


def is_han(ch: str) -> bool:
    o = ord(ch)
    return (
        0x2E80 <= o <= 0x2FFF  # radicals, Kangxi, IDS operators
        or 0x3005 <= o <= 0x3007
        or 0x3400 <= o <= 0x4DBF
        or 0x4E00 <= o <= 0x9FFF
        or 0xF900 <= o <= 0xFAFF
        or 0x20000 <= o <= 0x3FFFF
        or 0xE000 <= o <= 0xF8FF
        or 0xF0000 <= o <= 0x10FFFF
    )


def charset() -> set[str]:
    chars: set[str] = set()
    with zipfile.ZipFile(ZIP) as z:
        for name in z.namelist():
            if name.startswith("json/") and name.endswith(".json"):
                chars.update(c for c in z.read(name).decode("utf-8") if is_han(c))
    chars.update("大南國音字彙")
    return chars


def write_subset(src: str, chars: set[str], dest: Path) -> None:
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.notdef_outline = True
    font = TTFont(src)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=[ord(c) for c in chars])
    sub.subset(font)
    font.flavor = "woff2"
    font.save(dest)
    print(dest.name, len(chars), "chars", dest.stat().st_size // 1024, "KB")


def main() -> None:
    nom_src, babel_src = sys.argv[1], sys.argv[2]
    chars = charset()
    nom_cmap = TTFont(nom_src).getBestCmap()
    in_nom = {c for c in chars if ord(c) in nom_cmap}
    rest = chars - in_nom
    babel_cmap = TTFont(babel_src).getBestCmap()
    in_babel = {c for c in rest if ord(c) in babel_cmap}
    OUT.mkdir(parents=True, exist_ok=True)
    write_subset(nom_src, in_nom, OUT / "nom-na-tong-subset.woff2")
    write_subset(babel_src, in_babel, OUT / "babelstone-han-subset.woff2")
    missing = sorted(rest - in_babel)
    report = {
        "characters": len(chars),
        "nomNaTong": len(in_nom),
        "babelStoneHan": len(in_babel),
        "inNeither": [f"U+{ord(c):04X}" for c in missing],
    }
    (OUT / "coverage.json").write_text(json.dumps(report, indent=1) + "\n")
    print(json.dumps({k: (v if not isinstance(v, list) else len(v)) for k, v in report.items()}))


if __name__ == "__main__":
    main()
