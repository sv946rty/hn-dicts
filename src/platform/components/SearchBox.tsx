"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { routes } from "@/platform/registry";
import { T } from "@/platform/strings";
import type { Hit } from "@/lib/data/search";
import { HanGlyph, Highlight } from "./Han";

/**
 * Type-ahead search. Enter opens the full results page; arrow keys move through
 * suggestions; "/" focuses the box from anywhere. Scope is the current
 * dictionary, or all dictionaries outside one.
 */
export function SearchBox({ dict, compact = false, autoFocus = false }: { dict: string | null; compact?: boolean; autoFocus?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(() => params.get("q") ?? "");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const query = q.trim();
    if (!query) return;
    const ctl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?dict=${encodeURIComponent(dict ?? "")}&q=${encodeURIComponent(query)}&limit=8`, { signal: ctl.signal })
        .then((r) => r.json())
        .then((r: { hits: Hit[] }) => {
          setHits(r.hits);
          setActive(-1);
        })
        .catch(() => {});
    }, 90);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [q, dict]);

  const shown = q.trim() ? hits : [];
  const go = (href: string) => {
    setOpen(false);
    input.current?.blur();
    router.push(href);
  };
  const submit = () => {
    const query = q.trim();
    if (!query) return;
    if (active >= 0 && shown[active]) return go(hitHref(shown[active]));
    go(dict ? routes.search(dict, query) : routes.searchAll(query));
  };

  return (
    <div className={`relative w-full ${compact ? "max-w-md" : ""}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="sr-only" htmlFor={`${listId}-input`}>
          {T.searchLabel}
        </label>
        <div
          className={`flex items-center gap-2 border border-rule-strong bg-surface transition-colors focus-within:border-accent ${
            compact ? "h-10 rounded-lg px-3" : "h-14 rounded-xl px-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:h-16 sm:px-5"
          }`}
        >
          <svg width={compact ? 16 : 20} height={compact ? 16 : 20} viewBox="0 0 20 20" aria-hidden className="shrink-0 text-ink-3">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id={`${listId}-input`}
            ref={input}
            value={q}
            autoFocus={autoFocus}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setActive((a) => Math.min(a + 1, shown.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, -1));
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder={dict ? T.searchPlaceholder : T.searchPlaceholderAll}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
            role="combobox"
            aria-expanded={open && shown.length > 0}
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            className={`min-w-0 flex-1 bg-transparent font-text text-ink outline-none placeholder:text-ink-3 ${compact ? "text-[15px]" : "text-lg sm:text-xl"}`}
          />
          {q ? (
            <button type="button" aria-label="Xoá" onMouseDown={(e) => e.preventDefault()} onClick={() => (setQ(""), input.current?.focus())} className="rounded p-1 text-ink-3 hover:text-ink">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          ) : compact ? (
            <kbd className="hidden rounded border border-rule px-1.5 text-xs text-ink-3 lg:inline">/</kbd>
          ) : null}
        </div>
      </form>
      {open && shown.length > 0 ? (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[70vh] overflow-auto rounded-lg border border-rule bg-surface py-1 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          {shown.map((h, i) => (
            <li
              key={`${h.entry.id}-${h.sub?.n ?? 0}-${h.field}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(hitHref(h))}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-baseline gap-3 px-3 py-2 ${i === active ? "bg-accent-soft" : ""}`}
            >
              <span className="w-8 shrink-0 text-center">
                <HanGlyph han={h.sub?.han ? { status: "unicode", text: h.sub.han, image: null } : h.entry.han} size="sm" interactive={false} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-text text-[15px] text-ink">
                  {h.sub ? (
                    <>
                      <Highlight text={h.sub.term} ranges={h.field === "term" ? h.ranges : []} />
                    </>
                  ) : (
                    <Highlight text={h.entry.headword} ranges={h.field === "headword" ? h.ranges : []} />
                  )}
                </span>
                {h.entry.type && !h.sub ? <span className="ml-1.5 font-text text-sm italic text-ink-3">{h.entry.type}</span> : null}
                <span className="block truncate text-[13px] text-ink-3">
                  {h.sub ? <span className="mr-1">trong {h.entry.headword} ·</span> : null}
                  {h.field === "definition" ? <Highlight text={h.text} ranges={h.ranges} /> : h.sub ? h.sub.definition : h.entry.gloss}
                </span>
              </span>
            </li>
          ))}
          <li className="border-t border-rule px-3 py-2 text-[13px] text-ink-3">
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={submit} className="hover:text-ink">
              Xem mọi kết quả cho “{q.trim()}” ↵
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export function hitHref(h: Hit): string {
  return routes.entry(h.dict, h.entry.id, h.sub?.n);
}
