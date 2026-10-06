import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLetter, getStats } from "@/lib/data/dictionaries";
import { AlphabetStrip } from "@/platform/components/AlphabetStrip";
import { LetterFilter } from "@/platform/components/LetterFilter";
import { HanGlyph } from "@/platform/components/Han";
import { getDictionaryDescriptor, routes } from "@/platform/registry";
import { fold } from "@/platform/text";

type Props = PageProps<"/dictionaries/[dict]/browse/[letter]">;

export function generateStaticParams() {
  return (getDictionaryDescriptor("dnqatv")?.letters ?? []).map((letter) => ({ dict: "dnqatv", letter }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { letter } = await params;
  return { title: `Vần ${decodeURIComponent(letter)}` };
}

const nf = new Intl.NumberFormat("vi-VN");

export default async function LetterPage({ params }: Props) {
  const { dict, letter: raw } = await params;
  const letter = decodeURIComponent(raw).normalize("NFC");
  const stats = getStats(dict);
  const info = stats?.letters.find((l) => l.letter === letter);
  if (!stats || !info) notFound();
  const rows = getLetter(dict, letter);

  // Quick jumps inside a long letter: the first two letters of the headword.
  const groups: { key: string; id: string }[] = [];
  for (const r of rows) {
    const key = fold(r.headword).slice(0, 2);
    if (!groups.some((g) => g.key === key)) groups.push({ key, id: r.id });
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20 sm:px-6">
      <AlphabetStrip dict={dict} letters={stats.letters} current={letter} sticky />

      <header className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-rule-strong pb-5">
        <div className="flex items-end gap-5">
          <h1 className="font-text text-[72px] font-semibold leading-[0.85] text-accent">{letter}</h1>
          <p className="pb-1 text-[14px] leading-relaxed text-ink-2">
            Chữ {letter}
            <br />
            {nf.format(info.entries)} mục từ · {nf.format(info.subentries)} từ ngữ
          </p>
        </div>
        <LetterFilter letter={letter} />
      </header>

      {groups.length > 4 ? (
        <nav aria-label="Nhảy nhanh" className="scrollbar-none mt-4 flex gap-1 overflow-x-auto text-[13px]">
          {groups.map((g) => (
            <a key={g.key} href={`#${g.id}`} className="shrink-0 rounded-md border border-rule px-2.5 py-1.5 font-text capitalize text-ink-2 hover:border-accent hover:text-accent">
              {g.key}
            </a>
          ))}
        </nav>
      ) : null}

      <ol className="mt-4" data-letter-list="">
        {rows.map((r) => (
          <li key={r.id} id={r.id} data-fold={`${fold(r.headword)} ${r.han.text ?? ""}`} className="scroll-mt-32 border-b border-rule last:border-b-0">
            <Link href={routes.entry(dict, r.id)} className="group flex items-baseline gap-3 py-2.5 sm:gap-4">
              <span className="w-9 shrink-0 text-center text-[18px] sm:w-12">
                <HanGlyph han={r.han} size="sm" interactive={false} />
              </span>
              <span className="min-w-0 flex-1 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
                <span className="block font-text text-[17px] text-ink group-hover:text-accent">
                  <span className="font-semibold">{r.headword}</span>
                  {r.type ? <span className="ml-1.5 text-[14px] italic text-ink-3">{r.type}</span> : null}
                </span>
                <span className="block truncate font-text text-[14.5px] text-ink-2">{r.gloss}</span>
              </span>
              <span className="w-8 shrink-0 text-right text-[12px] tabular-nums text-ink-3" title="Số từ ngữ">
                {r.subentryCount || ""}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
