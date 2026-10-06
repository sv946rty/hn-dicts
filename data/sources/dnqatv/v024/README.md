# DNQATV v024 inputs

- `dnqatv.individual.letters.v024.zip`: the per-letter distribution of v024, as supplied (unchanged). `scripts/build-data.mjs` reads it and writes derived files to `data/generated/` (not committed).
- `pdf-pages.json`: entry id → page of the 2026 digital reference edition where the entry's heading is printed. Derived by matching each heading (Hán/Nôm, headword, type mark) in the PDF text in dictionary order; 7,631 of 7,632 entries located (T-0507 not found). Checked against the 23 image-only entries, whose glyph images appear on exactly the mapped pages.

The master dataset is `dnqatv.all.v024.json`; when it changes, regenerate the letter zip from it and replace the file here.
