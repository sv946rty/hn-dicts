"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DICTIONARIES, routes } from "@/platform/registry";
import { T } from "@/platform/strings";

/** Quiet indicator of which dictionary you are in, and the door to the others. */
export function DictionarySwitcher({ current }: { current: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = DICTIONARIES.find((d) => d.slug === current);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm text-ink-2 hover:text-ink"
      >
        <span className="sr-only">Từ điển: </span>
        <span className="truncate">{cur ? cur.shortTitle : T.allDictionaries}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="shrink-0 opacity-60">
          <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      {open ? (
        <div role="menu" className="absolute left-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-rule bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <p className="px-4 pb-1 pt-3 text-xs uppercase tracking-wider text-ink-3">{T.dictionaries}</p>
          <ul>
            {DICTIONARIES.map((d) => (
              <li key={d.slug}>
                {d.status === "available" ? (
                  <Link role="menuitem" href={routes.dictionary(d.slug)} onClick={() => setOpen(false)} className="flex items-baseline gap-3 px-4 py-2.5 hover:bg-bg">
                    <span className="flex-1">
                      <span className="block font-text text-[15px] text-ink">{d.title}</span>
                      <span className="block text-xs text-ink-3">
                        {d.author} · {d.dates}
                      </span>
                    </span>
                    {d.slug === current ? <span className="text-xs text-ink-3">Đang dùng</span> : null}
                  </Link>
                ) : (
                  <span role="menuitem" aria-disabled className="flex items-baseline gap-3 px-4 py-2.5 text-ink-3">
                    <span className="flex-1 font-text text-[15px]">{d.title}</span>
                    <span className="text-xs">{T.comingLater}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex border-t border-rule text-sm">
            <Link href={routes.collection()} onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 text-ink-2 hover:text-ink">
              {T.collection}
            </Link>
            <Link href={routes.searchAll()} onClick={() => setOpen(false)} className="flex-1 border-l border-rule px-4 py-2.5 text-ink-2 hover:text-ink">
              Tra mọi từ điển
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
