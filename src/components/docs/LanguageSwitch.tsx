"use client";

import { LANGUAGES, LANGUAGE_LABELS, type Lang } from "@/lib/doc-model";

/**
 * Segmented control for the language a guide is read in. Both versions are
 * already on the page, so switching is a re-render — no navigation, and the
 * section you were reading stays under the cursor.
 */
export function LanguageSwitch({
  lang,
  onChange,
  accent,
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
  accent: string;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex w-fit items-center gap-1 rounded-xl border border-border-soft bg-surface p-1"
    >
      {LANGUAGES.map((option) => {
        const isActive = option === lang;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            title={LANGUAGE_LABELS[option]}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium uppercase transition-colors ${
              isActive ? "" : "text-muted hover:text-foreground"
            }`}
            style={
              isActive
                ? {
                    backgroundColor: `color-mix(in oklab, ${accent} 16%, transparent)`,
                    color: accent,
                  }
                : undefined
            }
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
