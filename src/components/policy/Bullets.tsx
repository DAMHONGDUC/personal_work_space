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
