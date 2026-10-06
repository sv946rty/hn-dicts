// Dictionary-specific presentation for Đại Nam Quấc Âm Tự Vị. Everything here
// is taken from the 2026 digital reference edition's front matter or v024.

/** Grammatical marks, from "Dấu riêng" (p. 5 of the 2026 edition, after the Tiểu tự). */
export const MARKS: { mark: string; meaning: string }[] = [
  { mark: "c.", meaning: "Chữ nho" },
  { mark: "n.", meaning: "Chữ nôm" },
  { mark: "cn.", meaning: "Chữ nho mà có dùng nôm." },
  { mark: "|", meaning: "Thế vì chữ mình đang giải nghĩa." },
  { mark: "—", meaning: "Thế vì chữ nho id." },
  { mark: "id", meaning: "Như nhau, đồng nghĩa trước." },
  { mark: "=", meaning: "Bằng nhau." },
];

/** Meaning of an entry's type mark. The printed mark itself is always shown unchanged. */
export function typeMeaning(type: string | null): string | null {
  if (!type) return null;
  const key = type.toLowerCase().replace(/[\s,.]/g, "");
  if (key === "c") return "Chữ nho";
  if (key === "n") return "Chữ nôm";
  if (key === "cn" || key === "nc") return "Chữ nho mà có dùng nôm";
  return null;
}

/** Real headwords used as starting points on the dictionary home. */
export const EXAMPLES: { q: string; note: string }[] = [
  { q: "nước", note: "82 từ ngữ" },
  { q: "lòng", note: "117 từ ngữ" },
  { q: "thờ", note: "chữ nôm 𰨂" },
  { q: "bấm", note: "chữ giữ bằng hình" },
  { q: "學", note: "tra bằng chữ Hán" },
];

/** Pages of the 2026 edition for which this prototype ships a page preview. */
export const PAGE_PREVIEWS = new Set<number>([11, 16, 20, 30, 31, 54, 137, 145, 259, 378, 503, 620, 622, 667, 870, 942]);

export const EDITION = {
  title: "Đại Nam Quấc Âm Tự Vị (Bản điện tử tham khảo 2026)",
  pages: 1038,
};
