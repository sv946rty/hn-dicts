# hn-dicts

A web platform for historical Vietnamese and Hán/Nôm dictionaries. The first
dictionary is **Đại Nam Quấc Âm Tự Vị** (大南國音字彙), Huình-Tịnh Paulus Của,
Tome I 1895 / Tome II 1896, from the v024 structured data.

This is the V1 **interactive UI prototype**: every screen works on the full
dataset, but search is an in-memory scan and there are no accounts. See
[docs/DESIGN-REVIEW.md](docs/DESIGN-REVIEW.md) for the design decisions and
[docs/data-observations.md](docs/data-observations.md) for data issues found
while building it.

## Run it

```bash
npm install
npm run dev        # builds data/generated from the v024 zip, then starts Next.js
# open http://localhost:3000
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`,
`npm run data` (regenerate derived data only).

## Layout

```
data/sources/dnqatv/v024/   v024 letter zip (input, unchanged) + PDF page map
scripts/build-data.mjs      v024 → data/generated/ (derived, not committed)
scripts/build-fonts.py      subsets Nom Na Tong / BabelStone Han → public/fonts
src/app/                    routes (Next.js App Router)
src/platform/               shared UI: shell, search, Hán/Nôm, entry layout, registry
src/dictionaries/dnqatv/    DNQATV-specific identity, home, marks
src/lib/data/               data access + search (server only) and the Entry model
public/glyphs/dnqatv/       image-only Hán/Nôm glyphs (see PROVENANCE.md)
```

## Principles the code keeps

- The structured master data is authoritative; this site is derived from it.
- Historical orthography, wording and Hán/Nôm are displayed exactly as stored.
  Search may ignore tone marks; display never does.
- Unresolved glyphs stay images with the edition's `*`; no look-alike substitutes.
- Every dictionary URL names its dictionary; entry ids are the v024 ids.

## Fonts

`public/fonts` holds subsets of Nom Na Tong (MIT, Vietnamese Nôm Preservation
Foundation) and BabelStone Han (Arphic Public License), generated with
`python3 scripts/build-fonts.py NomNaTong-Regular.otf BabelStoneHan.ttf`.
