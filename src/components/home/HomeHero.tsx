export function HomeHero({
  publisher,
  appCount,
}: {
  publisher: string;
  appCount: number;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-5 pb-14">
      <span className="w-fit rounded-full border border-border-soft px-3 py-1 text-xs text-muted">
        {appCount} {appCount === 1 ? "app" : "apps"}
      </span>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Privacy policies
      </h1>
      <p className="text-lg leading-8 text-muted">
        Every app published by {publisher} has its own privacy policy, hosted at a
        permanent address. Pick an app below to read its policy.
      </p>
    </div>
  );
}
