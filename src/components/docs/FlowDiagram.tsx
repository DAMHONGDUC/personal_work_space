import type { FlowBlock } from "@/lib/doc-model";

/**
 * A diagram drawn from the data in a `flow` block: each stage is a row of boxes,
 * with an arrow down to the next one. One box per stage reads as a pipeline;
 * several boxes feeding a single one reads as a join, which is how the signing
 * pieces actually fit together.
 *
 * It is laid out with flexbox rather than an SVG so the labels wrap and stay
 * selectable, and so it survives a narrow phone without a viewBox to fight.
 */
export function FlowDiagram({
  block,
  accent,
}: {
  block: FlowBlock<string>;
  accent: string;
}) {
  return (
    <figure className="mt-5 flex max-w-[68ch] flex-col gap-3 rounded-2xl border border-border-soft bg-muted-surface p-5 sm:p-6">
      <div className="flex flex-col items-stretch gap-2">
        {block.stages.map((stage, stageIndex) => (
          <div key={stageIndex} className="flex flex-col items-stretch gap-2">
            {stageIndex > 0 && (
              <span aria-hidden className="text-center text-sm leading-none text-muted">
                ↓
              </span>
            )}

            <div className="grid gap-2 sm:auto-cols-fr sm:grid-flow-col">
              {stage.items.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 rounded-xl border bg-surface px-4 py-3"
                  style={{
                    borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
                    backgroundColor: `color-mix(in oklab, ${accent} 6%, var(--surface))`,
                  }}
                >
                  <span className="text-sm font-medium leading-6">{item.label}</span>
                  {item.detail && (
                    <span className="text-xs leading-5 text-muted">{item.detail}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {block.caption && (
        <figcaption className="text-xs leading-5 text-muted">{block.caption}</figcaption>
      )}
    </figure>
  );
}
