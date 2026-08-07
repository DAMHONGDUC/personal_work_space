"use client";

import { useEffect, useState } from "react";

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
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]) setActive(visible[0].target.id);
      },
      // Ignore the band under the sticky header, and only count a section once
      // it has reached the upper third of the viewport.
      { rootMargin: "-88px 0px -65% 0px" },
    );

    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

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
