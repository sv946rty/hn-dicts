import "server-only";
import { availableDictionaries } from "@/platform/registry";
import { fold, hasHan, lowerNfc } from "@/platform/text";
import { getEntries, plain, summarize } from "./dictionaries";
import type { Entry, EntrySummary } from "./types";

// Prototype search: an in-memory scan over one dictionary's derived data.
// Matching is forgiving (tone marks optional) but results always display the
// dictionary's own text. A production index can replace this module as long
// as it returns the same SearchResult shape.

export type Hit = {
  dict: string;
  entry: EntrySummary;
  /** Present when the match is inside a subentry. */
  sub?: { n: number; term: string; han: string | null; definition: string };
  /** The text shown for this hit and the ranges to highlight in it. */
  field: "headword" | "term" | "definition" | "han";
  text: string;
  ranges: [number, number][];
  score: number;
  /** Headword matched only when tone/vowel marks are ignored. */
  approx?: boolean;
};

export type SearchResult = {
  dict: string;
  query: string;
  mode: "word" | "han";
  headwords: Hit[];
  subentries: Hit[];
  definitions: Hit[];
  totals: { headwords: number; subentries: number; definitions: number };
  /** Subentry matches folded into an exactly matching headword (e.g. the 82 phrases under Nước). */
  inHeadword: { id: string; headword: string; count: number }[];
};

type Indexed = {
  e: Entry;
  hwFold: string;
  hwLower: string;
  defPlain: string;
  defFold: string;
  defLower: string;
  subs: { termFold: string; termLower: string; defPlain: string; defFold: string; defLower: string }[];
};

const indexes = new Map<string, Indexed[]>();

function index(dict: string): Indexed[] {
  let idx = indexes.get(dict);
  if (!idx) {
    idx = getEntries(dict).map((e) => {
      const defPlain = plain(e.definition);
      return {
        e,
        hwFold: fold(e.headword),
        hwLower: lowerNfc(e.headword),
        defPlain,
        defFold: fold(defPlain),
        defLower: lowerNfc(defPlain),
        subs: e.subentries.map((s) => {
          const d = plain(s.definition);
          const term = cleanTerm(s.term);
          return { termFold: fold(term), termLower: lowerNfc(term), defPlain: d, defFold: fold(d), defLower: lowerNfc(d) };
        }),
      };
    });
    indexes.set(dict, idx);
  }
  return idx;
}

/** v024 keeps the printed bar in a few expanded terms ("| Thái A"); it is typographic, not part of the term. */
export function cleanTerm(term: string): string {
  return term.replace(/^\|\s*/, "").trim();
}

const LETTER = /\p{L}/u;

/** Occurrences of q in text as a whole word or word sequence. */
function wordRanges(text: string, q: string, max = 6): [number, number][] {
  const out: [number, number][] = [];
  if (!q) return out;
  let i = text.indexOf(q);
  while (i >= 0 && out.length < max) {
    const before = i === 0 ? "" : text[i - 1];
    const after = text[i + q.length] ?? "";
    if (!LETTER.test(before) && !LETTER.test(after)) out.push([i, i + q.length]);
    i = text.indexOf(q, i + 1);
  }
  return out;
}

function hanRanges(text: string, q: string): [number, number][] {
  const out: [number, number][] = [];
  let i = text.indexOf(q);
  while (i >= 0 && out.length < 6) {
    out.push([i, i + q.length]);
    i = text.indexOf(q, i + q.length);
  }
  return out;
}

/** Trim a long definition around its first match so results stay one or two lines. */
function excerpt(text: string, ranges: [number, number][], width = 140): { text: string; ranges: [number, number][] } {
  if (text.length <= width || !ranges.length) return { text, ranges };
  const [s] = ranges[0];
  const start = Math.max(0, Math.min(s - 40, text.length - width));
  const end = Math.min(text.length, start + width);
  const pre = start > 0 ? "… " : "";
  const post = end < text.length ? " …" : "";
  const shift = pre.length - start;
  return {
    text: pre + text.slice(start, end) + post,
    ranges: ranges.filter(([a, b]) => a >= start && b <= end).map(([a, b]) => [a + shift, b + shift]),
  };
}

