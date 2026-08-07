"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/AppIcon";

export type DirectoryEntry = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  accent: string;
  platforms: string[];
};

export function AppDirectory({ entries }: { entries: DirectoryEntry[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(q) ||
        entry.slug.toLowerCase().includes(q) ||
        entry.tagline.toLowerCase().includes(q),
    );
  }, [entries, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Search apps</span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          >
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search apps…"
            className="w-full rounded-xl border border-border-soft bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-foreground/30"
          />
        </label>
        <p className="text-sm text-muted">
          {results.length} of {entries.length} apps
        </p>
      </div>

      {results.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-soft px-6 py-12 text-center text-sm text-muted">
          No app matches “{query}”.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {results.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/${entry.slug}/privacy_policy`}
                className="group flex h-full gap-4 rounded-2xl border border-border-soft bg-surface p-5 transition-colors hover:border-foreground/25"
              >
                <AppIcon icon={entry.icon} accent={entry.accent} />
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="font-semibold tracking-tight">{entry.name}</span>
                  <span className="text-sm leading-6 text-muted">{entry.tagline}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    {entry.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-md bg-muted-surface px-1.5 py-0.5"
                      >
                        {platform}
                      </span>
                    ))}
                    <span className="ml-auto whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                      Read →
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
