import type { Metadata } from "next";
import { DictionaryHome } from "@/dictionaries/dnqatv/DictionaryHome";

export const metadata: Metadata = { title: "Đại Nam Quấc Âm Tự Vị" };

export default function DictionaryPage() {
  return <DictionaryHome />;
}