export function searchDictionary(dict: string, rawQuery: string, limit = 30): SearchResult {
  const query = rawQuery.normalize("NFC").trim().replace(/\s+/g, " ");
  const result: SearchResult = { dict, query, mode: hasHan(query) ? "han" : "word", headwords: [], subentries: [], definitions: [], totals: { headwords: 0, subentries: 0, definitions: 0 }, inHeadword: [] };
  if (!query) return result;
  const idx = index(dict);

  if (result.mode === "han") {
    const q = [...query].filter((c) => c.trim()).join("");
    for (const x of idx) {
      const e = x.e;
      if (e.han.text && e.han.text.includes(q)) {
        result.headwords.push({ dict, entry: summarize(dict, e), field: "han", text: e.han.text, ranges: hanRanges(e.han.text, q), score: e.han.text === q ? 100 : 80 });
      }
      e.subentries.forEach((s, i) => {
        const han = (s.han ?? "").replace(/\s/g, "");
        if (han.includes(q)) {
          result.subentries.push({ dict, entry: summarize(dict, e), sub: { n: s.n, term: cleanTerm(s.term), han: s.han, definition: x.subs[i].defPlain }, field: "han", text: s.han ?? "", ranges: hanRanges(s.han ?? "", q), score: 50 });
        } else if (x.subs[i].defPlain.includes(q)) {
          const ex = excerpt(x.subs[i].defPlain, hanRanges(x.subs[i].defPlain, q));
          result.definitions.push({ dict, entry: summarize(dict, e), sub: { n: s.n, term: cleanTerm(s.term), han: s.han, definition: x.subs[i].defPlain }, field: "definition", ...ex, score: 10 });
        }
      });
      if (x.defPlain.includes(q)) {
        const ex = excerpt(x.defPlain, hanRanges(x.defPlain, q));
        result.definitions.push({ dict, entry: summarize(dict, e), field: "definition", ...ex, score: 12 });
      }
    }
  } else {
    const qf = fold(query);
    const ql = lowerNfc(query);
    const marked = qf !== ql; // the user typed tone/vowel marks: respect them beyond headwords
    const exactHeadwords = new Set<string>();

    for (const x of idx) {
      const e = x.e;
      // Headwords: tone-insensitive, exact spelling first.
      if (x.hwFold === qf || x.hwFold.startsWith(qf)) {
        const exact = x.hwLower === ql;
        const same = x.hwFold === qf;
        if (exact) exactHeadwords.add(e.id);
        const score = (same ? 80 : 50) + (exact ? 40 : x.hwLower.startsWith(ql) ? 10 : 0) - e.headword.length * 0.1;
        result.headwords.push({ dict, entry: summarize(dict, e), field: "headword", text: e.headword, ranges: [[0, qf.length]], score, approx: marked && !x.hwLower.startsWith(ql) });
      }
    }

    const inHeadword = new Map<string, number>();
    for (const x of idx) {
      const e = x.e;
      e.subentries.forEach((s, i) => {
        const sx = x.subs[i];
        const term = cleanTerm(s.term);
        const ranges = marked ? wordRanges(sx.termLower, ql) : wordRanges(sx.termFold, qf);
        if (ranges.length) {
          if (exactHeadwords.has(e.id) || (!marked && x.hwFold === qf)) {
            inHeadword.set(e.id, (inHeadword.get(e.id) ?? 0) + 1);
            return;
          }
          const starts = ranges[0][0] === 0;
          result.subentries.push({ dict, entry: summarize(dict, e), sub: { n: s.n, term, han: s.han, definition: sx.defPlain }, field: "term", text: term, ranges, score: (starts ? 50 : 40) - term.length * 0.05 });
          return;
        }
        const dr = marked ? wordRanges(sx.defLower, ql) : wordRanges(sx.defFold, qf);
        if (dr.length) {
          const ex = excerpt(sx.defPlain, dr);
          result.definitions.push({ dict, entry: summarize(dict, e), sub: { n: s.n, term, han: s.han, definition: sx.defPlain }, field: "definition", ...ex, score: 10 });
        }
      });
      const dr = marked ? wordRanges(x.defLower, ql) : wordRanges(x.defFold, qf);
      if (dr.length) {
        const ex = excerpt(x.defPlain, dr);
        result.definitions.push({ dict, entry: summarize(dict, e), field: "definition", ...ex, score: 12 });
      }
    }
    result.inHeadword = [...inHeadword.entries()].map(([id, count]) => ({ id, headword: idx.find((x) => x.e.id === id)!.e.headword, count }));
  }

  const byScore = (a: Hit, b: Hit) => b.score - a.score || a.entry.headword.localeCompare(b.entry.headword, "vi");
  result.headwords.sort(byScore);
  result.subentries.sort(byScore);
  result.totals = { headwords: result.headwords.length, subentries: result.subentries.length, definitions: result.definitions.length };
  result.headwords = result.headwords.slice(0, limit);
  result.subentries = result.subentries.slice(0, limit);
  result.definitions = result.definitions.slice(0, limit);
  return result;
}

export function searchAll(query: string, limit = 10): SearchResult[] {
  return availableDictionaries().map((d) => searchDictionary(d.slug, query, limit));
}

/** A short, ranked list for the type-ahead menu. */
export function suggest(dict: string, query: string, limit = 8): Hit[] {
  const r = searchDictionary(dict, query, limit);
  return [...r.headwords, ...r.subentries, ...r.definitions].slice(0, limit);
}
