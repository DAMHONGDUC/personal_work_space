import Link from "next/link";
import { routes } from "@/lib/routes";

const NAV = [
  { href: routes.apps, label: "Privacy policies" },
  { href: routes.cv, label: "CV" },
];

/**
 * Sticky top bar with the publisher name, the two top-level sections and a
 * contact link.
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
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-6 px-6">
        <Link
          href={routes.home}
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background transition-transform duration-200 group-hover:-rotate-6"
          >
            {publisher.trim().charAt(0).toUpperCase()}
          </span>
          {publisher}
        </Link>

        <nav className="flex items-center gap-5 text-sm text-muted">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`mailto:${contactEmail}`}
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
