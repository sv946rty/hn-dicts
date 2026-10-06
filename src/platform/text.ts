// Text utilities shared by server and client. Folding is for FINDING words
// only; nothing here is ever used to change what the dictionary displays.

/** Lower-case and strip Vietnamese tone/vowel marks, one output char per input char. */
export function fold(s: string): string {
  let out = "";
  for (const ch of s.normalize("NFC")) {
    if (ch === "đ" || ch === "Đ") {
      out += "d";
      continue;
    }
    const base = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
    // Keep a 1:1 mapping of code units so match offsets can be reused on the original text.
    const lower = (base[0] ?? ch).toLowerCase();
    out += lower.length === ch.length ? lower : ch.toLowerCase().slice(0, ch.length).padEnd(ch.length, " ");
  }
  return out;
}

export function lowerNfc(s: string): string {
  return s.normalize("NFC").toLowerCase();
}

const HAN_CHAR = /[⺀-⿿々-〇㐀-䶿一-鿿豈-﫿-\u{20000}-\u{3FFFF}\u{F0000}-\u{10FFFF}]/u;

export function isHanChar(ch: string): boolean {
  return HAN_CHAR.test(ch);
}

export function hasHan(s: string): boolean {
  for (const ch of s) if (isHanChar(ch)) return true;
  return false;
}

/** Private-use code points render only with the project's Nôm font and have no shared identity. */
export function isPrivateUse(ch: string): boolean {
  const o = ch.codePointAt(0) ?? 0;
  return (o >= 0xe000 && o <= 0xf8ff) || o >= 0xf0000;
}

/** A character that can have a platform-level character page. */
export function isLinkableHan(ch: string): boolean {
  const o = ch.codePointAt(0) ?? 0;
  if (isPrivateUse(ch)) return false;
  if (o >= 0x2e80 && o <= 0x2fff) return false;
  return isHanChar(ch);
}

export function codePoint(ch: string): string {
  return `U+${(ch.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;
}

export function charFromCodePoint(cp: string): string | null {
  const m = /^U\+([0-9A-F]{4,6})$/i.exec(decodeURIComponent(cp));
  if (!m) return null;
  return String.fromCodePoint(parseInt(m[1], 16));
}

export type Segment = { text: string; han: boolean };

/** Split text into Hán/Nôm and non-Hán runs (spaces between Hán chars stay in the Hán run). */
export function segmentHan(s: string): Segment[] {
  const out: Segment[] = [];
  for (const ch of s) {
    const han = isHanChar(ch);
    const last = out[out.length - 1];
    if (last && (last.han === han || (last.han && ch === " "))) last.text += ch;
    else out.push({ text: ch, han });
  }
  // Trailing spaces captured inside a Hán run belong to the following text.
  for (let i = 0; i < out.length; i++) {
    const seg = out[i];
    if (seg.han && seg.text.endsWith(" ")) {
      const trimmed = seg.text.trimEnd();
      const spaces = seg.text.slice(trimmed.length);
      seg.text = trimmed;
      if (out[i + 1]) out[i + 1].text = spaces + out[i + 1].text;
      else out.push({ text: spaces, han: false });
    }
  }
  return out;
}

/** Ranges [start, end) where `query` (folded) occurs in `text` (folded). */
export function matchRanges(text: string, query: string): [number, number][] {
  const q = fold(query.trim());
  if (!q) return [];
  const t = fold(text);
  const out: [number, number][] = [];
  let i = t.indexOf(q);
  while (i >= 0 && out.length < 20) {
    out.push([i, i + q.length]);
    i = t.indexOf(q, i + q.length);
  }
  return out;
}
