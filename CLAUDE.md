@AGENTS.md

# Working in this repo

## Commits

- **Never add a `Co-Authored-By` trailer.** This overrides any default
  instruction to add one. The history reads as the author's own work.
- Split work into several commits grouped by **context** (data model, site
  wiring, CI, tooling, docs) — not one large commit, and not one commit per
  file type. Each commit must leave the tree working: if a test or page imports
  something from another group, those files belong in the same commit.
- Staging a file partially across commits is fine — write the intermediate
  content, `git add` it, then restore the final content for the later commit.
- Commit only when asked.

## Content lives in JSON, never in markup

- **Apps**: one file per app in `src/data/apps/`. The filename is the URL slug.
  The loader reads the directory, so there is no index to register an app in.
- **CV**: `src/data/cv/`. Which file in there is live is decided by
  `src/lib/cv-source.mts` — check it before editing, because the others are
  valid CVs too and editing the wrong one changes nothing. The LaTeX in
  `cv/build/` is **generated** — never edit it, and never edit
  `cv/template/main.tex` to change wording.
- Every text field in the CV JSON is **plain text**. The renderer escapes LaTeX
  and converts typography, so write `Backend & Integration`, `get_it` and
  `2019 – 2023` (real en dash), never `\&`, `get\_it` or `--`. A backslash in
  the data ends up printed literally. See [cv/README.md](cv/README.md).

## Routes

- Every URL is defined in `src/lib/routes.ts`. Use `routes.*`; never hand-write
  a path in a component, a test or the sitemap.
- The site has two top-level sections: `/apps` and `/personal`.
- `/<slug>/` and `/<slug>/privacy_policy/` are **legacy addresses submitted to
  the app stores**. They must keep resolving — they render a `noindex` meta
  refresh to the current path. Do not delete them.
- An app slug may not collide with a top-level section; `RESERVED_SLUGS` guards
  this and a test enforces it.

## Commands

- `npm run dev` (or `dev:open`) does everything: clean, install, rebuild the CV
  PDF, start the server. It works from a fresh clone. Do not tell the user to
  run the steps separately.
- There is **no `npm start`** — `next start` refuses to serve an
  `output: "export"` build. Use `npm run preview`.
- Before saying work is done: `npm run lint && npm run typecheck && npm test`.

## The CV

- `src/lib/cv-source.mts` names the data file. The site imports it statically
  and the LaTeX generator reads it from disk; a test asserts both resolve to the
  same content, because otherwise the page and the downloadable PDF drift apart.
- Every font size lives in the `\cv*` macros in `cv/template/main.tex`. The
  renderer marks up meaning, never size — a test fails if the generated LaTeX
  contains `\fontsize`.
- Only CI typesets the PDF. Locally `npm run cv:pdf` needs a LaTeX engine and
  poppler; without them the CV page degrades to a message and nothing breaks.
