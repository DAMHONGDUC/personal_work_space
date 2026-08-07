type Props = {
  icon: string;
  accent: string;
  size?: "sm" | "lg";
};

export function AppIcon({ icon, accent, size = "sm" }: Props) {
  const box = size === "lg" ? "size-16 text-3xl rounded-2xl" : "size-11 text-xl rounded-xl";

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center border border-border-soft ${box}`}
      style={{
        backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)`,
        borderColor: `color-mix(in oklab, ${accent} 28%, transparent)`,
      }}
    >
      {icon}
    </span>
  );
}
