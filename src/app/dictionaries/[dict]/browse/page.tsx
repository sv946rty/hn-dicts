import { redirect } from "next/navigation";
import { getDictionaryDescriptor, routes } from "@/platform/registry";

export default async function BrowseIndex({ params }: PageProps<"/dictionaries/[dict]/browse">) {
  const { dict } = await params;
  const first = getDictionaryDescriptor(dict)?.letters?.[0] ?? "A";
  redirect(routes.browse(dict, first));
}
