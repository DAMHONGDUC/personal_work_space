export function Section({
  id,
  title,
  accent,
  children,
}: {
  id: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-center gap-2.5 pb-5 text-xl font-semibold tracking-tight">
        <span
          aria-hidden
          className="h-4 w-1 rounded-full"
          style={{ backgroundColor: accent }}
        />
        {title}
      </h2>
      {children}
    </section>
  );
}
