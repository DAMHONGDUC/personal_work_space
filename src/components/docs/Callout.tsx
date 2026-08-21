import type { NoteBlock } from "@/lib/doc-model";

const TONES = {
  info: { icon: "ℹ️", color: "#0ea5e9", label: "Lưu ý" },
  warning: { icon: "⚠️", color: "#f59e0b", label: "Cảnh báo" },
} as const;

/** A note pulled out of the flow of the text, tinted by how loud it needs to be. */
export function Callout({ block }: { block: NoteBlock<string> }) {
  const tone = TONES[block.tone];

  return (
    <aside
      className="mt-5 flex max-w-[68ch] gap-3.5 rounded-xl border px-4 py-3.5"
      style={{
        borderColor: `color-mix(in oklab, ${tone.color} 32%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${tone.color} 8%, transparent)`,
      }}
    >
      <span aria-hidden className="text-base leading-7">
        {tone.icon}
      </span>
      <div className="flex flex-col gap-2">
        <span className="sr-only">{tone.label}: </span>
        {block.body.map((paragraph, index) => (
          <p key={index} className="text-sm leading-6">
            {paragraph}
          </p>
        ))}
      </div>
    </aside>
  );
}
