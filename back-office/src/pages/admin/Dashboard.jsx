import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Chart from "../../components/admin/Chart";
import { getStats } from "../../redux/slices/stats";
import { getArtworks } from "../../redux/slices/artwork";
import { getExhibitions } from "../../redux/slices/exhibition";

/*
  "The Register" — a gallery briefing rather than a generic KPI board.

  Three deliberate departures from the stock admin dashboard:
  1. The masthead states the gallery's position as a *sentence* built from the
     data, with the figures below it as a printed register strip. It is the one
     dark, bold block on the page; everything after it stays quiet.
  2. The collection is shown, not just counted. An art gallery dashboard with
     no art on it is the wrong dashboard.
  3. "Needs attention" is derived from real gaps in the data, so the page tells
     you what to do next instead of only what happened.

  Everything rendered here comes from endpoints the app already calls.
*/

/** One figure in the masthead register strip (sits on the dark band). */
const Figure = ({ label, value, unit, caption, emphasis = false }) => (
  <div className="px-6 py-6 lg:px-8">
    <div className="flex items-center gap-2.5">
      <span className="h-px w-5 shrink-0 bg-klein" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/55">
        {label}
      </p>
    </div>
    <p
      className={`mt-5 font-display font-bold leading-none tabular-nums text-paper ${
        emphasis ? "text-5xl lg:text-6xl" : "text-4xl lg:text-5xl"
      }`}
    >
      {value}
      {unit && (
        <span className="ml-2 font-sans text-sm font-semibold text-paper/55">
          {unit}
        </span>
      )}
    </p>
    {caption && (
      <p className="mt-3 text-xs leading-relaxed text-paper/45">{caption}</p>
    )}
  </div>
);

/** Section header shared by the light panels below the masthead. */
const PanelHead = ({ label, title, action }) => (
  <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-5">
    <div>
      <p className="label-cap">{label}</p>
      <h2 className="mt-1.5 font-display text-xl font-bold text-ink">{title}</h2>
    </div>
    {action}
  </div>
);

