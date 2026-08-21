import type { TableBlock } from "@/lib/doc-model";

export function DocTable({
  block,
  accent,
}: {
  block: TableBlock<string>;
  accent: string;
}) {
  return (
    // Scrolls inside its own box, so a wide table never makes the page scroll.
    <div className="mt-5 max-w-[68ch] overflow-x-auto rounded-xl border border-border-soft">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-muted-surface">
            {block.columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-border-soft px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row[0]} className="border-b border-border-soft last:border-0">
              {row.map((cell, index) => (
                <td
                  key={index}
                  className={
                    index === 0
                      ? "px-4 py-3 align-top font-medium"
                      : "px-4 py-3 align-top leading-6 text-muted"
                  }
                  style={index === 0 ? { color: accent } : undefined}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
