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

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex max-w-[68ch] flex-col gap-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-base leading-7 text-muted">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function Bullets({
  items,
  accent,
}: {
  items: string[];
  accent: string;
}) {
  return (
    <ul className="mt-4 flex max-w-[68ch] flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-7 text-muted">
          <span
            aria-hidden
            className="mt-2.5 size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
