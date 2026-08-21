# CV

The CV is generated, not hand-written. **Edit `src/data/cv/cv_2.json`** — never
the LaTeX.

```
src/data/cv/            the content
└── cv_2.json           the live CV (the only file you edit)
cv/template/main.tex    the layout: preamble + %%PLACEHOLDER%% per section
cv/assets/avt.jpg       the photo
cv/build/               generated, git-ignored
public/cv.pdf           compiled in CI — the download, git-ignored
public/cv/page-N.png    rasterised pages — what the site renders, git-ignored
```

**Which file is live is decided in one place**, `src/lib/cv-source.mts`. Any file
you add beside it is a valid CV too, so editing the wrong one fails silently —
check that constant before you start. Switching between them means changing it *and* the
static import in `src/lib/cv.ts`; a test fails if only one of the two moves.

The photo prints at 3.2cm, so ~800px is already more than any printer resolves.
It was a 1.26MB PNG once; as an 800px JPEG the whole PDF is 150KB rather than
991KB.

## Editing

```bash
npm run dev        # regenerates the CV, then starts the site — the usual loop
npm run cv:tex     # cv_2.json -> cv/build/main.tex (+ the photo), on its own
npm run cv:pdf     # the above, then compile to public/cv.pdf (needs LaTeX)
npm test           # checks the data and the generated LaTeX
```

Bump `lastUpdated` when you change anything; the site shows it.

## Compiling locally

`npm run dev` compiles the PDF for you when a LaTeX engine is on PATH, so
`/personal/cv/` renders the real document. Tectonic is the easiest to get — no
sudo, and it downloads the packages it needs on first run:

```bash
brew install tectonic
```

`scripts/build-cv-pdf.mts` picks the first of `latexmk`, `pdflatex`, `tectonic`
that exists, in that order: the first two are what CI and Overleaf use, so they
reproduce the deployed PDF exactly.

`scripts/build-cv-images.mts` then rasterises the PDF to `public/cv/` with
`pdftoppm` (`brew install poppler`). The site stacks those images in the
document flow so the whole CV renders at once under the normal page scroll —
an embedded `<object>` cannot do that, because the browser's PDF plugin always
builds its own fixed-height scroll box with its own toolbar.

Without any of them the CV page just says the PDF has not been built — nothing
else breaks. The other two ways to see it:

- **Overleaf** — `npm run cv:tex`, then drag `cv/build/` (two files) into a new
  project.
- **CI** — open a PR and download the `cv-pdf` artifact.

`public/cv.pdf` is git-ignored — the deployed copy always comes from CI, so a
stale local build can never ship.

### The T1 encoding line

The preamble asks for `\usepackage[T1]{fontenc}` on the non-pdfTeX branch. That
is load-bearing: `charter` is a PSNFSS package that only ships T1/OT1 font
definitions, while XeTeX (Tectonic) defaults to TU. Without it there is no
`TUbch.fd`, LaTeX silently substitutes Latin Modern, and the local PDF looks
nothing like the Overleaf one.

## Writing the JSON

Every text field is **plain text**. The renderer escapes LaTeX for you:

| You write | The PDF shows |
| --------- | ------------- |
| `Backend & Integration` | Backend & Integration |
| `get_it` | get_it |
| `2019 – 2023` (en dash) | 2019 – 2023 |
| `a — b` (em dash) | a — b |
| `Flutter · Team size: 4` (middle dot) | Flutter · Team size: 4 |

So do **not** write `\&`, `get\_it` or `--`. A backslash in the JSON ends up
printed literally.

URLs in `href` are the exception — they are passed through as-is so the link
target survives, with only `%` and `#` escaped.

## Layout changes

Section order, spacing and fonts live in `cv/template/main.tex`. The
`%%HEADER%%`, `%%ABOUT_ME%%`, `%%EDUCATION%%`, `%%SKILLS%%`, `%%EXPERIENCE%%`
and `%%PROJECTS%%` placeholders are filled by `src/lib/cv-latex.mts`. A
placeholder with no matching section fails the build rather than printing
`%%AWARDS%%` on the page.

## Compiling

Only CI compiles the PDF, via `xu-cheng/latex-action`:

- **Pull request** — the CV is typeset and uploaded as the `cv-pdf` artifact, so
  a broken `cv_2.json` fails before merge and you can download the result to check
  it.
- **Push to `main`** — the same compile, then the PDF is copied to
  `public/cv.pdf` and deployed with the site at `/personal/cv/`.
