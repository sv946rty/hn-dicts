"use client";

import { useState } from "react";
import type { Correction } from "@/lib/data/types";
import { T } from "@/platform/strings";
import { Highlight } from "./Han";
import { Sheet } from "./Sheet";

export type SourceInfo = {
  dictTitle: string;
  editionTitle: string;
  dataVersion: string;
  entryId: string;
  globalId: string;
  headword: string;
  pdfPage: number | null;
  pagePreview: string | null;
  sourceId: string | null;
  sourceFile: string | null;
  sourceLine: number | null;
  sourcePart: number | null;
  raw: string | null;
  subRaw: string[];
  corrections: Correction[];
  citation: string;
};

/** Where the entry comes from. Quiet by default; everything is one click away. */
export function SourcePanel({ info }: { info: SourceInfo }) {
  const [page, setPage] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="text-[13.5px] leading-relaxed">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        <dt className="text-ink-3">Bản in</dt>
        <dd className="text-ink">
          {info.pdfPage ? (
            <>
              Bản điện tử 2026, trang {info.pdfPage}
              {info.pagePreview ? (
                <button type="button" onClick={() => setPage(true)} className="ml-2 text-accent hover:underline">
                  Xem trang
                </button>
              ) : null}
            </>
          ) : (
            <span className="text-ink-3">chưa xác định trang</span>
          )}
        </dd>
        <dt className="text-ink-3">Mã mục</dt>
        <dd className="font-mono text-[12.5px] text-ink-2">
          {info.entryId} · {info.globalId}
        </dd>
        <dt className="text-ink-3">Dữ liệu</dt>
        <dd className="text-ink-2">
          {info.dataVersion} · {info.sourceFile}
          {info.sourceLine ? `, dòng ${info.sourceLine}` : ""}
          {info.sourceId && info.sourceId !== info.entryId ? <span className="font-mono text-[12.5px]"> ({info.sourceId})</span> : null}
        </dd>
      </dl>

      {info.corrections.length ? (
        <div className="mt-4">
          <h3 className="text-[12px] uppercase tracking-wider text-ink-3">Hiệu đính</h3>
          <ul className="mt-1.5 space-y-1.5">
            {info.corrections.map((c, i) => (
              <li key={i} className="text-[13px] text-ink-2" lang="en">
                {c.version ? <span className="mr-1.5 font-mono text-[12px] text-ink-3">{c.version}</span> : null}
                <Highlight text={c.text} ranges={[]} />
                {c.field ? (
                  <span className="block font-mono text-[12px] text-ink-3">
                    {c.field}: {String(c.from)} → {String(c.to)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <details className="group mt-4 border-t border-rule pt-3">
        <summary className="cursor-pointer list-none text-[13px] text-ink-2 hover:text-ink">
          <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span>
          Dòng dữ liệu gốc
        </summary>
        <p className="mt-2 text-[12px] text-ink-3">Nguyên văn trong dữ liệu {info.dataVersion}, gồm cả ký hiệu định dạng của nguồn số hoá. Giao diện không sửa các dòng này.</p>
        <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border border-rule bg-bg p-3 font-mono text-[12px] leading-relaxed text-ink-2">
          {[info.raw, ...info.subRaw].filter(Boolean).join("\n")}
        </pre>
      </details>

      <div className="mt-4 border-t border-rule pt-3">
        <p className="text-[12.5px] text-ink-3">{info.citation}</p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(info.citation).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            });
          }}
          className="mt-1.5 text-[13px] text-accent hover:underline"
        >
          {copied ? T.copied : T.copyCitation}
        </button>
      </div>

      {info.pagePreview ? (
        <Sheet open={page} onClose={() => setPage(false)} title={`Trang ${info.pdfPage}`} wide>
          <p className="mb-3 text-[13px] text-ink-3">
            {info.editionTitle}, trang {info.pdfPage}. Mục “{info.headword}” nằm trên trang này.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={info.pagePreview} alt={`Trang ${info.pdfPage} của bản điện tử 2026`} className="mx-auto w-full max-w-3xl border border-rule bg-white" />
        </Sheet>
      ) : null}
    </div>
  );
}
