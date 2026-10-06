# Historical dictionary platform — V1 prototype design review

Working platform name: **Từ Điển Xưa** (one constant in `src/platform/strings.ts`).
First dictionary: **Đại Nam Quấc Âm Tự Vị**, v024 data, all 7,632 entries and 60,523 subentries live.

## A. Design concept

**The book's ink on a quiet desk.** The platform is a neutral, almost silent shell (warm grey, one sans for UI). Each dictionary brings its own paper and ink: for DNQATV that is ivory paper, brown for headwords, Hán/Nôm and rules, and Noto Serif for text, the same family the 2026 edition uses. Search is the first thing on the page; the entry is a column of dictionary text, not a stack of cards. Everything scholarly (character metadata, raw source, page image, corrections) is one click away and silent until asked for.

## B. Information architecture

```
Platform  /                       search-first home (today: opens straight into DNQATV)
  Collection  /dictionaries        shelf list; Taberd shown as "Sắp có", name only
  Dictionary  /dictionaries/dnqatv                home: title, search, A–X, doors
    Entry     /dictionaries/dnqatv/entries/A-001  #s3 = subentry 3
    Browse    /dictionaries/dnqatv/browse/T
    Search    /dictionaries/dnqatv/search?q=nước
    About     /dictionaries/dnqatv/about
  Search all  /search?q=nước                      grouped by dictionary
  Characters  /characters  (?radical=85)          platform-level, keyed by code point
    Character /characters/U+963F                  "appears in" grouped by dictionary
```

- **Every dictionary URL names its dictionary**, and entry ids are the v024 ids, so links and citations survive new dictionaries and redesigns.
- **Characters are platform entities**, not DNQATV pages. `characters.json` stores occurrences per dictionary slug; a second dictionary adds occurrences, not new pages.
- **Source is a property of the entry**, reached from the entry (right column on desktop, sheet on phone), never a separate destination you get lost in.
- **Landing decision:** `/` opens directly into DNQATV's home (with one line linking to the collection). With one dictionary, a collection landing page would be an empty extra click before typing. The address `/` stays the platform's: when a second dictionary arrives, `/` becomes the cross-dictionary search home and `/dictionaries/dnqatv` keeps this page. No URL changes.

## C. Search model

- One box, always reachable: on the home page it is the hero; elsewhere it sits in the top bar (second row on phones). `/` focuses it from anywhere.
- Type-ahead shows 8 suggestions (keyboard ↑↓ Enter); Enter without a selection opens the full results page.
- Matching: tone marks optional (`nuoc` finds Nước); if you type marks, exact spellings rank first and tone-insensitive headword matches are labelled "khác dấu". Typing Hán/Nôm searches characters (`學`). Matching never changes displayed text.
- Results are grouped by **where** the match is: Mục từ (headwords), Trong từ ngữ (subentries, shown with their parent entry), Trong lời giải (definitions, excerpted around the match). Subentries that simply belong to the matched headword are summarised in one line ("80 từ ngữ … nằm trong mục Nước") instead of flooding the list.
- Scope is explicit: "Tìm trong: Từ điển này · Tất cả từ điển". `/search` already renders results as one section per dictionary; it shows only DNQATV because only DNQATV exists. Later: one result section per dictionary, then a "same headword across dictionaries" view built on the same grouping.
- Implementation is deliberately throwaway: an in-memory scan (`src/lib/data/search.ts`). The `SearchResult` shape is the contract; Postgres full-text or a search service can replace the module.

## D. Entry model

