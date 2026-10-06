// The platform's entry model. Every dictionary module maps its own source data
// into these shapes; the UI only ever sees these.

/** A run of dictionary text. `i` marks text the printed edition sets in italics. */
export type Run = { t: string; i?: true };
export type Rich = Run[];

export type HanStatus = "unicode" | "pua" | "image_only" | null;

export type HanMetadata = {
  character: string | null;
  unicode: string | null;
  totalStrokes: number | null;
  residualStrokes: number | null;
  radical: { kxrn: number | null; radical: string | null; variant: string | null } | null;
  comp: string | null;
  components: string[];
  idsAlternates: unknown[];
  fontSupport: { nomNaTong: boolean | null; babelStoneHan: boolean | null } | null;
  unihan: Record<string, string> | null;
  idsSource: Record<string, string> | null;
  puaMapping: unknown;
};

/** How a headword's Hán/Nôm is represented, preserving uncertainty. */
export type HanForm = {
  /** unicode: confirmed mapping; pua: font-specific private-use glyph; image_only: no accepted mapping, shown from the printed source. */
  status: HanStatus;
  found: boolean | null;
  text: string | null;
  image: { src: string | null; sourceFile: string; source: string | null; marker: string } | null;
  sourceRaw: string | null;
  metadata: HanMetadata | null;
};

export type Subentry = {
  /** 1-based position within the entry; used for #s{n} anchors. */
  n: number;
  line: number | null;
  han: string | null;
  /** Term with the headword placeholder expanded, as recorded in the data. */
  term: string;
  /** Form as printed, with ― standing for the headword. */
  display: string;
  /** Full printed form including the typographic bar. */
  printForm: string;
  separator: "before_han" | "after_han" | null;
  definition: Rich;
  raw: string;
};

export type Correction = {
  version: string | null;
  text: string;
  field?: string | null;
  from?: string | null;
  to?: string | null;
  evidence?: string | null;
  scanVerified?: boolean;
};

export type Entry = {
  id: string;
  globalId: string;
  letter: string;
  order: number;
  headword: string;
  readingNote: string | null;
  type: string | null;
  han: HanForm;
  definition: Rich;
  subentries: Subentry[];
  source: { id: string | null; letter: string | null; file: string | null; part: number | null; line: number | null; raw: string | null };
  /** Page of the 2026 digital reference edition where the entry heading is printed. */
  pdfPage: number | null;
  corrections: Correction[];
};

/** Compact row for lists (browse, neighbours, results). */
export type EntrySummary = {
  dict: string;
  id: string;
  headword: string;
  readingNote: string | null;
  type: string | null;
  han: Pick<HanForm, "status" | "text" | "image">;
  gloss: string;
  subentryCount: number;
};

export type DictionaryStats = {
  slug: string;
  dataVersion: string;
  letters: { letter: string; entries: number; subentries: number }[];
  totals: { entries: number; subentries: number; letters: number };
  hanStatus: Record<string, number>;
  imageOnlyNote: string;
  hanMetadataSources: Record<string, string>;
};

export type CharacterRecord = {
  cp: string;
  char: string;
  metadata: HanMetadata | null;
  /** Keyed by dictionary slug. */
  occurrences: Record<
    string,
    { metadataFrom: string | null; headwords: string[]; subentries: [string, number][]; definitions: [string, number][] }
  >;
};
