import type { Metadata } from "next";
import { Suspense } from "react";
import { searchAll } from "@/lib/data/search";
import { SearchBox } from "@/platform/components/SearchBox";
import { SearchResults } from "@/platform/components/SearchResults";
import { DICTIONARIES, routes } from "@/platform/registry";
import { T } from "@/platform/strings";

export const metadata: Metadata = { title: "Tra mọi từ điển" };

// Platform-wide search. Results are grouped by dictionary, so a second
// dictionary simply adds a section; nothing here assumes there is only one.
export default async function SearchAllPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const results = q ? searchAll(q, 8) : [];
  const planned = DICTIONARIES.filter((d) => d.status === "planned");

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
      <h1 className="mb-4 text-[12px] font-medium uppercase tracking-wider text-ink-3">{T.allDictionaries}</h1>
      <div className="hidden md:block">
        <Suspense>
          <SearchBox dict={null} autoFocus={!q} />
        </Suspense>
      </div>
      <div className="mt-6 space-y-12">
        {results.map((r) => (
          <SearchResults key={r.dict} result={r} showDictionary more={() => routes.search(r.dict, q)} />
        ))}
      </div>
      {q ? (
        <p className="mt-12 border-t border-rule pt-4 text-[13px] text-ink-3">
          Hiện chỉ có một từ điển trong bộ sưu tập. {planned.map((d) => d.title).join(", ")}: {T.comingLater.toLowerCase()}.
        </p>
      ) : null}
    </main>
  );
}
