"use client";

import { useEffect, useState } from "react";
import { fold } from "@/platform/text";

/** Narrow the current letter's list as you type (tone marks optional). */
export function LetterFilter({ letter }: { letter: string }) {
  const [q, setQ] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const list = document.querySelector("[data-letter-list]");
    if (!list) return;
    const needle = fold(q.trim());
    let shown = 0;
    list.querySelectorAll<HTMLElement>("li[data-fold]").forEach((li) => {
      const hit = !needle || li.dataset.fold!.includes(needle);
      li.hidden = !hit;
      if (hit) shown++;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(needle ? shown : null);
  }, [q]);

  return (
    <div className="w-full sm:w-64">
      <label className="sr-only" htmlFor="letter-filter">
        Lọc trong chữ {letter}
      </label>
      <input
        id="letter-filter"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Lọc trong chữ ${letter}…`}
        autoComplete="off"
        spellCheck={false}
        className="h-10 w-full rounded-lg border border-rule-strong bg-surface px-3 font-text text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-accent"
      />
      <p className="mt-1 h-4 text-[12px] text-ink-3" aria-live="polite">
        {count !== null ? `${count} mục` : ""}
      </p>
    </div>
  );
}
