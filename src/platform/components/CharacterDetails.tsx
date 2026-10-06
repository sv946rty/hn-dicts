import Link from "next/link";
import { routes } from "@/platform/registry";
import { HAN_STATUS_LABEL, T } from "@/platform/strings";
import type { CharacterView } from "@/lib/data/characters";
import type { HanForm } from "@/lib/data/types";

const nf = new Intl.NumberFormat("vi-VN");

/**
 * Character summary with progressive disclosure: the everyday facts first
 * (radical, strokes, composition), research fields folded away.
 */
export function CharacterDetails({ view, compact = false }: { view: CharacterView; compact?: boolean }) {
  const { record } = view;
  const m = record.metadata;
  const occ = Object.values(record.occurrences);
  const counts = occ.reduce((a, o) => ({ h: a.h + o.headwords.length, s: a.s + o.subentries.length, d: a.d + o.definitions.length }), { h: 0, s: 0, d: 0 });

  return (
    <div>
      <div className="flex items-start gap-4">
        <span className="font-han text-[64px] leading-none text-han" lang="zh-Hant">
          {record.char}
        </span>
        <div className="pt-1">
          <p className="font-mono text-[13px] text-ink-2">{record.cp}</p>
          <p className="mt-0.5 text-[12px] text-ink-3">{HAN_STATUS_LABEL.unicode.short}</p>
        </div>
      </div>

      {m ? (
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
          {m.radical?.radical ? (
            <>
              <dt className="text-ink-3">Bộ</dt>
              <dd>
                <Link href={routes.radical(m.radical.kxrn!)} className="hover:text-accent">
                  <span className="font-han text-han">{m.radical.radical}</span>
                  <span className="ml-1.5 text-ink-2">bộ số {m.radical.kxrn}</span>
                </Link>
              </dd>
            </>
          ) : null}
          {m.totalStrokes != null ? (
            <>
              <dt className="text-ink-3">Số nét</dt>
              <dd className="text-ink">
                {m.totalStrokes}
                {m.residualStrokes != null ? <span className="text-ink-2"> · ngoài bộ {m.residualStrokes}</span> : null}
              </dd>
            </>
          ) : null}
          {m.comp ? (
            <>
              <dt className="text-ink-3">Cấu tạo</dt>
              <dd>
                <span className="font-han text-[1.15em] text-ink">{m.comp}</span>
                {m.components.length ? (
                  <span className="ml-2 text-ink-2">
                    {m.components.map((c, i) => (
                      <span key={i}>
                        {i > 0 ? " + " : ""}
                        {view.linkable[c] ? (
                          <Link href={routes.character(view.linkable[c])} data-han-char={c} className="font-han text-han underline decoration-rule-strong underline-offset-4 hover:decoration-accent">
                            {c}
                          </Link>
                        ) : (
                          <span className="font-han">{c}</span>
                        )}
                      </span>
                    ))}
                  </span>
                ) : null}
              </dd>
            </>
          ) : null}
        </dl>
      ) : (
        <p className="mt-4 text-[13px] leading-relaxed text-ink-3">
          Dữ liệu v024 chỉ ghi bộ, nét và cấu tạo cho chữ đứng đầu mục. Chữ này chỉ xuất hiện trong từ ngữ hoặc lời giải.
        </p>
      )}

      <p className="mt-4 text-[13px] leading-relaxed text-ink-2">
        {[counts.h ? `đầu ${nf.format(counts.h)} mục từ` : null, counts.s ? `trong ${nf.format(counts.s)} từ ngữ` : null, counts.d ? `trong ${nf.format(counts.d)} lời giải` : null].filter(Boolean).join(", ") ||
          "Chưa thấy trong từ điển nào."}
      </p>

      {m ? (
        <details className="group mt-4 border-t border-rule pt-3">
          <summary className="cursor-pointer list-none text-[13px] text-ink-2 hover:text-ink">
            <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span>
            {T.scholarly}
          </summary>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[12.5px]">
            {m.unihan
              ? Object.entries(m.unihan).map(([k, v]) => (
                  <Row key={k} k={`Unihan ${k}`} v={v} mono />
                ))
              : null}
            {m.idsSource ? <Row k="Nguồn cấu tạo" v={[m.idsSource.dataset, m.idsSource.file ?? m.idsSource.field, m.idsSource.basis ?? m.idsSource.method].filter(Boolean).join(" · ")} /> : null}
            {m.idsAlternates?.length ? <Row k="Cấu tạo khác" v={JSON.stringify(m.idsAlternates)} mono /> : null}
            {m.fontSupport ? <Row k="Phông" v={`Nom Na Tong ${yn(m.fontSupport.nomNaTong)} · BabelStone Han ${yn(m.fontSupport.babelStoneHan)}`} /> : null}
            {occ[0]?.metadataFrom ? <Row k="Ghi theo mục" v={occ[0].metadataFrom} mono /> : null}
          </dl>
        </details>
      ) : null}

      {!compact ? null : (
        <Link href={routes.character(record.cp)} className="mt-4 inline-block text-[13px] text-accent hover:underline">
          {T.openCharacter} →
        </Link>
      )}
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <>
      <dt className="text-ink-3">{k}</dt>
      <dd className={`break-words text-ink-2 ${mono ? "font-mono" : ""}`}>{v}</dd>
    </>
  );
}

function yn(v: boolean | null) {
  return v == null ? "chưa rõ" : v ? "có" : "không";
}

/** Headword Hán/Nôm that has no character page: image-only or private-use glyphs. */
export function UnmappedHanDetails({ han }: { han: HanForm }) {
  const label = HAN_STATUS_LABEL[han.status ?? ""] ?? null;
  const pua = han.status === "pua" && han.text ? `U+${(han.text.codePointAt(0) ?? 0).toString(16).toUpperCase()}` : null;
  return (
    <div>
      <div className="flex items-start gap-4">
        {han.status === "image_only" ? (
          han.image?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={han.image.src} alt="Chữ Hán/Nôm giữ bằng hình từ bản in gốc" className="h-20 w-auto border border-rule bg-white p-1.5 dark:invert" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center border border-dashed border-rule-strong text-[12px] text-ink-3">chưa có hình</span>
          )
        ) : (
          <span className="font-han text-[64px] leading-none text-han">{han.text}</span>
        )}
        <div className="pt-1">
          {pua ? <p className="font-mono text-[13px] text-ink-2">{pua}</p> : null}
          <p className="mt-0.5 text-[12px] font-medium text-ink-2">{label?.short}</p>
        </div>
      </div>
      <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">{label?.long}</p>
      {han.status === "image_only" ? (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
          Dấu <span className="text-han">*</span> sau chữ là quy ước của bản điện tử 2026. Khi một mã Unicode được xác minh, hình sẽ được thay bằng chữ mà nội dung mục từ không đổi.
        </p>
      ) : null}
      {han.status === "pua" && han.metadata?.fontSupport ? (
        <p className="mt-2 text-[13px] text-ink-3">
          Phông Nom Na Tong {yn(han.metadata.fontSupport.nomNaTong)} · BabelStone Han {yn(han.metadata.fontSupport.babelStoneHan)}
        </p>
      ) : null}
      {han.sourceRaw ? (
        <p className="mt-2 text-[12.5px] text-ink-3">
          Dữ liệu nguồn ghi: <span className="font-mono">{[...han.sourceRaw].map((c) => `U+${(c.codePointAt(0) ?? 0).toString(16).toUpperCase()}`).join(" ")}</span>
        </p>
      ) : null}
    </div>
  );
}
