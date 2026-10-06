"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** ← / → move to the previous / next entry, as turning a page would. */
export function KeyNav({ prev, next }: { prev: string | null; next: string | null }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector("dialog[open]")) return;
      if (e.key === "ArrowLeft" && prev) router.push(prev);
      if (e.key === "ArrowRight" && next) router.push(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);
  return null;
}
