"use client";

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search apps…"
        className="w-full rounded-xl border border-border-soft bg-surface py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-foreground/30"
      />
    </label>
  );
}
