import Link from "next/link";
import { Suspense } from "react";
import { getRadicals, getStats } from "@/lib/data/dictionaries";
import { getDictionaryDescriptor, routes } from "@/platform/registry";
import { PLATFORM, T } from "@/platform/strings";
import { SearchBox } from "@/platform/components/SearchBox";
import { AlphabetStrip } from "@/platform/components/AlphabetStrip";
import { RecentEntries } from "@/platform/components/RecentEntries";
import { EXAMPLES } from "./identity";

const nf = new Intl.NumberFormat("vi-VN");

export function DictionaryHome({ showPlatform = false }: { showPlatform?: boolean }) {
  const d = getDictionaryDescriptor("dnqatv")!;
  const stats = getStats("dnqatv")!;
  const radicals = getRadicals();
  const charCount = radicals.reduce((a, r) => a + r.chars.length, 0);

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-3xl px-4 pb-10 pt-10 sm:px-6 sm:pt-20">
        {showPlatform ? (
          <p className="mb-8 text-center text-[13px] text-ink-3 sm:mb-12">
            {PLATFORM.tagline} ·{" "}
            <Link href={routes.collection()} className="underline decoration-rule-strong underline-offset-4 hover:text-ink">
              bộ sưu tập
            </Link>
          </p>
        ) : null}
        <header className="text-center">
          <h1 className="font-text text-[28px] font-semibold uppercase leading-tight tracking-[0.08em] text-accent sm:text-[34px]">
            {/* Broken as on the title page: ĐẠI NAM / QUẤC ÂM TỰ VỊ */}
            <span className="block sm:inline">Đại Nam </span>
            <span className="block sm:inline">Quấc Âm Tự Vị</span>
          </h1>
          <p className="mt-3 font-han text-[34px] tracking-[0.25em] text-han sm:text-[42px]" lang="zh-Hant">
            {d.titleHan}
          </p>
          <p className="mt-4 font-text text-[15px] text-ink-2">
            {d.author} <span className="px-1 text-ink-3">·</span> {d.dates}
          </p>
        </header>

        <div className="mt-9 sm:mt-12">
          <Suspense>
            <SearchBox dict="dnqatv" />
          </Suspense>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-ink-3">
            {nf.format(stats.totals.entries)} {T.entries} và {nf.format(stats.totals.subentries)} {T.subentries}. Gõ có dấu hay không dấu đều được; tra được cả chữ Hán/Nôm.
          </p>
          <p className="mt-4 flex flex-wrap items-baseline justify-center gap-x-1 gap-y-2 text-[15px]">
            <span className="mr-1 text-[13px] text-ink-3">Thử:</span>
            {EXAMPLES.map((ex, i) => (
              <span key={ex.q} className="inline-flex items-baseline">
                <Link href={routes.search("dnqatv", ex.q)} className="rounded px-1.5 py-0.5 font-text text-ink hover:bg-accent-soft" title={ex.note}>
                  {/[㐀-鿿]/.test(ex.q) ? <span className="font-han text-han">{ex.q}</span> : ex.q}
                </Link>
                {i < EXAMPLES.length - 1 ? <span className="text-ink-3">·</span> : null}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="border-t border-rule-strong pt-6">
          <AlphabetStrip dict="dnqatv" letters={stats.letters} wrap />
        </div>
        <div className="grid gap-px overflow-hidden border-y border-rule bg-rule sm:mt-8 sm:grid-cols-3">
          <HomeDoor href={routes.browse("dnqatv")} title={T.browse} body={`Đọc theo thứ tự chữ cái của bản in, ${stats.letters.length} vần từ A đến X.`} />
          <HomeDoor href={routes.characters()} title={T.exploreHan} body={`${nf.format(charCount)} chữ đầu mục xếp theo ${radicals.length} bộ, kèm nét, bộ thủ và cấu tạo.`} han="字" />
          <HomeDoor href={routes.about("dnqatv")} title="Về bộ tự vị" body="Tác giả, Tiểu tự 1895, dấu riêng và bản điện tử 2026." />
        </div>
        <RecentEntries />
      </section>

      <footer className="mx-auto mt-auto w-full max-w-5xl px-4 pb-8 pt-14 text-[12px] leading-relaxed text-ink-3 sm:px-6">
        Bản điện tử tham khảo 2026 · dữ liệu {stats.dataVersion} · giao diện thử nghiệm.{" "}
        <Link href={routes.collection()} className="underline decoration-rule-strong underline-offset-2 hover:text-ink-2">
          {PLATFORM.name}
        </Link>{" "}
        sẽ có thêm các từ điển khác.
      </footer>
    </main>
  );
}

function HomeDoor({ href, title, body, han }: { href: string; title: string; body: string; han?: string }) {
  return (
    <Link href={href} className="group block bg-bg px-1 py-5 sm:px-6 sm:py-6">
      <span className="flex items-baseline justify-between">
        <span className="font-text text-[17px] font-semibold text-ink group-hover:text-accent">{title}</span>
        <span className="text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </span>
      <span className="mt-1.5 block text-[14px] leading-relaxed text-ink-2">{body}</span>
      {han ? <span className="sr-only">{han}</span> : null}
    </Link>
  );
}
