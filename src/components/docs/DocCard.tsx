import Link from "next/link";
import { AppIcon } from "@/components/AppIcon";
import type { Lang, ResolvedDoc } from "@/lib/doc-model";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";

/**
 * One guide in the index. The sections are listed as their own links, so the
 * index doubles as a table of contents and you can jump straight to the part you
 * came for instead of opening the guide and hunting for it.
 */
export function DocCard({ doc, lang }: { doc: ResolvedDoc; lang: Lang }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border-soft bg-surface">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background: `linear-gradient(to bottom,
            color-mix(in oklab, ${doc.accent} 10%, transparent) 0%,
            transparent 100%)`,
        }}
      />

      <div className="relative flex flex-col gap-6 p-7">
        <div className="flex items-start gap-5">
          <AppIcon icon={doc.icon} accent={doc.accent} size="lg" />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border-soft px-2 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              <Link href={routes.doc(doc.slug)} className="transition-opacity hover:opacity-70">
                {/* Stretches over the whole card so the title is the click target
                    everywhere the section links are not. */}
                <span aria-hidden className="absolute inset-0" />
                <span lang={lang}>{doc.title}</span>
              </Link>
            </h2>
            <p lang={lang} className="text-sm leading-6 text-muted">
              {doc.tagline}
            </p>
          </div>
        </div>

        <div className="relative flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Jump to a section
          </p>
          <ul className="flex flex-wrap gap-2">
            {doc.sections.map((section, index) => (
              <li key={section.id}>
                <Link
                  href={`${routes.doc(doc.slug)}#${section.id}`}
                  lang={lang}
                  className="relative flex items-center gap-2 rounded-lg border border-border-soft bg-background px-3 py-1.5 text-sm transition-colors hover:border-foreground/25"
                >
                  <span aria-hidden className="text-xs text-muted">
                    {index + 1}
                  </span>
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted">
          {doc.sections.length} sections · {doc.readingTime} · Updated{" "}
          {formatDate(doc.lastUpdated)}
        </p>
      </div>
    </article>
  );
}
