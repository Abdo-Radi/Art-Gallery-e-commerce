/*
  Collection by category.

  One measure (a count) across categories, so the job is magnitude comparison —
  a ranked horizontal bar reads that far better than a donut, and a single
  measure means a single hue rather than a categorical palette. Drawn in plain
  HTML so the marks sit exactly on the design system's grid and palette.
*/
const Chart = ({ artworks = [] }) => {
  const rows = [...artworks]
    .map((el) => ({
      name: el.category?.name ?? "Uncategorized",
      count: el.count ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const max = rows.reduce((peak, row) => Math.max(peak, row.count), 0);

  return (
    <div className="panel p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="label-cap">Collection</p>
          <h2 className="mt-1.5 font-display text-xl font-bold text-ink">
            Artworks by category
          </h2>
        </div>
        <p className="text-sm text-stone">
          <span className="font-display text-lg font-semibold tabular-nums text-ink">
            {total}
          </span>{" "}
          total
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="py-14 text-center font-display italic text-stone">
          No artworks to chart yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.map((row) => {
            const share = total > 0 ? Math.round((row.count / total) * 100) : 0;
            const width = max > 0 ? (row.count / max) * 100 : 0;

            return (
              <li
                key={row.name}
                className="group"
                title={`${row.name}: ${row.count} artworks (${share}%)`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="truncate text-sm text-ink">{row.name}</span>
                  <span className="shrink-0 text-sm tabular-nums text-stone">
                    <span className="font-semibold text-ink">{row.count}</span>
                    <span className="ml-2 text-stone-light">{share}%</span>
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-surface">
                  <div
                    className="h-full bg-klein transition-all duration-500 group-hover:bg-klein-deep"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Chart;
