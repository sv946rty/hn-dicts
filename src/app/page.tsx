import { DictionaryHome } from "@/dictionaries/dnqatv/DictionaryHome";

// With one available dictionary, the fastest path to a word is to open
// straight into it. "/" stays the platform's address: when a second
// dictionary arrives it becomes the collection's search home, while
// /dictionaries/dnqatv keeps serving this page.
export default function Home() {
  return (
    <div data-dict="dnqatv" className="flex flex-1 flex-col bg-bg text-ink">
      <DictionaryHome showPlatform />
    </div>
  );
}
