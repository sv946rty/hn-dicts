"use client";

import { useEffect, useRef } from "react";
import { T } from "@/platform/strings";

/**
 * Bottom sheet on phones, centred dialog on larger screens. Used for
 * secondary material (character details, source) so it never displaces the
 * entry text.
 */
export function Sheet({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className={`m-0 mt-auto max-h-[85vh] w-full max-w-none overflow-hidden rounded-t-2xl border border-rule bg-surface p-0 text-ink backdrop:bg-black/30 sm:m-auto sm:rounded-xl ${wide ? "sm:max-w-4xl" : "sm:max-w-md"}`}
    >
      <div className="flex items-center justify-between border-b border-rule px-5 py-3">
        <span className="mx-auto h-1 w-10 rounded-full bg-rule-strong sm:hidden" aria-hidden />
        <h2 className="hidden text-[13px] font-medium uppercase tracking-wider text-ink-3 sm:block">{title}</h2>
        <button type="button" onClick={onClose} className="absolute right-3 top-2 rounded-md p-2 text-ink-3 hover:text-ink" aria-label={T.close}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="max-h-[calc(85vh-3rem)] overflow-y-auto px-5 pb-8 pt-4">{children}</div>
    </dialog>
  );
}
