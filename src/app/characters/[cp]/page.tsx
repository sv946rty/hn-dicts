import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { characterView } from "@/lib/data/characters";
import { getEntry, plain } from "@/lib/data/dictionaries";
import { cleanTerm } from "@/lib/data/search";
import { CharacterDetails } from "@/platform/components/CharacterDetails";
import { HanGlyph } from "@/platform/components/Han";
import { getDictionaryDescriptor, routes } from "@/platform/registry";

type Props = PageProps<"/characters/[cp]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cp } = await params;
  const v = characterView(decodeURIComponent(cp));
  return v ? { title: `${v.record.char} ${v.record.cp}` } : {};
}

const nf = new Intl.NumberFormat("vi-VN");

export default async function CharacterPage({ params }: Props) {
  const { cp } = await params;
  const view = characterView(decodeURIComponent(cp), 200);
  if (!view) notFound();
  const { record } = view;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <p className="text-[13px] text-ink-3">
        <Link href={routes.characters()} className="hover:text-ink">
          Chữ Hán/Nôm
        </Link>
        {record.metadata?.radical?.kxrn ? (
          <>
            <span className="px-1.5">›</span>
            <Link href={routes.radical(record.metadata.radical.kxrn)} className="hover:text-ink">
              Bộ <span className="font-han">{record.metadata.radical.radical}</span>
            </Link>
          </>
        ) : null}
      </p>

      <div className="mt-6 grid gap-10 md:grid-cols-[300px_minmax(0,1fr)]">
        <div className="md:sticky md:top-20 md:self-start">
          <CharacterDetails view={view} />
        </div>

        <div className="space-y-10">
          {Object.entries(record.occurrences).map(([dict, occ]) => {
            const d = getDictionaryDescriptor(dict);
            const heads = view.headwordEntries.find((h) => h.dict === dict)?.entries ?? [];
            return (
              <section key={dict} data-dict={d?.theme} aria-label={d?.title}>
                <h2 className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule-strong pb-2">
                  <span className="font-text text-[19px] font-semibold text-ink">{d?.title}</span>
                  <span className="text-[13px] text-ink-3">
                    {d?.author} · {d?.dates}
                  </span>
                </h2>

                {heads.length ? (
                  <>
                    <h3 className="mt-5 text-[12px] font-medium uppercase tracking-wider text-ink-3">Chữ đầu mục · {heads.length}</h3>
                    <ul className="mt-1">
                      {heads.map((e) => (
                        <li key={e.id} className="border-b border-rule last:border-0">
                          <Link href={routes.entry(dict, e.id)} className="group flex items-baseline gap-3 py-2.5">
                            <span className="font-text text-[18px] font-semibold text-ink group-hover:text-accent">{e.headword}</span>
                            {e.type ? <span className="font-text text-[14px] italic text-ink-3">{e.type}</span> : null}
                            <span className="truncate font-text text-[15px] text-ink-2">{e.gloss}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {occ.subentries.length ? (
                  <>
                    <h3 className="mt-7 text-[12px] font-medium uppercase tracking-wider text-ink-3">Trong từ ngữ · {nf.format(occ.subentries.length)}</h3>
                    <ul className="mt-1 columns-1 gap-8 sm:columns-2">
                      {occ.subentries.slice(0, 120).map(([id, n]) => {
                        const e = getEntry(dict, id);
                        const s = e?.subentries[n - 1];
                        if (!e || !s) return null;
                        return (
                          <li key={`${id}-${n}`} className="break-inside-avoid border-b border-rule">
                            <Link href={routes.entry(dict, id, n)} className="group flex items-baseline gap-2 py-2">
                              <span className="font-han text-[17px] text-han">{s.han}</span>
                              <span className="font-text text-[15.5px] text-ink group-hover:text-accent">{cleanTerm(s.term)}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}

                {occ.definitions.length ? (
                  <>
                    <h3 className="mt-7 text-[12px] font-medium uppercase tracking-wider text-ink-3">Trong lời giải · {nf.format(occ.definitions.length)}</h3>
                    <ul className="mt-1">
                      {occ.definitions.slice(0, 40).map(([id, n]) => {
                        const e = getEntry(dict, id);
                        if (!e) return null;
                        const s = n ? e.subentries[n - 1] : null;
                        const text = s ? plain(s.definition) : plain(e.definition);
                        return (
                          <li key={`${id}-${n}`} className="border-b border-rule">
                            <Link href={routes.entry(dict, id, n || undefined)} className="group block py-2">
                              <span className="font-text text-[15.5px] font-semibold text-ink group-hover:text-accent">
                                {s ? cleanTerm(s.term) : e.headword} <HanGlyph han={e.han} size="sm" interactive={false} />
                              </span>
                              <span className="block truncate font-text text-[14.5px] text-ink-2">{text}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
