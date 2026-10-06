"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { DEFAULT_DICTIONARY, getDictionaryDescriptor, routes } from "@/platform/registry";
import { PLATFORM, T } from "@/platform/strings";
import { DictionarySwitcher } from "./DictionarySwitcher";
import { SearchBox } from "./SearchBox";

/** Which dictionary the current page belongs to; null means platform-wide. */
export function useDictionaryScope(): string | null {
  const path = usePathname();
  if (path === "/") return DEFAULT_DICTIONARY;
  const m = /^\/dictionaries\/([^/]+)/.exec(path);
  return m && getDictionaryDescriptor(m[1])?.status === "available" ? m[1] : null;
}

export function TopBar() {
  const path = usePathname();
  const scope = useDictionaryScope();
  const [menu, setMenu] = useState(false);
  const isHome = path === "/" || (scope !== null && path === routes.dictionary(scope));
  // Search pages carry their own large box on desktop.
  const isSearch = path === "/search" || path.endsWith("/search");
  const d = scope ?? DEFAULT_DICTIONARY;

  const links = [
    { href: routes.browse(d), label: T.browseShort, active: path.startsWith(routes.browse(d)) },
    { href: routes.characters(), label: T.exploreHan, active: path.startsWith("/characters") },
    { href: routes.about(d), label: T.about, active: path === routes.about(d) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--bg)_80%,transparent)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="shrink-0 font-text text-[15px] font-semibold tracking-wide text-ink" aria-label={`${PLATFORM.name}, trang đầu`}>
          {PLATFORM.name}
        </Link>
        <span className="h-5 w-px shrink-0 bg-rule-strong" aria-hidden />
        <DictionarySwitcher current={scope} />
        <div className="ml-auto hidden min-w-0 flex-1 justify-end md:flex">
          {!isHome && !isSearch ? (
            <Suspense>
              <SearchBox dict={scope} compact />
            </Suspense>
          ) : null}
        </div>
        <nav className="ml-auto hidden items-center gap-1 md:ml-2 md:flex" aria-label="Chính">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.active ? "page" : undefined}
              className={`rounded-md px-2.5 py-1.5 text-sm ${l.active ? "text-ink" : "text-ink-2 hover:text-ink"} aria-[current=page]:font-medium`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="ml-auto -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-2 md:hidden"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label="Mở danh mục"
          onClick={() => setMenu((m) => !m)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <path d={menu ? "M5 5l10 10M15 5L5 15" : "M3 6h14M3 10h14M3 14h14"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {!isHome ? (
        <div className="px-4 pb-3 md:hidden">
          <Suspense>
            <SearchBox dict={scope} compact />
          </Suspense>
        </div>
      ) : null}
      {menu ? (
        <nav id="mobile-menu" className="border-t border-rule px-2 py-2 md:hidden" aria-label="Chính">
          {[{ href: routes.dictionary(d), label: "Trang từ điển" }, ...links, { href: routes.collection(), label: T.collection }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="block rounded-md px-3 py-3 text-[15px] text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
