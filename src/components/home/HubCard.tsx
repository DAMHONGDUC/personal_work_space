import Link from "next/link";

type Props = {
  href: string;
  icon: string;
  accent: string;
  title: string;
  description: string;
  /** Short status line in the footer, e.g. an item count or a date. */
  meta: string;
};

/** One of the two top-level sections on the landing page. */
export function HubCard({ href, icon, accent, title, description, meta }: Props) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface p-7 transition-colors hover:border-foreground/25"
    >
      {/* Same top-down tint as the app cards, so the two levels read as one set. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to bottom,
            color-mix(in oklab, ${accent} 16%, transparent) 0%,
            color-mix(in oklab, ${accent} 9%, transparent) 40%,
            color-mix(in oklab, ${accent} 3%, transparent) 72%,
            transparent 100%)`,
        }}
      />

      <span className="relative flex items-start justify-between gap-4">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl border text-2xl"
          style={{
            backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)`,
            borderColor: `color-mix(in oklab, ${accent} 28%, transparent)`,
          }}
        >
          {icon}
        </span>
        <span className="mt-1 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground">
          →
        </span>
      </span>

      <span className="relative mt-5 block text-lg font-semibold tracking-tight">
        {title}
      </span>
      <span className="relative mt-2 block text-sm leading-6 text-muted">
        {description}
      </span>

      <span className="relative mt-6 block text-xs text-muted">{meta}</span>
    </Link>
  );
}
