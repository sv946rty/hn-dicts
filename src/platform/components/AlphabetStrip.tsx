import Link from "next/link";
import { routes } from "@/platform/registry";

/**
 * The dictionary's alphabet in its own order. Horizontally scrollable on
 * phones, a single row on wider screens; the current letter is marked.
 */
export function AlphabetStrip({
  dict,
  letters,
  current,
  sticky = false,
  wrap = false,
}: {
  wrap?: boolean;
  dict: string;
  letters: { letter: string; entries: number }[];
  current?: string;
  sticky?: boolean;
}) {
  return (
    <nav aria-label="Chữ cái" className={sticky ? "sticky top-14 z-30 -mx-4 border-b border-rule bg-bg/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 max-md:top-[6.75rem]" : ""}>
      <ol className={`-mx-1 py-2 ${wrap ? "grid grid-cols-11 gap-0.5 sm:flex sm:justify-between" : "scrollbar-none flex snap-x gap-0.5 overflow-x-auto sm:flex-wrap sm:justify-between sm:overflow-visible"}`}>
        {letters.map((l) => {
          const active = l.letter === current;
          return (
            <li key={l.letter} className="snap-start">
              <Link
                href={routes.browse(dict, l.letter)}
                aria-current={active ? "page" : undefined}
                title={`${l.letter}: ${l.entries} mục từ`}
                className={`flex h-11 ${wrap ? "" : "min-w-11"} flex-col items-center justify-center rounded-md px-1.5 font-text text-[17px] leading-none transition-colors sm:h-12 sm:min-w-9 ${
                  active ? "bg-accent text-accent-ink" : "text-ink hover:bg-accent-soft"
                }`}
              >
                {l.letter}
                <span className={`mt-1 font-ui text-[9.5px] tabular-nums leading-none ${active ? "text-accent-ink/80" : "text-ink-3"}`}>{l.entries}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
