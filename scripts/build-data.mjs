// Derive the web app's data files from the DNQATV v024 letter distribution.
//
// The v024 zip is the input and is never modified. Everything written to
// data/generated/ is a derived artifact and can be regenerated at any time:
//
//   node scripts/build-data.mjs
//
// Normalisation here is structural only (field names, one shape for image
// fallbacks, italic runs recovered from the raw source). Headwords, Hán/Nôm,
// definitions and orthography are copied exactly as they appear in v024.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync, strFromU8 } from "fflate";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "data/sources/dnqatv/v024");
const OUT = join(ROOT, "data/generated/dnqatv");
const DATA_VERSION = "v024";

// Letter order of the printed dictionary (Y sits between H and K).
const LETTERS = ["A", "B", "C", "D", "Đ", "E", "G", "H", "Y", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X"];

const HAN_RE = /[⺀-⿿々-〇㐀-䶿一-鿿豈-﫿-]|[\uD840-\uD8BF\uDB80-\uDBFF][\uDC00-\uDFFF]/u;

const zip = unzipSync(readFileSync(join(SRC, "dnqatv.individual.letters.v024.zip")));
const pdfPages = JSON.parse(readFileSync(join(SRC, "pdf-pages.json"), "utf8"));
// Glyph images for image-only Hán/Nôm (see public/glyphs/dnqatv/PROVENANCE.md).
const glyphFiles = new Set(
  readdirSync(join(ROOT, "public/glyphs/dnqatv"))
    .filter((f) => f.endsWith(".png"))
    .map((f) => f.normalize("NFC").slice(0, -4)),
);

// ---------------------------------------------------------------------------
// Rich text: recover the italic runs (examples, cross-references) that the
// printed dictionary sets in italics. v024 keeps them as *…* in the raw source
// while the definition field is plain. We only use the raw form when, with the
// markers removed, it reproduces the definition field exactly.
// ---------------------------------------------------------------------------

function stripLinks(s) {
  return s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
}

function richFromRaw(definition, raw) {
  if (!definition) return [];
  const plain = [];
  const italic = [];
  let on = false;
  for (const ch of stripLinks(raw ?? "")) {
    if (ch === "*") {
      on = !on;
      continue;
    }
    // Raw rows use no-break spaces where the definition field has plain ones.
    plain.push(/\s/.test(ch) ? " " : ch);
    italic.push(on);
  }
  const text = plain.join("");
  const at = text.lastIndexOf(definition.replace(/\s/g, " "));
  if (at < 0) return [{ t: definition }];
  const runs = [];
  for (let i = 0; i < definition.length; i++) {
    const it = italic[at + i];
    const last = runs[runs.length - 1];
    if (last && !!last.i === it) last.t += definition[i];
    else runs.push(it ? { t: definition[i], i: true } : { t: definition[i] });
  }
  return runs;
}

// ---------------------------------------------------------------------------

function normaliseHan(e) {
  const status = e.hnStatus ?? null;
  let image = null;
  if (e.hanImage) {
    const file = typeof e.hanImage === "string" ? e.hanImage : e.hanImage.file;
    const id = e.id;
    image = {
      // Only point at a file we actually have; otherwise the UI shows a
      // "glyph image not available" placeholder rather than a substitute.
      src: glyphFiles.has(id) ? `/glyphs/dnqatv/${encodeURIComponent(id)}.png` : null,
      sourceFile: file,
      source: typeof e.hanImage === "object" ? e.hanImage.source ?? null : null,
      marker: typeof e.hanImage === "object" ? e.hanImage.displayMarker ?? "*" : "*",
    };
  }
  const m = e.hanMetadata;
  return {
    status,
    found: e.hnFound ?? null,
    text: e.han ?? null,
    image,
    sourceRaw: e.hanSourceRaw ?? null,
    metadata: m
      ? {
          character: m.character ?? null,
          unicode: m.unicode ?? null,
          totalStrokes: m.totalStrokes ?? null,
          residualStrokes: m.residualStrokes ?? null,
          radical: m.radical ?? null,
          comp: m.comp ?? null,
          components: m.components ?? [],
          idsAlternates: m.idsAlternates ?? [],
          fontSupport: m.fontSupport ?? null,
          unihan: m.unihan ?? null,
          idsSource: m.idsSource ?? null,
          puaMapping: m.puaMapping ?? null,
        }
      : null,
  };
}

function normaliseCorrections(e) {
  const list = [];
  for (const c of e.corrections ?? []) list.push({ version: c.version ?? null, text: c.reason, field: c.field ?? null, from: c.from ?? null, to: c.to ?? null });
  for (const c of e.editorialCorrections ?? []) list.push({ version: c.version ?? null, text: c.reason, evidence: c.evidence ?? null });
  if (e.editorialCorrection) list.push({ version: e.editorialCorrection.version ?? null, text: e.editorialCorrection.reason, evidence: e.editorialCorrection.evidence ?? null });
  if (e.scan_correction_note) list.push({ version: null, text: e.scan_correction_note, scanVerified: !!e.scan_verified });
  return list;
}

const entries = [];
const letters = [];
let header = null;

for (const letter of LETTERS) {
  const file = zip[`json/${letter}.json`];
  if (!file) throw new Error(`missing json/${letter}.json in v024 zip`);
  const doc = JSON.parse(strFromU8(file));
  if (!header) header = doc;
  let subentries = 0;
  for (const e of doc.entries) {
    subentries += e.subentries.length;
    entries.push({
      id: e.id,
      globalId: e.global_id,
      letter,
      order: entries.length,
      headword: e.headword,
      readingNote: e.reading_note ?? null,
      type: e.type ?? null,
      han: normaliseHan(e),
      definition: richFromRaw(e.definition, e.source?.raw),
      subentries: e.subentries.map((s, i) => ({
        n: i + 1,
        line: s.source_line ?? null,
        han: s.han ?? null,
        term: s.term,
        display: s.layout?.display_text ?? s.display,
        printForm: s.layout?.source_display ?? s.display,
        separator: s.layout?.separator ?? null,
        definition: richFromRaw(s.definition, s.raw),
        raw: s.raw,
      })),
      source: {
        id: e.source_id ?? null,
        letter: e.source_letter ?? null,
        file: e.source_file ?? null,
        part: e.source_part ?? null,
        line: e.source?.line ?? null,
        raw: e.source?.raw ?? null,
      },
      pdfPage: pdfPages[e.id] ?? null,
      corrections: normaliseCorrections(e),
    });
  }
  letters.push({ letter, entries: doc.entries.length, subentries });
}

// ---------------------------------------------------------------------------
// Characters: a platform-level index keyed by code point. Metadata comes only
// from v024 hanMetadata (recorded for headword characters); occurrences are
// recorded per dictionary so a second dictionary can add its own.
// ---------------------------------------------------------------------------

const chars = new Map();
function charRec(ch) {
  let r = chars.get(ch);
  if (!r) {
    r = { char: ch, cp: `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`, metadata: null, metadataFrom: null, headwords: [], subentries: [], definitions: [] };
    chars.set(ch, r);
  }
  return r;
}
function isStandardHan(ch) {
  const o = ch.codePointAt(0);
  if ((o >= 0xe000 && o <= 0xf8ff) || o >= 0xf0000) return false; // PUA: font-specific, not a shared identity
  if (o >= 0x2e80 && o <= 0x2fff) return false; // radicals / IDS operators
  return HAN_RE.test(ch);
}
function hanChars(s) {
  return [...(s ?? "")].filter(isStandardHan);
}
function plainText(rich) {
  return rich.map((r) => r.t).join("");
}

for (const e of entries) {
  if (e.han.status === "unicode" && e.han.text) {
    for (const ch of hanChars(e.han.text)) {
      const r = charRec(ch);
      r.headwords.push(e.id);
      if (!r.metadata && e.han.metadata && e.han.metadata.character === ch) {
        r.metadata = e.han.metadata;
        r.metadataFrom = e.id;
      }
    }
  }
  for (const s of e.subentries) {
    for (const ch of new Set(hanChars(s.han))) charRec(ch).subentries.push([e.id, s.n]);
    for (const ch of new Set(hanChars(plainText(s.definition)))) charRec(ch).definitions.push([e.id, s.n]);
  }
  for (const ch of new Set(hanChars(plainText(e.definition)))) charRec(ch).definitions.push([e.id, 0]);
}

const radicals = new Map();
for (const r of chars.values()) {
  const rad = r.metadata?.radical;
  if (!rad?.kxrn) continue;
  const k = rad.kxrn;
  if (!radicals.has(k)) radicals.set(k, { kxrn: k, radical: rad.radical, chars: [] });
  radicals.get(k).chars.push([r.char, r.metadata.residualStrokes ?? null]);
}

// ---------------------------------------------------------------------------

const statusCounts = {};
for (const e of entries) statusCounts[e.han.status ?? "none"] = (statusCounts[e.han.status ?? "none"] ?? 0) + 1;

const dictionary = {
  slug: "dnqatv",
  dataVersion: DATA_VERSION,
  sourceTitle: header.dictionary,
  author: header.author,
  letters,
  totals: { entries: entries.length, subentries: letters.reduce((a, l) => a + l.subentries, 0), letters: letters.length },
  hanStatus: statusCounts,
  imageOnlyMarker: header.image_only_marker,
  imageOnlyNote: header.image_only_note,
  hnSchemaNote: header.han_schema_note,
  hanMetadataSources: header.han_metadata_sources,
  preservationPolicy: header.preservation_policy,
  correctionStatus: { version: header.correction_status?.version ?? null, fontCoverage: header.correction_status?.font_coverage ?? null },
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "dictionary.json"), JSON.stringify(dictionary, null, 1));
writeFileSync(join(OUT, "entries.json"), JSON.stringify(entries));
mkdirSync(join(ROOT, "data/generated"), { recursive: true });
writeFileSync(
  join(ROOT, "data/generated/characters.json"),
  JSON.stringify({
    characters: Object.fromEntries([...chars.values()].map((r) => [r.cp, { char: r.char, metadata: r.metadata, occurrences: { dnqatv: { metadataFrom: r.metadataFrom, headwords: r.headwords, subentries: r.subentries, definitions: r.definitions } } }])),
    radicals: [...radicals.values()].sort((a, b) => a.kxrn - b.kxrn).map((r) => ({ ...r, chars: r.chars.sort((x, y) => (x[1] ?? 99) - (y[1] ?? 99)) })),
  }),
);

console.log(`dnqatv ${DATA_VERSION}: ${entries.length} entries, ${dictionary.totals.subentries} subentries, ${chars.size} characters, ${radicals.size} radicals, ${glyphFiles.size} glyph images`);
