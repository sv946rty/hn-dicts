import { NextResponse, type NextRequest } from "next/server";
import { lookupWords, searchAll, suggest } from "@/lib/data/search";
import { availableDictionaries, getDictionaryDescriptor } from "@/platform/registry";

// Type-ahead endpoint. ?dict= scopes to one dictionary; without it every
// available dictionary is searched and hits keep their dictionary slug.
// Multi-word queries also return each word looked up on its own.
export function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const dict = req.nextUrl.searchParams.get("dict");
  const limit = Math.min(20, Number(req.nextUrl.searchParams.get("limit") ?? 8) || 8);
  if (dict && getDictionaryDescriptor(dict)?.status === "available") {
    return NextResponse.json({ hits: suggest(dict, q, limit), words: lookupWords(dict, q, 10) });
  }
  const hits = searchAll(q, limit).flatMap((r) => [...r.headwords, ...r.subentries, ...r.definitions].slice(0, limit));
  const words = availableDictionaries().flatMap((d) => lookupWords(d.slug, q, 10));
  return NextResponse.json({ hits: hits.slice(0, limit), words });
}
