"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { routes } from "@/platform/registry";
import { T } from "@/platform/strings";

// "Recently viewed" lives in this browser only (no accounts in V1). The same
// record shape — dictionary + entry id — is what a native app would sync later.

export type RecentItem = { dict: string; id: string; headword: string; han: string | null; at: number };
const KEY = "hn-dicts:recent";

export function readRecent(): RecentItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as RecentItem[];
  } catch {
    return [];
  }
}

export function rememberEntry(item: Omit<RecentItem, "at">) {
  try {
    const list = readRecent().filter((r) => !(r.dict === item.dict && r.id === item.id));
    list.unshift({ ...item, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 12)));
  } catch {
    /* storage unavailable: nothing to remember */
  }
}

export function RememberEntry(props: Omit<RecentItem, "at">) {
  const { dict, id, headword, han } = props;
  useEffect(() => rememberEntry({ dict, id, headword, han }), [dict, id, headword, han]);
  return null;
}

export function RecentEntries() {
  const [items, setItems] = useState<RecentItem[]>([]);
  useEffect(() => {
    // Read after mount: localStorage is not available during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readRecent());
  }, []);
  if (!items.length) return null;
  return (
    <div className="mt-8">
      <h2 className="text-xs uppercase tracking-wider text-ink-3">{T.recent}</h2>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {items.map((r) => (
          <li key={`${r.dict}:${r.id}`}>
            <Link href={routes.entry(r.dict, r.id)} className="font-text text-[15px] text-ink hover:text-accent">
              {r.han ? (
                <span className="mr-1 font-han text-han" lang="zh-Hant">
                  {r.han}
                </span>
              ) : null}
              {r.headword}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
