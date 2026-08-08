type Tone = "warn" | "ok" | "neutral" | "strong";

const TONES: Record<Tone, string> = {
  warn: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  neutral: "bg-muted-surface text-muted",
  strong: "bg-foreground/10 text-foreground",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
