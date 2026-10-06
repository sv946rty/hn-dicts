import { NextResponse } from "next/server";
import { characterView } from "@/lib/data/characters";

export async function GET(_req: Request, ctx: RouteContext<"/api/characters/[cp]">) {
  const { cp } = await ctx.params;
  const view = characterView(decodeURIComponent(cp));
  if (!view) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(view);
}
