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
  updated: string;
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Search apps</span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
          >
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M13.5 13.5 17 17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search apps…"
            className="w-full rounded-xl border border-border-soft bg-surface py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-foreground/30"
          />
        </label>
        <p className="text-sm text-muted">
          {results.length === entries.length
            ? `${entries.length} ${entries.length === 1 ? "app" : "apps"}`
            : `${results.length} of ${entries.length} apps`}
        </p>
      </div>

      {results.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-soft px-6 py-16 text-center text-sm text-muted">
          No app matches “{query}”.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {results.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/${entry.slug}/privacy_policy`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface p-6 transition-colors hover:border-foreground/25"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to bottom,
                      color-mix(in oklab, ${entry.accent} 16%, transparent) 0%,
                      color-mix(in oklab, ${entry.accent} 9%, transparent) 40%,
                      color-mix(in oklab, ${entry.accent} 3%, transparent) 72%,
                      transparent 100%)`,
                  }}
                />

                <span className="relative flex items-start justify-between gap-4">
                  <AppIcon icon={entry.icon} accent={entry.accent} />
                  <span className="mt-1 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground">
                    →
                  </span>
                </span>

                <span className="relative mt-4 block font-semibold tracking-tight">
                  {entry.name}
                </span>
                <span className="relative mt-1.5 block text-sm leading-6 text-muted">
                  {entry.tagline}
                </span>

                <span className="relative mt-5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  {entry.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-md border border-border-soft px-1.5 py-0.5"
                    >
                      {platform}
                    </span>
                  ))}
                  <span className="ml-auto">Updated {entry.updated}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