const viewAll = (to, text) => (
  <Link
    to={to}
    className="group shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone transition-colors hover:text-klein"
  >
    {text}
    <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">
      →
    </span>
  </Link>
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { totalArtists, totalArtworks, artworkStats, orderStats } = useSelector(
    (state) => state.stats
  );
  const { list: artworks } = useSelector((state) => state.artworks);
  const { list: exhibitions } = useSelector((state) => state.exhibitions);

  useEffect(() => {
    dispatch(getStats());
    dispatch(getArtworks());
    dispatch(getExhibitions());
  }, [dispatch]);

  const stats = artworkStats ?? [];

  /* ——— All derived from the data; nothing invented ——— */

  // The category aggregation buckets uncategorised artworks under an undefined
  // key — that bucket is exactly the "needs filing" pile.
  const uncategorised = stats.find((entry) => !entry.category)?.count ?? 0;
  const categoriesInUse = stats.filter((entry) => entry.category).length;

  const paidOrders = orderStats?.totalOrders ?? 0;
  const totalSales = orderStats?.totalSales ?? 0;
  const averageOrder = paidOrders > 0 ? Math.round(totalSales / paidOrders) : null;

  const money = (n) => Number(n ?? 0).toLocaleString("en-US");

  // A Mongo ObjectId begins with its creation timestamp, so ordering by _id
  // descending is a genuine "newest first".
  const latest = [...(artworks ?? [])]
    .sort((a, b) => String(b._id).localeCompare(String(a._id)))
    .slice(0, 4);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const programme = [...(exhibitions ?? [])]
    .map((exhibition) => {
      const date = new Date(exhibition.date);
      const day = new Date(date);
      day.setHours(0, 0, 0, 0);
      const daysUntil = Math.round((day - startOfToday) / 86400000);
      return { ...exhibition, date, daysUntil };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 4);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const attention = [];
  if (categoriesInUse === 0) {
    attention.push({
      key: "no-categories",
      text: "No categories exist yet — an artwork cannot be saved without one.",
      to: "/admin/categories",
      cta: "Add a category",
    });
  }
  if (uncategorised > 0) {
    attention.push({
      key: "uncategorised",
      text: `${uncategorised} artwork${uncategorised === 1 ? "" : "s"} ${
        uncategorised === 1 ? "has" : "have"
      } no category assigned.`,
      to: "/admin/artworks",
      cta: "Review artworks",
    });
  }
  if (totalArtists === 0) {
    attention.push({
      key: "no-artists",
      text: "No artists are represented yet.",
      to: "/admin/artists",
      cta: "Add an artist",
    });
  }
  if (exhibitions?.length === 0) {
    attention.push({
      key: "no-exhibitions",
      text: "Nothing is programmed. The public site has no exhibitions to show.",
      to: "/admin/exhibitions",
      cta: "Plan an exhibition",
    });
  }

  return (
    <div className="animate-fade-up space-y-5">
      {/* ——— Masthead: the one bold block on the page ——— */}
      <section className="bg-ink-deep">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-7 lg:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/55">
            Overview
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">
            {today}
          </p>
        </div>

        {/* The gallery's position, written out of its own numbers */}
        <h1 className="max-w-3xl px-6 pb-9 pt-6 font-display text-3xl font-bold leading-[1.15] text-paper lg:px-8 lg:text-[2.75rem]">
          {totalArtworks ?? 0} work{totalArtworks === 1 ? "" : "s"} by{" "}
          {totalArtists ?? 0} artist{totalArtists === 1 ? "" : "s"}
          {paidOrders > 0 ? (
            <>
              ,{" "}
              <em className="not-italic text-klein">
                {money(totalSales)} DH taken
              </em>{" "}
              across {paidOrders} order{paidOrders === 1 ? "" : "s"}.
            </>
          ) : (
            <>, nothing sold yet.</>
          )}
        </h1>

        <div className="grid grid-cols-1 gap-px border-t border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="bg-ink-deep">
            <Figure
              label="Collection"
              value={totalArtworks ?? 0}
              emphasis
              caption={
                categoriesInUse > 0
                  ? `across ${categoriesInUse} categor${
                      categoriesInUse === 1 ? "y" : "ies"
                    }`
                  : "not yet categorised"
              }
            />
          </div>
          <div className="bg-ink-deep">
            <Figure
              label="Artists"
              value={totalArtists ?? 0}
              caption="represented by the gallery"
            />
          </div>
          <div className="bg-ink-deep">
            <Figure
              label="Paid orders"
              value={paidOrders}
              caption={
                averageOrder !== null
                  ? `${money(averageOrder)} DH average`
                  : "none settled yet"
              }
            />
          </div>
          <div className="bg-ink-deep">
            <Figure
              label="Revenue"
              value={money(totalSales)}
              unit="DH"
              caption="from paid orders"
            />
          </div>
        </div>
      </section>

      {/* ——— The collection, made visible + what needs doing ——— */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <PanelHead
            label="Catalogue"
            title="Latest additions"
            action={viewAll("/admin/artworks", "All artworks")}
          />

          {latest.length === 0 ? (
            <p className="py-12 text-center font-display italic text-stone">
              No artworks in the collection yet.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {latest.map((artwork) => (
                <li key={artwork._id}>
                  <div className="overflow-hidden border border-line bg-surface">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-3 truncate font-display text-sm font-semibold italic text-ink">
                    {artwork.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] uppercase tracking-[0.14em] text-stone">
                    {artwork.artist
                      ? `${artwork.artist.firstName} ${artwork.artist.lastName}`
                      : "—"}
                  </p>
                  <p className="mt-1 text-sm tabular-nums text-ink">
                    {money(artwork.price)} DH
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-6">
          <PanelHead
            label="Needs attention"
            title={attention.length > 0 ? "Loose ends" : "All in order"}
          />

          {attention.length === 0 ? (
            <p className="py-8 font-display italic text-stone">
              Nothing is waiting on you right now.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {attention.map((item) => (
                <li key={item.key} className="flex gap-3 py-4 first:pt-0">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-warning"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm leading-relaxed text-ink">
                      {item.text}
                    </p>
                    <Link
                      to={item.to}
                      className="group mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-klein transition-colors hover:text-klein-deep"
                    >
                      {item.cta}
                      <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ——— What's on + how the collection breaks down ——— */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <PanelHead
            label="Programme"
            title="What's on"
            action={viewAll("/admin/exhibitions", "All exhibitions")}
          />

          {programme.length === 0 ? (
            <p className="py-12 text-center font-display italic text-stone">
              Nothing programmed yet.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {programme.map((exhibition) => {
                const past = exhibition.daysUntil < 0;
                const todayShow = exhibition.daysUntil === 0;
                const chip = past
                  ? "chip-neutral"
                  : todayShow
                  ? "chip-success"
                  : "chip-accent";
                const label = past
                  ? "Closed"
                  : todayShow
                  ? "On view today"
                  : `In ${exhibition.daysUntil} day${
                      exhibition.daysUntil === 1 ? "" : "s"
                    }`;

                return (
                  <li
                    key={exhibition._id}
                    className="flex items-center gap-4 py-4 first:pt-0"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden border border-line bg-surface">
                      <img
                        src={exhibition.image}
                        alt={exhibition.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-stone">
                        {exhibition.date.toDateString()}
                      </p>
                      <p className="mt-0.5 truncate font-display text-base font-semibold italic text-ink">
                        {exhibition.name}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-sm tabular-nums text-ink">
                        {exhibition.quantity}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-stone">
                        tickets
                      </p>
                    </div>
                    <span className={`chip ${chip} shrink-0`}>{label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Chart artworks={stats} />
      </div>
    </div>
  );
};

export default Dashboard;
