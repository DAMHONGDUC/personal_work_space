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
