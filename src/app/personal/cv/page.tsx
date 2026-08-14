import type { Metadata } from "next";
import { formatDate, site } from "@/lib/apps";
import { getCv } from "@/lib/cv";
import { routes, withBasePath } from "@/lib/routes";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae for ${site.publisher}.`,
  alternates: { canonical: `${routes.cv}/` },
};

export default function CvPage() {
  const cv = getCv();
  // Plain <a>/<object> markup does not get the base path the way next/link does.
  const file = cv ? withBasePath(cv.url) : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20">
      <div className="flex max-w-2xl flex-col gap-5 pb-12">
        <span className="w-fit rounded-full border border-border-soft px-3 py-1 text-xs text-muted">
          {cv ? `Updated ${formatDate(cv.updated)}` : "Not uploaded yet"}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">CV</h1>
        <p className="text-lg leading-8 text-muted">
          The current curriculum vitae for {site.publisher}.
        </p>
      </div>

      {cv && file ? (
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
              Download ({cv.sizeKb} KB)
            </a>
          </div>

          {/* Inline preview where the browser has a PDF viewer. Mobile browsers
              mostly do not, so the buttons above stay the reliable path. */}
          <object
            data={file}
            type="application/pdf"
            aria-label={`${site.publisher} CV`}
            className="hidden h-[80vh] w-full rounded-2xl border border-border-soft bg-muted-surface md:block"
          >
            <p className="p-6 text-sm text-muted">
              This browser cannot display the PDF inline — use the buttons above.
            </p>
          </object>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-soft px-6 py-16 text-center">
          <p className="text-sm text-muted">
            No CV has been uploaded yet. Add the file at{" "}
            <code className="font-mono text-foreground">public/cv.pdf</code> and it
            appears here on the next build.
          </p>
        </div>
      )}
    </main>
  );
}
