import Link from "next/link";
import type { Hit, SearchResult } from "@/lib/data/search";
import { getDictionaryDescriptor, routes } from "@/platform/registry";
import { T } from "@/platform/strings";
import { HanGlyph, Highlight } from "./Han";

const nf = new Intl.NumberFormat("vi-VN");

/** One dictionary's results, grouped by where the query matched. */
export function SearchResults({ result, more, showDictionary = false }: { result: SearchResult; more?: (group: string) => string; showDictionary?: boolean }) {
  const d = getDictionaryDescriptor(result.dict)!;
  const total = result.totals.headwords + result.totals.subentries + result.totals.definitions;
  const groups: { key: keyof SearchResult["totals"]; label: string; hits: Hit[] }[] = [
    { key: "headwords", label: T.headwords, hits: result.headwords },
    { key: "subentries", label: T.inSubentries, hits: result.subentries },
    { key: "definitions", label: T.inDefinitions, hits: result.definitions },
  ];

  return (
    <section aria-label={d.title}>
      {showDictionary ? (
        <h2 className="flex items-baseline justify-between border-b border-rule-strong pb-2">
          <Link href={routes.search(d.slug, result.query)} className="font-text text-[18px] font-semibold text-ink hover:text-accent">
            {d.title}
          </Link>
          <span className="text-[13px] text-ink-3">
            {d.author} · {d.dates}
          </span>
        </h2>
      ) : null}

      {total === 0 ? (
        <p className="mt-6 font-text text-[17px] text-ink-2">
          {T.noResults} “{result.query}”.{" "}
          <span className="text-ink-3">Thử bỏ dấu, gõ ít chữ hơn, hoặc duyệt theo chữ cái.</span>
        </p>
      ) : null}

      {result.inHeadword.length ? (
        <p className="mt-4 text-[13.5px] text-ink-3">
          {result.inHeadword.map((h, i) => (
            <span key={h.id}>
              {i > 0 ? "; " : ""}
              {nf.format(h.count)} từ ngữ có “{result.query}” nằm trong mục{" "}
              <Link href={routes.entry(result.dict, h.id)} className="text-ink-2 underline decoration-rule-strong underline-offset-2 hover:text-accent">
                {h.headword}
              </Link>
            </span>
          ))}
          .
        </p>
      ) : null}

      {groups.map((g) =>
        g.hits.length ? (
          <div key={g.key} className="mt-7">
            <h3 className="flex items-baseline gap-2 text-[12px] font-medium uppercase tracking-wider text-ink-3">
              {g.label}
              <span className="font-normal tabular-nums">{nf.format(result.totals[g.key])}</span>
            </h3>
            <ol className="mt-1.5">
              {g.hits.map((h) => (
                <ResultRow key={`${h.entry.id}-${h.sub?.n ?? 0}-${h.field}`} hit={h} />
              ))}
            </ol>
            {more && result.totals[g.key] > g.hits.length ? (
              <Link href={more(g.key)} className="mt-2 inline-block text-[13.5px] text-accent hover:underline">
                Xem tất cả {nf.format(result.totals[g.key])} →
              </Link>
            ) : null}
          </div>
        ) : null,
      )}
    </section>
  );
}

function ResultRow({ hit: h }: { hit: Hit }) {
  const han = h.sub ? (h.sub.han ? { status: "unicode" as const, text: h.sub.han, image: null } : null) : h.entry.han;
  return (
    <li className="border-b border-rule last:border-b-0">
      <Link href={routes.entry(h.dict, h.entry.id, h.sub?.n)} className="group grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 py-3 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-4">
        <span className="pt-0.5 text-right text-[19px]">{han ? <HanGlyph han={han} size="sm" interactive={false} /> : null}</span>
        <span className="min-w-0">
          <span className="font-text text-[17.5px] text-ink group-hover:text-accent">
            {h.sub ? (
              <span className="font-semibold">
                <Highlight text={h.sub.term} ranges={h.field === "term" ? h.ranges : []} />
              </span>
            ) : (
              <>
                <span className="font-semibold">
                  <Highlight text={h.entry.headword} ranges={h.field === "headword" ? h.ranges : []} />
                </span>
                {h.entry.type ? <span className="ml-1.5 text-[14px] italic text-ink-3">{h.entry.type}</span> : null}
                {h.entry.readingNote ? <span className="ml-1.5 text-[14px] text-ink-3">({h.entry.readingNote})</span> : null}
                {h.approx ? <span className="ml-2 font-ui text-[11.5px] text-ink-3">khác dấu</span> : null}
              </>
            )}
          </span>
          {h.sub ? (
            <span className="ml-2 text-[13px] text-ink-3">
              trong <span className="font-text text-ink-2">{h.entry.headword}</span> <HanGlyph han={h.entry.han} size="sm" interactive={false} />
            </span>
          ) : null}
          <span className="mt-0.5 block font-text text-[15px] leading-relaxed text-ink-2 [overflow-wrap:anywhere]">
            {h.field === "definition" ? (
              <Highlight text={h.text} ranges={h.ranges} />
            ) : (
              <span className="line-clamp-2">{h.sub ? h.sub.definition : h.entry.gloss}</span>
            )}
          </span>
        </span>
      </Link>
    </li>
  );
}
