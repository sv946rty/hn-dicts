"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WordLookup } from "@/lib/data/search";
import { routes } from "@/platform/registry";
import { hasHan } from "@/platform/text";
import { HanGlyph } from "./Han";

/** A query word as a chip. Hover picks it on devices with a pointer; tap or click picks it everywhere. */
export function WordChip({ label, on, count, onPick }: { label: string; on: boolean; count?: number; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      onMouseEnter={() => {
        if (window.matchMedia("(hover: hover)").matches) onPick();
      }}
      aria-pressed={on}
      className={`inline-flex items-baseline gap-1 rounded-full border px-2.5 py-1 font-text text-[14px] transition-colors ${
        on ? "border-accent bg-accent text-accent-ink" : "border-rule-strong text-ink hover:border-accent"
      }`}
    >
      <span className={hasHan(label) ? "font-han" : undefined}>{label}</span>
      {count != null ? <span className="font-ui text-[11px] tabular-nums opacity-70">{count}</span> : null}
    </button>
  );
}

/**
 * Results page for a multi-word query: one chip per word, and that word's
 * headwords in a dropdown (hover on desktop, tap on phones).
 */
export function WordStrip({ words }: { words: (WordLookup & { href: string })[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open === null) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (words.length < 2) return null;
  const hoverable = () => window.matchMedia("(hover: hover)").matches;

  return (
    <div ref={ref} className="relative mt-4 flex flex-wrap items-center gap-1.5">
      <span className="mr-0.5 text-[13px] text-ink-3">Tra từng chữ:</span>
      {words.map((w, i) => (
        <span
          key={w.word}
          className="sm:relative"
          onMouseEnter={() => {
            if (!hoverable()) return;
            if (timer.current) clearTimeout(timer.current);
            setOpen(i);
          }}
          onMouseLeave={() => {
            if (!hoverable()) return;
            timer.current = setTimeout(() => setOpen((o) => (o === i ? null : o)), 180);
          }}
        >
          <WordChip label={w.word} count={w.total} on={false} onPick={() => setOpen((o) => (hoverable() ? i : o === i ? null : i))} />
          {open === i ? (
            <div className="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-lg border border-rule bg-surface text-left shadow-[0_10px_30px_rgba(0,0,0,0.1)] sm:right-auto sm:w-80">
              <p className="border-b border-rule px-3 py-2 text-[12px] uppercase tracking-wider text-ink-3">
                Mục từ “{w.word}” · {w.total}
              </p>
              {w.hits.length ? (
                <ul className="max-h-80 overflow-auto py-1">
                  {w.hits.map((h) => (
                    <li key={h.entry.id}>
                      <Link href={routes.entry(h.dict, h.entry.id)} className="flex items-baseline gap-3 px-3 py-2 hover:bg-accent-soft">
                        <span className="w-7 shrink-0 text-center">
                          <HanGlyph han={h.entry.han} size="sm" interactive={false} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="font-text text-[15px] font-semibold text-ink">{h.entry.headword}</span>
                          {h.entry.type ? <span className="ml-1.5 font-text text-[13px] italic text-ink-3">{h.entry.type}</span> : null}
                          {h.approx ? <span className="ml-1.5 text-[11px] text-ink-3">khác dấu</span> : null}
                          <span className="block truncate font-text text-[13.5px] text-ink-2">{h.entry.gloss}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-3 text-[13.5px] text-ink-3">Không có mục từ “{w.word}”.</p>
              )}
              <Link href={w.href} className="block border-t border-rule px-3 py-2 text-[13px] text-accent hover:underline">
                Tra riêng “{w.word}” →
              </Link>
            </div>
          ) : null}
        </span>
      ))}
    </div>
  );
}
