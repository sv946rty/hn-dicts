# Glyph images for image-only Hán/Nôm (DNQATV v024)

v024 marks 23 headwords `hnStatus: "image_only"`: no Unicode mapping has been
accepted, so the printed glyph is shown as an image instead of a guessed character.

- `C-0360.png` is the only image shipped in `dnqatv.individual.letters.v024.zip` (`hn/C-0360.png`).
- The other 22 were extracted, unaltered, with `pdfimages` from
  *Đại Nam Quốc Âm Tự Vị (2026).pdf*, page 10 ("Lưu ý"), which lists every
  image-only word with its glyph crop "cắt từ bản in gốc".
- Each file was checked byte-for-byte (decoded pixels) against the image printed
  at that entry in the PDF; all 23 match, including C-0360.

File names are entry ids. Replace any file with the original scan crop when the
project's `hn/` assets are published; nothing else needs to change.
