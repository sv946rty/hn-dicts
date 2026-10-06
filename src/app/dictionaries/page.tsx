import type { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/data/dictionaries";
import { DICTIONARIES, routes } from "@/platform/registry";
import { PLATFORM, T } from "@/platform/strings";

export const metadata: Metadata = { title: T.collection };

const nf = new Intl.NumberFormat("vi-VN");

// The collection is deliberately a list, not a grid of cards: it reads like a
// shelf list and stays legible at one entry or twenty.
export default function CollectionPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <p className="text-[12px] font-medium uppercase tracking-wider text-ink-3">{T.collection}</p>
      <h1 className="mt-2 font-text text-[34px] font-semibold text-ink">{PLATFORM.name}</h1>
      <p className="mt-3 max-w-xl font-text text-[17px] leading-relaxed text-ink-2">
        {PLATFORM.tagline}. Mỗi từ điển giữ nguyên diện mạo và chính tả của mình; tra tìm, chữ Hán/Nôm và cách xem nguồn là chung cho cả bộ sưu tập.
      </p>

      <ol className="mt-10 border-t border-rule-strong">
        {DICTIONARIES.map((d) => {
          const stats = d.status === "available" ? getStats(d.slug) : null;
          return (
            <li key={d.slug} data-dict={d.status === "available" ? d.theme : undefined} className="border-b border-rule">
              {d.status === "available" ? (
                <Link href={routes.dictionary(d.slug)} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 bg-bg px-4 py-6 sm:px-6">
                  <span>
                    <span className="block font-text text-[22px] font-semibold text-accent">{d.title}</span>
                    <span className="mt-1 block font-han text-[22px] tracking-[0.18em] text-han">{d.titleHan}</span>
                    <span className="mt-2 block text-[14px] text-ink-2">
                      {d.author} · {d.dates}
                    </span>
                    {stats ? (
                      <span className="mt-1 block text-[13px] text-ink-3">
                        {nf.format(stats.totals.entries)} mục từ · {nf.format(stats.totals.subentries)} từ ngữ · dữ liệu {stats.dataVersion}
                      </span>
                    ) : null}
                  </span>
                  <span className="self-center text-[13px] text-ink-2 group-hover:text-accent">{T.available} →</span>
                </Link>
              ) : (
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 px-4 py-5 text-ink-3 sm:px-6">
                  <span className="font-text text-[19px]">{d.title}</span>
                  <span className="self-center text-[13px]">{T.comingLater}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
        Từ điển “sắp có” chỉ được ghi tên; trang web không có dữ liệu hay thông tin nào khác về chúng cho tới khi dữ liệu được đưa vào.
      </p>
    </main>
  );
}
