import Link from "next/link";
import { routes } from "@/platform/registry";
import { HAN_STATUS_LABEL } from "@/platform/strings";
import { codePoint, isLinkableHan, segmentHan } from "@/platform/text";
import type { HanForm, Rich } from "@/lib/data/types";

/**
 * A headword's Hán/Nôm, honouring its status:
 *  - unicode: text in the Nôm font;
 *  - pua: text in the Nôm font, flagged as a font-specific private-use glyph;
 *  - image_only: the glyph image from the printed source with the edition's * marker,
 *    never a substitute character.
 */
export function HanGlyph({
  han,
  size = "md",
  interactive = true,
  className = "",
}: {
  han: Pick<HanForm, "status" | "text" | "image">;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  className?: string;
}) {
  const box = { sm: "h-[1.35em]", md: "h-[1.6em]", lg: "h-14", xl: "h-20 sm:h-24" }[size];
  const text = { sm: "text-[1.1em]", md: "text-[1.3em]", lg: "text-5xl", xl: "text-6xl sm:text-7xl" }[size];

  if (han.status === "image_only") {
    const label = HAN_STATUS_LABEL.image_only;
    return (
      <span className={`inline-flex items-start gap-0.5 ${className}`} title={label.long} data-han-image="">
        {han.image?.src ? (
          // Source-scan crop: a plain <img> keeps the pixels untouched.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={han.image.src} alt="Chữ Hán/Nôm giữ bằng hình từ bản in gốc" className={`${box} w-auto mix-blend-multiply dark:invert dark:mix-blend-screen`} />
        ) : (
          <span className={`${box} inline-flex aspect-square items-center justify-center border border-dashed border-rule-strong text-[0.6em] text-ink-3`}>
            hình
          </span>
        )}
        <span className="text-[0.75em] leading-none text-han" aria-hidden>
          {han.image?.marker ?? "*"}
        </span>
      </span>
    );
  }
  if (!han.text) return null;
  const glyph = (
    <span className={`font-han ${text} text-han ${className}`} lang="zh-Hant" title={han.status === "pua" ? HAN_STATUS_LABEL.pua.long : undefined}>
      {han.text}
      {han.status === "pua" ? <span className="sr-only"> (mã riêng của phông Nom Na Tong)</span> : null}
    </span>
  );
  const ch = [...han.text][0];
  if (interactive && han.status === "unicode" && [...han.text].length === 1 && isLinkableHan(ch)) {
    return (
      <Link href={routes.character(codePoint(ch))} data-han-char={ch} className="rounded-sm hover:bg-accent-soft">
        {glyph}
      </Link>
    );
  }
  return glyph;
}

/** Inline Hán/Nôm inside running text; each confirmed character is explorable. */
export function HanRun({ text, link = true }: { text: string; link?: boolean }) {
  return (
    <span className="font-han text-[1.08em] text-han" lang="zh-Hant">
      {[...text].map((ch, i) =>
        link && isLinkableHan(ch) ? (
          <Link key={i} href={routes.character(codePoint(ch))} data-han-char={ch} className="rounded-sm hover:bg-accent-soft">
            {ch}
          </Link>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  );
}

/** Dictionary text: italics as printed, Hán/Nôm set in the Nôm font. */
export function RichText({ rich, link = true }: { rich: Rich; link?: boolean }) {
  return (
    <>
      {rich.map((run, i) => {
        const parts = segmentHan(run.t).map((seg, j) => (seg.han ? <HanRun key={j} text={seg.text} link={link} /> : <span key={j}>{seg.text}</span>));
        return run.i ? <em key={i}>{parts}</em> : <span key={i}>{parts}</span>;
      })}
    </>
  );
}

/** Text with subtle match highlighting. Ranges index into `text`. */
export function Highlight({ text, ranges }: { text: string; ranges: [number, number][] }) {
  if (!ranges.length) return <PlainWithHan text={text} />;
  const out: React.ReactNode[] = [];
  let at = 0;
  ranges.forEach(([s, e], i) => {
    if (s > at) out.push(<PlainWithHan key={`t${i}`} text={text.slice(at, s)} />);
    out.push(
      <mark key={`m${i}`}>
        <PlainWithHan text={text.slice(s, e)} />
      </mark>,
    );
    at = e;
  });
  if (at < text.length) out.push(<PlainWithHan key="end" text={text.slice(at)} />);
  return <>{out}</>;
}

function PlainWithHan({ text }: { text: string }) {
  return (
    <>
      {segmentHan(text).map((seg, i) =>
        seg.han ? (
          <span key={i} className="font-han text-han" lang="zh-Hant">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}