Hierarchy, top to bottom: **headword** (largest, brown) with its **Hán/Nôm** opposite it, then the printed **type mark** (`c.`, `n.`, `c. n.`, with its meaning from the book's own "Dấu riêng"), the **reading note** if any, the **definition**, then **Từ ngữ** (subentries).

- Subentries keep the book's structure: a hanging column of Hán/Nôm, then the term in bold and the definition run on, as in the print. No cards.
- Italics come back: v024's plain `definition` loses the print's italic examples, so the build recovers them from `raw` *only when the raw text reproduces the definition exactly* (1,276 subentries, 85 entries).
- **"Dạng in"** toggles every subentry to its printed form (`| 意 ― ý`), showing the ― placeholder and the typographic bar exactly as `layout.source_display` records them. Default is the expanded `term`, which reads better for people new to the book.
- Each subentry has its own anchor (`#s12`), so search results land on the matched line and it briefly highlights.
- Desktop adds a left column of neighbouring entries (the "open book" view) and ←/→ keys step through the dictionary.

## E. Hán/Nôm model

- Every confirmed character is a link. Clicking one in an entry swaps the right-hand panel (desktop) or opens a sheet (phone) with: glyph, code point, radical, strokes, IDS composition with clickable components, and how often it appears. Unihan fields, IDS source and font support sit under a closed "Dữ liệu nghiên cứu". "Mở trang chữ" leads to the full character page. Ordinary readers never have to open any of it.
- **Uncertainty stays visible:**
  - `image_only` (23 headwords): the glyph image from the printed source with the edition's `*`, an explanation in plain Vietnamese, never a substitute character. No character page is offered, because there is no character identity to give it.
  - `pua` (31 headwords): rendered with Nom Na Tong (the only font that has them), labelled "Mã riêng (PUA)" with the code point, and not linked as a shared character, since a private-use code point is not a shared identity.
- Fonts: subsets of Nom Na Tong (primary) and BabelStone Han (only for the 152 characters Nom Na Tong lacks), the same pairing as the PDF. 1.3 MB total; `public/fonts/coverage.json` records the 4 code points neither font covers.
- `/characters` adds a radical index (207 radicals → characters by residual strokes) and a visible list of the 54 headwords without a standard code point.

## F. Historical identity preserved

Title in its own orthography and line break (ĐẠI NAM / QUẤC ÂM TỰ VỊ), 大南國音字彙, author as printed, 1895–1896, the letter order of the book (Y between H and K), brown headwords/Hán/Nôm/rules on warm paper, the printed type marks unchanged, italic examples, the ― and | conventions (via "Dạng in"), the `*` image marker, the 1895 cover and verbatim Tiểu tự quotations on the About page, and a page image of the 2026 edition from the source panel. No historical spelling, wording or glyph is altered anywhere.

## G. Modernised on purpose

Search that forgives missing tone marks; subentries shown with the headword expanded by default; one reading column with comfortable measure (≈ 44rem) and 1.65–1.7 line height; a separate neutral platform chrome; sans-serif UI text; dark mode; keyboard navigation and visible focus; touch-sized targets; citations copyable in one click; stable, citable URLs.

## H. Adding Taberd (or a fifth dictionary)

1. Add a descriptor in `src/platform/registry.ts` (slug, title in its own orthography, letters in its own order, theme key).
2. Add a palette block `[data-dict="taberd"] { … }` in `globals.css`.
3. Write a build step that maps its data into the `Entry` shape (`src/lib/data/types.ts`) and register it in `src/lib/data/dictionaries.ts`; its characters merge into `characters.json` under its slug.
4. Give it a home/About module like `src/dictionaries/dnqatv/`.

Routes, search, browse, entry layout, character pages, the switcher and collection need no redesign. If Taberd entries carry Latin glosses or other fields DNQATV lacks, they become optional fields on `Entry` with their own rendering block.

## I. Translation to the future native app

| Area | Web V1 | Native app |
|---|---|---|
| Home/Search | Hero search on the dictionary home; top-bar box elsewhere; `/` shortcut | Opens with the keyboard up on the search field; recent entries below |
| Search results | Grouped list (headwords / subentries / definitions), scope line | Same groups as sections; scope as a segmented control |
| Dictionary entry | Centre column; neighbours left; tools right | One column; character and source as bottom sheets (already how the phone web works); swipe for previous/next instead of ←/→ |
| Hán/Nôm detail | Side panel, then full character page | Bottom sheet (half height), expand to full screen for the character page |
| Browse | Sticky alphabet with counts, prefix jumps, in-letter filter | Section index on the screen edge, as in Contacts |
| Historical source | Right-column panel, page preview dialog | "Nguồn" sheet; page image pinch-zoomable |
| Dictionary selection | Quiet switcher next to the platform name | Tab or header menu; per-dictionary theme applied the same way (tokens per dictionary) |

Shared across both: the URL scheme (deep links), the `Entry`/`CharacterRecord`/`SearchResult` shapes, the vocabulary in `strings.ts`, the per-dictionary colour tokens, and the "recent" record shape (dictionary + entry id), which the app can later sync.

## J. V2 recommendations

1. **Check the 199 "lost first letter" definitions** listed in `docs/data-observations.md` (e.g. Đa: `hiều; thêm nhiều.`); it looks like a `c. n.` repair rule over-firing. This is the most important finding from the build.
2. Decide the **default subentry form** (expanded term vs printed `―` form) with a few real readers; consider a lower-case expansion in the data.
3. **Historical spelling variants in search** (Quấc/Quốc, quiền/quyền, ui/uy, i/y), as a find-only rule table.
4. A **real search index** (Postgres FTS or similar) with ranking tuned on query logs.
5. **All 1,038 page images** (or PDF page links) so every entry has "Xem trang", and original scan crops for the 23 image-only glyphs.
6. Character pages: add Unihan readings and Nôm Foundation readings where the project has authoritative sources; consider metadata for subentry characters.
7. Saved entries and lists (needs accounts), then the cross-dictionary "same headword" view once Taberd is in.
8. An English UI option for international researchers (all copy is already in one file).
