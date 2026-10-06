import "server-only";
import { getDictionaryDescriptor } from "@/platform/registry";
import { getCharacter, getEntry, hasCharacter, summarize } from "./dictionaries";
import type { CharacterRecord, EntrySummary } from "./types";

export type CharacterView = {
  record: CharacterRecord;
  /** Components that have their own character page. */
  linkable: Record<string, string>;
  /** Per dictionary, the entries where the character is the headword's Hán/Nôm. */
  headwordEntries: { dict: string; title: string; entries: EntrySummary[] }[];
};

export function characterView(cp: string, limit = 12): CharacterView | null {
  const record = getCharacter(cp);
  if (!record) return null;
  const linkable: Record<string, string> = {};
  for (const c of record.metadata?.components ?? []) {
    const key = `U+${(c.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;
    if (hasCharacter(key)) linkable[c] = key;
  }
  const headwordEntries = Object.entries(record.occurrences).map(([dict, occ]) => ({
    dict,
    title: getDictionaryDescriptor(dict)?.title ?? dict,
    entries: occ.headwords
      .slice(0, limit)
      .map((id) => getEntry(dict, id))
      .filter((e) => e !== null)
      .map((e) => summarize(dict, e)),
  }));
  return { record, linkable, headwordEntries };
}
