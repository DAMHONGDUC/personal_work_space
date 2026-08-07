"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * At the top of the page the bar is fully transparent, so a page's hero tint
 * runs through it as one unbroken block. Once you scroll it turns into frosted
 * glass to keep the content behind it legible.
 *
 * The state comes from an IntersectionObserver on a sentinel pinned to the top
 * of the document rather than from window.scrollY, which does not update under
 * this page's html/body height rules.
 */
export function SiteHeader({
  publisher,
  contactEmail,
}: {
  publisher: string;
  contactEmail: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sentinel.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Absolutely positioned so it marks the top of the document without
          taking up any layout space. */}
      <div
        ref={sentinel}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-4 w-px"
      />

      <header
        className={`sticky top-0 z-20 border-b transition-colors duration-300 ${
          scrolled
            ? "border-border-soft/60 bg-background/85 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/55"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span
              aria-hidden
              className="flex size-7 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background"
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
    </>
  );
}
