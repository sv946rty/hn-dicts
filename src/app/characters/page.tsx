import type { Metadata } from "next";
import Link from "next/link";
import { getEntries, getRadicals } from "@/lib/data/dictionaries";
import { HanGlyph } from "@/platform/components/Han";
import { routes } from "@/platform/registry";
import { HAN_STATUS_LABEL } from "@/platform/strings";
import { codePoint } from "@/platform/text";

export const metadata: Metadata = { title: "Chữ Hán/Nôm" };

const nf = new Intl.NumberFormat("vi-VN");

// Platform-level character exploration. Today every character comes from
// Đại Nam Quấc Âm Tự Vị; the radical index and character pages are keyed by
// code point, so other dictionaries add occurrences rather than new pages.
export default async function CharactersPage({ searchParams }: PageProps<"/characters">) {
  const sp = await searchParams;
  const radicals = getRadicals();
  const sel = Number(sp.radical) || null;
  const current = radicals.find((r) => r.kxrn === sel) ?? null;
  const total = radicals.reduce((a, r) => a + r.chars.length, 0);
  const unmapped = getEntries("dnqatv").filter((e) => e.han.status === "pua" || e.han.status === "image_only");

  const byStrokes = new Map<number | null, string[]>();
  for (const [ch, rs] of current?.chars ?? []) {
    if (!byStrokes.has(rs)) byStrokes.set(rs, []);
    byStrokes.get(rs)!.push(ch);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <p className="text-[12px] font-medium uppercase tracking-wider text-ink-3">Chữ Hán/Nôm</p>
      <h1 className="mt-2 font-text text-[32px] font-semibold text-ink">Tra chữ theo bộ</h1>
      <p className="mt-2 max-w-2xl font-text text-[16.5px] leading-relaxed text-ink-2">
        {nf.format(total)} chữ đứng đầu mục, xếp theo {radicals.length} bộ Khang Hi rồi theo số nét ngoài bộ. Chọn một chữ để xem cấu tạo và những mục từ dùng chữ ấy. Muốn tra bằng chữ, gõ chữ vào ô tìm kiếm.
      </p>

      <ol className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1" aria-label="Các bộ">
        {radicals.map((r) => (
          <li key={r.kxrn}>
            <Link
              href={routes.radical(r.kxrn)}
              aria-current={r.kxrn === sel ? "page" : undefined}
              title={`Bộ ${r.kxrn} · ${r.chars.length} chữ`}
              className="flex h-14 flex-col items-center justify-center rounded-md border border-transparent hover:border-rule-strong aria-[current=page]:border-ink aria-[current=page]:bg-surface"
            >
              <span className="font-han text-[22px] leading-none text-ink">{r.radical}</span>
              <span className="mt-1 text-[10px] tabular-nums text-ink-3">{r.kxrn}</span>
            </Link>
          </li>
        ))}
      </ol>

      {current ? (
        <section className="mt-10 border-t border-rule-strong pt-6" aria-label={`Bộ ${current.radical}`}>
          <h2 className="flex items-baseline gap-3">
            <span className="font-han text-[40px] leading-none text-ink">{current.radical}</span>
            <span className="text-[14px] text-ink-2">
              Bộ số {current.kxrn} · {current.chars.length} chữ
            </span>
          </h2>
          <div className="mt-5 space-y-4">
            {[...byStrokes.entries()].map(([rs, list]) => (
              <div key={String(rs)} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
                <span className="pt-2 text-right text-[12px] text-ink-3">{rs == null ? "chưa rõ" : `+${rs} nét`}</span>
                <ul className="flex flex-wrap gap-1">
                  {list.map((ch) => (
                    <li key={ch}>
                      <Link href={routes.character(codePoint(ch))} className="flex h-12 w-12 items-center justify-center rounded-md font-han text-[26px] text-ink hover:bg-surface hover:text-han">
                        {ch}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14 border-t border-rule-strong pt-6" data-dict="dnqatv">
        <h2 className="font-text text-[20px] font-semibold text-ink">Chữ chưa có mã Unicode chuẩn</h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-2">
          Trong Đại Nam Quấc Âm Tự Vị, {unmapped.length} chữ đầu mục chưa có mã chuẩn. {HAN_STATUS_LABEL.image_only.long} Chữ mã riêng (PUA) chỉ hiển thị đúng với phông Nom Na Tong.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
          {unmapped.map((e) => (
            <li key={e.id} className="border-b border-rule">
              <Link href={routes.entry("dnqatv", e.id)} className="flex items-center gap-3 py-2 hover:text-accent">
                <span className="w-9 text-center text-[20px]">
                  <HanGlyph han={e.han} size="sm" interactive={false} />
                </span>
                <span className="font-text text-[15px]">{e.headword}</span>
                <span className="ml-auto text-[11px] text-ink-3">{e.han.status === "pua" ? "PUA" : "hình"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
