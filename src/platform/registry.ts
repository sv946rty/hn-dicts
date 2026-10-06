// The dictionary collection. Adding a dictionary means adding a descriptor
// here and a data module under src/lib/data; routes, search and the shell are
// shared. Planned dictionaries carry a name only: no data, dates or claims.

export type DictionaryDescriptor = {
  slug: string;
  status: "available" | "planned";
  /** Title in its historical orthography, exactly as the work prints it. */
  title: string;
  titleHan?: string;
  /** Short label for tight spaces (switcher, result groups). */
  shortTitle: string;
  author?: string;
  dates?: string;
  /** Theme key applied as data-dict on dictionary pages. */
  theme?: string;
  /** Alphabet used for browsing, in the work's own order. */
  letters?: string[];
};

export const DICTIONARIES: DictionaryDescriptor[] = [
  {
    slug: "dnqatv",
    status: "available",
    title: "Đại Nam Quấc Âm Tự Vị",
    titleHan: "大南國音字彙",
    shortTitle: "Đại Nam Quấc Âm Tự Vị",
    author: "Huình-Tịnh Paulus Của",
    dates: "1895–1896",
    theme: "dnqatv",
    letters: ["A", "B", "C", "D", "Đ", "E", "G", "H", "Y", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X"],
  },
  {
    slug: "taberd",
    status: "planned",
    title: "Từ Điển Taberd",
    shortTitle: "Từ Điển Taberd",
  },
];

export const DEFAULT_DICTIONARY = "dnqatv";

export function getDictionaryDescriptor(slug: string): DictionaryDescriptor | undefined {
  return DICTIONARIES.find((d) => d.slug === slug);
}

export function availableDictionaries(): DictionaryDescriptor[] {
  return DICTIONARIES.filter((d) => d.status === "available");
}

// Stable URL builders: every page is addressable, and every dictionary URL
// names its dictionary, so a second dictionary never collides with the first.
export const routes = {
  home: () => "/",
  collection: () => "/dictionaries",
  dictionary: (d: string) => `/dictionaries/${d}`,
  entry: (d: string, id: string, sub?: number) => `/dictionaries/${d}/entries/${encodeURIComponent(id)}${sub ? `#s${sub}` : ""}`,
  browse: (d: string, letter?: string) => (letter ? `/dictionaries/${d}/browse/${encodeURIComponent(letter)}` : `/dictionaries/${d}/browse`),
  search: (d: string, q?: string) => `/dictionaries/${d}/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
  searchAll: (q?: string) => `/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
  about: (d: string) => `/dictionaries/${d}/about`,
  characters: () => "/characters",
  radical: (kxrn: number) => `/characters?radical=${kxrn}`,
  character: (cp: string) => `/characters/${cp}`,
};
