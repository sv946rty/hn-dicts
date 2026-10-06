import { notFound } from "next/navigation";
import { getDictionaryDescriptor } from "@/platform/registry";

// Every page under /dictionaries/[dict] takes on that dictionary's identity
// (palette, paper) through data-dict; the platform shell above stays neutral.
export default async function DictionaryLayout({ children, params }: LayoutProps<"/dictionaries/[dict]">) {
  const { dict } = await params;
  const d = getDictionaryDescriptor(dict);
  if (!d || d.status !== "available") notFound();
  return (
    <div data-dict={d.theme} className="flex flex-1 flex-col bg-bg text-ink">
      {children}
    </div>
  );
}

export function generateStaticParams() {
  return [{ dict: "dnqatv" }];
}
