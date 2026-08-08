"use client";

import { useActiveSection } from "@/hooks/useActiveSection";

export type NavItem = { id: string; title: string };

/**
 * Table of contents that tracks the section currently in view. Rendered in the
 * sidebar on desktop and inside a collapsed <details> on smaller screens.
 */
export function PolicyNav({
  items,
  accent,
}: {
  items: NavItem[];
  accent: string;
}) {
  const active = useActiveSection(items.map((item) => item.id));

  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const isActive = item.id === active;

        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`-ml-px flex border-l py-1 pl-4 text-sm leading-6 transition-colors ${
                isActive
                  ? "font-medium text-foreground"
                  : "border-transparent text-muted hover:border-foreground/25 hover:text-foreground"
              }`}
              style={isActive ? { borderColor: accent } : undefined}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
