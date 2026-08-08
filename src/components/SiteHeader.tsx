import Link from "next/link";

/**
 * Sticky top bar with the publisher name and a contact link.
 *
 * The background is driven entirely by CSS (see `.site-header` in globals.css):
 * solid by default, and transparent only at the very top of the page where a
 * scroll-driven animation is supported, so a hero gradient can run through it
 * as one unbroken block. No client JavaScript is involved, so it cannot end up
 * stuck transparent if hydration or an animation stalls.
 */
export function SiteHeader({
  publisher,
  contactEmail,
}: {
  publisher: string;
  contactEmail: string;
}) {
  return (
    <header className="site-header sticky top-0 z-20 border-b">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background transition-transform duration-200 group-hover:-rotate-6"
          >
            P
          </span>
          {publisher}
        </Link>
        <a
          href={`mailto:${contactEmail}`}
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
