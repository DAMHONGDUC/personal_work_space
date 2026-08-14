import type { Metadata } from "next";
import { formatDate, site } from "@/lib/apps";
import { cv, getCvPdf } from "@/lib/cv";
import { routes, withBasePath } from "@/lib/routes";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae for ${cv.header.name}.`,
  alternates: { canonical: `${routes.cv}/` },
};

export default function CvPage() {
  const pdf = getCvPdf();
  // Plain <a>/<object> markup does not get the base path the way next/link does.
  const file = pdf ? withBasePath(pdf.url) : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20">
      <div className="flex max-w-2xl flex-col gap-5 pb-12">
        <span className="w-fit rounded-full border border-border-soft px-3 py-1 text-xs text-muted">
          Updated {formatDate(cv.lastUpdated)}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">CV</h1>
        <p className="text-lg leading-8 text-muted">
          The current curriculum vitae for {site.publisher}, typeset with LaTeX from{" "}
          <code className="font-mono text-base text-foreground">src/data/cv.json</code>.
        </p>
      </div>

      {pdf && file ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={file}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border-soft bg-surface px-3.5 py-2 text-sm transition-colors hover:border-foreground/25"
            >
              Open PDF ↗
            </a>
            <a
              href={file}
              download
              className="rounded-lg border border-border-soft bg-surface px-3.5 py-2 text-sm transition-colors hover:border-foreground/25"
            >
              Download ({pdf.sizeKb} KB)
            </a>
          </div>

          {/* Inline preview where the browser has a PDF viewer. Mobile browsers
              mostly do not, so the buttons above stay the reliable path.

              The #toolbar=0 fragment asks the viewer to drop its own chrome —
              the download, print and zoom bar — so the page reads as a document
              rather than an editor. Chromium and Acrobat honour it; Firefox and
              Safari ignore it and keep their toolbar, which is why the buttons
              above exist rather than relying on the viewer's. */}
          <div className="hidden overflow-hidden rounded-2xl border border-border-soft bg-[#25262b] md:block">
            <object
              data={`${file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              aria-label={`${cv.header.name} CV`}
              className="block h-[88vh] w-full"
            >
              <p className="p-6 text-sm text-muted">
                This browser cannot display the PDF inline — use the buttons above.
              </p>
            </object>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-soft px-6 py-16 text-center">
          <p className="text-sm text-muted">
            The PDF has not been built yet. CI compiles it on every push; to build
            it here, run{" "}
            <code className="font-mono text-foreground">npm run cv:pdf</code> (needs
            a local LaTeX installation).
          </p>
        </div>
      )}
    </main>
  );
}
