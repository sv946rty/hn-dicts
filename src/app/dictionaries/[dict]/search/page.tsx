import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { searchDictionary } from "@/lib/data/search";
import { SearchBox } from "@/platform/components/SearchBox";
import { SearchResults } from "@/platform/components/SearchResults";
import { getDictionaryDescriptor, routes } from "@/platform/registry";
import { T } from "@/platform/strings";

type Props = PageProps<"/dictionaries/[dict]/search">;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = (await searchParams).q;
  return { title: typeof q === "string" && q ? `“${q}”` : "Tra từ" };
}

const nf = new Intl.NumberFormat("vi-VN");

export default async function SearchPage({ params, searchParams }: Props) {
  const { dict } = await params;
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const show = typeof sp.show === "string" ? sp.show : null;
  const d = getDictionaryDescriptor(dict)!;
  const result = searchDictionary(dict, q, show ? 500 : 25);
  const total = result.totals.headwords + result.totals.subentries + result.totals.definitions;

  if (show && show in result.totals) {
    // "See all" for one group: drop the others so the list is about one thing.
    for (const k of ["headwords", "subentries", "definitions"] as const) if (k !== show) result[k] = [];
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
      <div className="md:hidden" />
      <div className="hidden md:block">
        <Suspense>
          <SearchBox dict={dict} autoFocus={!q} />
        </Suspense>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-3">
        <p className="text-[14px] text-ink-2">
          {q ? (
            <>
              {nf.format(total)} {T.results} cho <span className="font-text text-ink">“{result.query}”</span> {T.searchIn} <span className="font-text italic">{d.title}</span>
            </>
          ) : (
            <>Gõ một từ để tra trong {d.title}.</>
          )}
        </p>
        {q ? (
          <p className="text-[13px] text-ink-3">
            <span className="mr-2">Tìm trong:</span>
            <span className="mr-2 font-medium text-ink-2">{T.thisDictionary}</span>
            <Link href={routes.searchAll(q)} className="underline decoration-rule-strong underline-offset-2 hover:text-ink">
              {T.allDictionaries}
            </Link>
          </p>
        ) : null}
      </div>
      {show ? (
        <p className="mt-3 text-[13px]">
          <Link href={routes.search(dict, q)} className="text-accent hover:underline">
            ← Mọi nhóm kết quả
          </Link>
        </p>
      ) : null}
      {q ? <SearchResults result={result} more={(g) => `${routes.search(dict, q)}&show=${g}`} /> : null}
    </main>
  );
}
