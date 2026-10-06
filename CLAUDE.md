# Notes for agents

* Single Next.js 16 app (App Router). Read `AGENTS.md` before changing Next.js code: this version differs from older training data (async `params`, `PageProps`/`LayoutProps` globals, Turbopack).
* `data/sources/**` holds inputs exactly as supplied. Never edit them; fix data in the master JSON upstream and replace the file.
* Never change displayed dictionary text, orthography or Hán/Nôm in UI code. Search may normalise; display may not. Image-only glyphs are never replaced by look-alike characters.
* The repository is private; do not deploy or publish pages without the owner's go-ahead.
* Before pushing: `npm run lint && npm run typecheck && npm run build`.
