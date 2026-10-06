import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CharacterRecord, DictionaryStats, Entry, EntrySummary, Rich } from "./types";

// Data access for the prototype: derived JSON (see scripts/build-data.mjs)
// loaded once per server process. The function signatures are what the UI
// depends on, so this file can later be backed by a database or search
// service without touching any page.

const GENERATED = join(process.cwd(), "data/generated");

type Loaded = { stats: DictionaryStats; entries: Entry[]; byId: Map<string, Entry>; byLetter: Map<string, Entry[]> };

const cache = new Map<string, Loaded>();

function load(dict: string): Loaded | null {
  if (dict !== "dnqatv") return null;
  let l = cache.get(dict);
  if (!l) {
    const stats = JSON.parse(readFileSync(join(GENERATED, dict, "dictionary.json"), "utf8")) as DictionaryStats;
    const entries = JSON.parse(readFileSync(join(GENERATED, dict, "entries.json"), "utf8")) as Entry[];
    const byId = new Map(entries.map((e) => [e.id, e]));
    const byLetter = new Map<string, Entry[]>();
    for (const e of entries) {
      const list = byLetter.get(e.letter) ?? [];
      list.push(e);
      byLetter.set(e.letter, list);
    }
    l = { stats, entries, byId, byLetter };
    cache.set(dict, l);
  }
  return l;
}

export function plain(rich: Rich): string {
  return rich.map((r) => r.t).join("");
}

export function summarize(dict: string, e: Entry): EntrySummary {
  const firstSub = e.subentries[0];
  return {
    dict,
    id: e.id,
    headword: e.headword,
    readingNote: e.readingNote,
    type: e.type,
    han: { status: e.han.status, text: e.han.text, image: e.han.image },
    gloss: plain(e.definition) || (firstSub ? `${firstSub.term}. ${plain(firstSub.definition)}` : ""),
    subentryCount: e.subentries.length,
  };
}

export function getStats(dict: string): DictionaryStats | null {
  return load(dict)?.stats ?? null;
}

export function getEntries(dict: string): Entry[] {
  return load(dict)?.entries ?? [];
}

export function getEntry(dict: string, id: string): Entry | null {
  return load(dict)?.byId.get(id.normalize("NFC")) ?? null;
}

export function getLetter(dict: string, letter: string): EntrySummary[] {
  return (load(dict)?.byLetter.get(letter.normalize("NFC")) ?? []).map((e) => summarize(dict, e));
}

export function getNeighbours(dict: string, id: string, radius = 8): { list: EntrySummary[]; prev: EntrySummary | null; next: EntrySummary | null } {
  const l = load(dict);
  const e = l?.byId.get(id);
  if (!l || !e) return { list: [], prev: null, next: null };
  const from = Math.max(0, e.order - radius);
  const to = Math.min(l.entries.length, e.order + radius + 1);
  return {
    list: l.entries.slice(from, to).map((x) => summarize(dict, x)),
    prev: e.order > 0 ? summarize(dict, l.entries[e.order - 1]) : null,
    next: e.order < l.entries.length - 1 ? summarize(dict, l.entries[e.order + 1]) : null,
  };
}

// --- characters (platform level) ---------------------------------------------

type CharIndex = { characters: Record<string, Omit<CharacterRecord, "cp">>; radicals: { kxrn: number; radical: string; chars: [string, number | null][] }[] };
let chars: CharIndex | null = null;

function loadChars(): CharIndex {
  if (!chars) chars = JSON.parse(readFileSync(join(GENERATED, "characters.json"), "utf8")) as CharIndex;
  return chars;
}

export function getCharacter(cp: string): CharacterRecord | null {
  const key = cp.toUpperCase().replace(/^U\+/, "U+");
  const r = loadChars().characters[key];
  return r ? { cp: key, ...r } : null;
}

export function hasCharacter(cp: string): boolean {
  return cp in loadChars().characters;
}

export function getRadicals() {
  return loadChars().radicals;
}
