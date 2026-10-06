import { NextResponse, type NextRequest } from "next/server";
import { searchAll, suggest } from "@/lib/data/search";
import { getDictionaryDescriptor } from "@/platform/registry";

// Type-ahead endpoint. ?dict= scopes to one dictionary; without it every
// available dictionary is searched and hits keep their dictionary slug.
export function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const dict = req.nextUrl.searchParams.get("dict");
  const limit = Math.min(20, Number(req.nextUrl.searchParams.get("limit") ?? 8) || 8);
  if (dict && getDictionaryDescriptor(dict)?.status === "available") {
    return NextResponse.json({ hits: suggest(dict, q, limit) });
  }
  const hits = searchAll(q, limit).flatMap((r) => [...r.headwords, ...r.subentries, ...r.definitions].slice(0, limit));
  return NextResponse.json({ hits: hits.slice(0, limit) });
}
