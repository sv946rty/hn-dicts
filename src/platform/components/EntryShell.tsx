"use client";

import { useCallback, useEffect, useState } from "react";
import type { CharacterView } from "@/lib/data/characters";
import type { HanForm } from "@/lib/data/types";
import { T } from "@/platform/strings";
import { CharacterDetails, UnmappedHanDetails } from "./CharacterDetails";
import { Sheet } from "./Sheet";
import { SourcePanel, type SourceInfo } from "./SourcePanel";

/**
 * Layout and secondary tools around an entry.
 *
 * Desktop: the entry reads in the centre; the right column holds the selected
 * character and the source, and neighbouring entries sit on the left.
 * Phone: one column; character and source open as sheets.
 *
 * Any element with data-han-char inside the page selects that character here
 * (plain links to the character page still work without JavaScript or with a
 * modifier key).
 */
export function EntryShell({
  han,
  initialChar,
  source,
  left,
  crumbs,
  children,
}: {
  crumbs: React.ReactNode;
  han: HanForm;
  initialChar: CharacterView | null;
  source: SourceInfo;
  left: React.ReactNode;
  children: React.ReactNode;
}) {
  const [char, setChar] = useState<CharacterView | null>(initialChar);
  const [sheet, setSheet] = useState<null | "char" | "source">(null);
  const [print, setPrint] = useState(false);

  const select = useCallback(async (ch: string) => {
    const cp = `U+${(ch.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;
    const res = await fetch(`/api/characters/${cp}`);
    if (!res.ok) return false;
    setChar((await res.json()) as CharacterView);
    return true;
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-han-char]");
      if (!el || !el.closest("[data-entry-shell]")) return;
      // Capture phase: runs before Next's <Link> so the panel opens instead of navigating.
      e.preventDefault();
      e.stopPropagation();
      const ch = el.dataset.hanChar!;
      select(ch).then((ok) => {
        if (!ok) window.location.href = (el as HTMLAnchorElement).href;
        else if (!window.matchMedia("(min-width: 1024px)").matches) setSheet("char");
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [select]);

  const showingHeadword = char?.record.char === initialChar?.record.char;
  const charPanel = char ? (
    <>
      {!showingHeadword && initialChar ? (
        <button type="button" onClick={() => setChar(initialChar)} className="mb-3 text-[12.5px] text-ink-3 hover:text-ink">
          ← chữ đầu mục <span className="font-han text-han">{initialChar.record.char}</span>
        </button>
      ) : !showingHeadword && !initialChar ? (
        <button type="button" onClick={() => setChar(null)} className="mb-3 text-[12.5px] text-ink-3 hover:text-ink">
          ← chữ đầu mục
        </button>
      ) : null}
      <CharacterDetails view={char} compact />
    </>
  ) : han.status === "pua" || han.status === "image_only" ? (
    <UnmappedHanDetails han={han} />
  ) : (
    <p className="text-[13px] text-ink-3">Mục này không ghi chữ Hán/Nôm.</p>
  );

  return (
    <div data-entry-shell="" data-print={print ? "1" : "0"} className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-x-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[200px_minmax(0,1fr)_300px]">
      <aside className="hidden pt-10 xl:block">{left}</aside>

      <div className="min-w-0">
        <div className="mx-auto max-w-[44rem]">
          <EntryTools
            crumbs={crumbs}
            print={print}
            setPrint={setPrint}
            onChar={han.status ? () => setSheet("char") : undefined}
            onSource={() => setSheet("source")}
            hanLabel={han.status === "image_only" ? "hình" : han.text}
          />
          {children}
        </div>
      </div>

      <aside className="hidden pt-10 lg:block">
        <div className="sticky top-20 space-y-8">
          <section aria-labelledby="char-h">
            <h2 id="char-h" className="mb-3 text-[12px] font-medium uppercase tracking-wider text-ink-3">
              {T.characterDetails}
            </h2>
            {charPanel}
          </section>
          <section aria-labelledby="src-h" className="border-t border-rule-strong pt-5">
            <h2 id="src-h" className="mb-3 text-[12px] font-medium uppercase tracking-wider text-ink-3">
              {T.sourceTitle}
            </h2>
            <SourcePanel info={source} />
          </section>
        </div>
      </aside>

      <Sheet open={sheet === "char"} onClose={() => setSheet(null)} title={T.characterDetails}>
        {charPanel}
      </Sheet>
      <Sheet open={sheet === "source"} onClose={() => setSheet(null)} title={T.sourceTitle}>
        <SourcePanel info={source} />
      </Sheet>
    </div>
  );
}

function EntryTools({
  crumbs,
  print,
  setPrint,
  onChar,
  onSource,
  hanLabel,
}: {
  crumbs: React.ReactNode;
  print: boolean;
  setPrint: (v: boolean) => void;
  onChar?: () => void;
  onSource: () => void;
  hanLabel: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 whitespace-nowrap pt-3 text-[13px] text-ink-2 lg:flex-nowrap lg:pt-8">
      <div className="mr-auto w-full min-w-0 truncate pb-1 lg:w-auto lg:pb-0">{crumbs}</div>
      {onChar ? (
        <button type="button" onClick={onChar} className="-ml-2.5 rounded-md px-2.5 py-2 hover:bg-accent-soft lg:hidden">
          Chữ {hanLabel ? <span className="font-han text-han">{hanLabel}</span> : null}
        </button>
      ) : null}
      <button type="button" onClick={onSource} className="rounded-md px-2.5 py-2 hover:bg-accent-soft lg:hidden">
        {T.source}
      </button>
      <label className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 hover:bg-accent-soft" title={T.printFormHint}>
        <input type="checkbox" checked={print} onChange={(e) => setPrint(e.target.checked)} className="h-3.5 w-3.5 accent-[var(--accent)]" />
        {T.printForm}
      </label>
    </div>
  );
}
