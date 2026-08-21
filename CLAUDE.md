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
- **Guides**: one file per guide in `src/data/docs/`. The filename is the URL
  slug; the loader reads the directory, so there is nothing to register. Three
  rules, all enforced by `tests/doc-data.test.ts` — a guide that breaks one
  fails the suite rather than shipping half-done:
  - **Bilingual.** Every reader-visible string is `{ "en": …, "vi": … }`. The
    page carries both languages and switches in the browser, so a missing side
    is a blank on the page, not a fallback to the other language.
  - **Short.** No string over 280 characters. If a point needs more, it wants a
    list, a table or two shorter entries — not a longer paragraph.
  - **Illustrated.** At least one `flow` diagram. Diagrams are data — stages of
    labelled boxes, drawn by `FlowDiagram` — never SVG or markup in the JSON.
  - Section `id`s are language-independent slugs. Switching language re-renders
    in place, so a differing id would drop the reader out of their section.
  - Commands in a `code` block stay the same in both languages. Anything that
    needs explaining goes in the localized `caption`, not a comment in the code.
- **CV**: `src/data/cv/`. Which file in there is live is decided by
  `src/lib/cv-source.mts` — check it before editing, because the others are
  valid CVs too and editing the wrong one changes nothing. The LaTeX in
  `cv/build/` is **generated** — never edit it, and never edit
  `cv/template/main.tex` to change wording.
- Every text field in the CV JSON is **plain text**. The renderer escapes LaTeX
  and converts typography, so write `Backend & Integration`, `get_it` and
  `2019 – 2023` (real en dash), never `\&`, `get\_it` or `--`. A backslash in
  the data ends up printed literally. See [cv/README.md](cv/README.md).

## Sections are numbered — except in the CV

- Guides and privacy policies print `1.`, `2.` … in front of the section
  heading, and the table of contents repeats the same numbers, so a reader can
  always say which section they are in.
- The number is a prop on `Section`, never a CSS counter, and it is derived from
  the same list the contents is built from — on a policy page some sections only
  render for some apps, so counting them twice would drift.
- **The CV is never numbered.** No numbered sections, and the jobs under
  Experience keep their own count, which runs from the oldest role so the
  numbers descend the page. Do not "make it consistent" with the guides.

## Routes

- Every URL is defined in `src/lib/routes.ts`. Use `routes.*`; never hand-write
  a path in a component, a test or the sitemap.
- The site has three top-level sections: `/apps`, `/docs` and `/personal`.
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
