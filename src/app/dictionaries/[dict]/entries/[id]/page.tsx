import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { characterView } from "@/lib/data/characters";
import { getEntry, getNeighbours, getStats, plain } from "@/lib/data/dictionaries";
import { cleanTerm } from "@/lib/data/search";
import { EDITION, PAGE_PREVIEWS, typeMeaning } from "@/dictionaries/dnqatv/identity";
import { HanGlyph, HanRun, RichText } from "@/platform/components/Han";
import { EntryShell } from "@/platform/components/EntryShell";
import { KeyNav } from "@/platform/components/KeyNav";
import { RememberEntry } from "@/platform/components/RecentEntries";
import type { SourceInfo } from "@/platform/components/SourcePanel";
import { getDictionaryDescriptor, routes } from "@/platform/registry";
import { T } from "@/platform/strings";
import { codePoint, isLinkableHan } from "@/platform/text";

type Props = PageProps<"/dictionaries/[dict]/entries/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dict, id } = await params;
  const e = getEntry(dict, decodeURIComponent(id));
  if (!e) return {};
  return { title: `${e.headword}${e.han.text ? ` ${e.han.text}` : ""}`, description: plain(e.definition).slice(0, 160) };
}

export default async function EntryPage({ params }: Props) {
  const { dict, id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const e = getEntry(dict, id);
  const d = getDictionaryDescriptor(dict);
  if (!e || !d) notFound();
  const stats = getStats(dict)!;
  const { list, prev, next } = getNeighbours(dict, e.id, 9);

  const headChar = e.han.status === "unicode" && e.han.text && [...e.han.text].length === 1 && isLinkableHan(e.han.text) ? characterView(codePoint(e.han.text)) : null;
  const typeTitle = typeMeaning(e.type);
  const url = routes.entry(dict, e.id);

  const source: SourceInfo = {
    dictTitle: d.title,
    editionTitle: EDITION.title,
    dataVersion: stats.dataVersion,
    entryId: e.id,
    globalId: e.globalId,
    headword: e.headword,
    pdfPage: e.pdfPage,
    pagePreview: e.pdfPage && PAGE_PREVIEWS.has(e.pdfPage) ? `/dictionaries/${dict}/pages/${String(e.pdfPage).padStart(4, "0")}.webp` : null,
    sourceId: e.source.id,
    sourceFile: e.source.file,
    sourceLine: e.source.line,
    sourcePart: e.source.part,
    raw: e.source.raw,
    subRaw: e.subentries.map((s) => s.raw),
    corrections: e.corrections,
    citation: `${d.author}, ${d.title} (${d.dates}), mục “${e.headword}” [${e.id}]${e.pdfPage ? `; bản điện tử 2026, tr. ${e.pdfPage}` : ""}; dữ liệu ${stats.dataVersion}. ${url}`,
  };

  const left = (
    <nav aria-label={T.nearby} className="sticky top-20 text-[14px]">
      <Link href={routes.browse(dict, e.letter)} className="mb-2 block font-text text-[13px] uppercase tracking-wider text-ink-3 hover:text-ink">
        Vần {e.letter}
      </Link>
      <ol className="space-y-0.5 border-l border-rule">
        {list.map((n) => (
          <li key={n.id}>
            <Link
              href={routes.entry(dict, n.id)}
              aria-current={n.id === e.id ? "page" : undefined}
              className="-ml-px flex items-baseline gap-2 border-l border-transparent py-1 pl-3 text-ink-2 hover:text-ink aria-[current=page]:border-accent aria-[current=page]:text-accent"
            >
              <span className="w-5 shrink-0 text-center">
                <HanGlyph han={n.han} size="sm" interactive={false} />
              </span>
              <span className="truncate font-text">{n.headword}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );

  const crumbs = (
    <p className="text-[13px] text-ink-3">
      <Link href={routes.dictionary(dict)} className="hover:text-ink">
        {d.shortTitle}
      </Link>
      <span className="px-1.5">›</span>
      <Link href={routes.browse(dict, e.letter)} className="hover:text-ink">
        {e.letter}
      </Link>
    </p>
  );

  return (
    <main className="flex flex-1 flex-col">
      <RememberEntry dict={dict} id={e.id} headword={e.headword} han={e.han.status === "image_only" ? null : e.han.text} />
      <KeyNav prev={prev ? routes.entry(dict, prev.id) : null} next={next ? routes.entry(dict, next.id) : null} />
      <EntryShell han={e.han} initialChar={headChar} source={source} left={left} crumbs={crumbs}>
        <article lang="vi" className="pb-16">
          <header className="mt-4 flex items-end justify-between gap-6 border-b border-rule-strong pb-5">
            <div className="min-w-0">
              <h1 className="font-text text-[44px] font-semibold leading-[1.05] text-accent sm:text-[56px]">{e.headword}</h1>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-text text-[16px] text-ink-2">
                {e.type ? (
                  <span>
                    {typeTitle ? (
                      <abbr title={typeTitle} className="cursor-help italic no-underline">
                        {e.type}
                      </abbr>
                    ) : (
                      <span className="italic">{e.type}</span>
                    )}
                    {typeTitle ? <span className="ml-1.5 font-ui text-[13px] text-ink-3">{typeTitle.toLowerCase()}</span> : null}
                  </span>
                ) : null}
                {e.readingNote ? (
                  <span title="Ghi chú cách đọc trong bản in">
                    <span className="text-ink-3">đọc</span> ({e.readingNote})
                  </span>
                ) : null}
              </p>
            </div>
            <div className="shrink-0 pb-1">
              <HanGlyph han={e.han} size="xl" />
            </div>
          </header>

          {e.definition.length ? (
            <p className="mt-6 font-text text-[19px] leading-[1.7] text-ink">
              <RichText rich={e.definition} />
            </p>
          ) : null}

          {e.subentries.length ? (
            <section aria-labelledby="subs" className="mt-10">
              <h2 id="subs" className="flex items-baseline gap-2 border-b border-rule pb-2 text-[12px] font-medium uppercase tracking-wider text-ink-3">
                Từ ngữ <span className="font-normal tabular-nums">{e.subentries.length}</span>
              </h2>
              <ol className="mt-2">
                {e.subentries.map((s) => (
                  <li key={s.n} id={`s${s.n}`} className="sub-row grid scroll-mt-28 grid-cols-1 rounded-sm py-[7px] sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:gap-x-4">
                    <span className="hidden pt-[3px] text-right text-[17px] leading-snug sm:block">
                      {s.han ? (
                        <>
                          <span className="form-modern">
                            <HanRun text={s.han} />
                          </span>
                          <span className="form-print whitespace-nowrap text-ink-3">
                            {s.separator === "before_han" ? "| " : ""}
                            <HanRun text={s.han} />
                            {s.separator === "after_han" ? " |" : ""}
                          </span>
                        </>
                      ) : null}
                    </span>
                    <p className="font-text text-[16.5px] leading-[1.65] text-ink">
                      {s.han ? (
                        <span className="mr-2 text-[17px] sm:hidden">
                          <span className="form-modern">
                            <HanRun text={s.han} />
                          </span>
                          <span className="form-print text-ink-3">
                            {s.separator === "before_han" ? "| " : ""}
                            <HanRun text={s.han} />
                            {s.separator === "after_han" ? " |" : ""}
                          </span>
                        </span>
                      ) : null}
                      <a href={`#s${s.n}`} className="font-semibold text-ink hover:text-accent">
                        <span className="form-modern">{cleanTerm(s.term)}</span>
                        <span className="form-print italic">{s.display}</span>
                      </a>
                      {s.definition.length ? (
                        <>
                          <span className="text-ink-3">. </span>
                          <RichText rich={s.definition} />
                        </>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <nav aria-label="Mục trước và sau" className="mt-12 grid grid-cols-2 gap-4 border-t border-rule pt-4 text-[14px]">
            <div>
              {prev ? (
                <Link href={routes.entry(dict, prev.id)} rel="prev" className="group block">
                  <span className="block text-[12px] text-ink-3">← {T.previous}</span>
                  <span className="font-text text-[17px] text-ink group-hover:text-accent">
                    {prev.headword} <HanGlyph han={prev.han} size="sm" interactive={false} />
                  </span>
                </Link>
              ) : null}
            </div>
            <div className="text-right">
              {next ? (
                <Link href={routes.entry(dict, next.id)} rel="next" className="group block">
                  <span className="block text-[12px] text-ink-3">{T.next} →</span>
                  <span className="font-text text-[17px] text-ink group-hover:text-accent">
                    <HanGlyph han={next.han} size="sm" interactive={false} /> {next.headword}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        </article>
      </EntryShell>
    </main>
  );
}
