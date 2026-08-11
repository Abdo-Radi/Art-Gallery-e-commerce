import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CardDataStats from "../../components/admin/CardDataStats";
import Chart from "../../components/admin/Chart";
import { getStats } from "../../redux/slices/stats";

const shortcuts = [
  {
    name: "Artworks",
    to: "/admin/artworks",
    icon: "ri-paint-brush-line",
    hint: "Add and edit the collection",
  },
  {
    name: "Exhibitions",
    to: "/admin/exhibitions",
    icon: "ri-gallery-line",
    hint: "Programme and ticketing",
  },
  {
    name: "Orders",
    to: "/admin/orders",
    icon: "ri-shopping-basket-2-line",
    hint: "Sales and fulfilment",
  },
  {
    name: "Artists",
    to: "/admin/artists",
    icon: "ri-user-star-line",
    hint: "Represented artists",
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();

  const { totalArtists, totalArtworks, artworkStats, orderStats } = useSelector(
    (state) => state.stats
  );

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">Overview</p>
          <h1 className="page-title">Dashboard</h1>
        </div>
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <CardDataStats title="Artists" total={totalArtists}>
          <i className="ri-user-star-line" />
        </CardDataStats>
        <CardDataStats title="Artworks" total={totalArtworks}>
          <i className="ri-paint-brush-line" />
        </CardDataStats>
        <CardDataStats title="Paid orders" total={orderStats?.totalOrders ?? 0}>
          <i className="ri-shopping-basket-2-line" />
        </CardDataStats>
        <CardDataStats
          title="Total sales"
          total={orderStats?.totalSales ?? 0}
          unit="DH"
        >
          <i className="ri-line-chart-line" />
        </CardDataStats>
      </div>

      {/* Breakdown + shortcuts */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Chart artworks={artworkStats} />
        </div>

        <div className="panel p-6">
          <div className="border-b border-line pb-5">
            <p className="label-cap">Shortcuts</p>
            <h2 className="mt-1.5 font-display text-xl font-bold text-ink">
              Jump to
            </h2>
          </div>
          <ul className="mt-2 divide-y divide-line">
            {shortcuts.map((shortcut) => (
              <li key={shortcut.to}>
                <Link
                  to={shortcut.to}
                  className="group flex items-center gap-4 py-4 transition-colors"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-surface text-base text-stone transition-colors group-hover:border-klein group-hover:text-klein">
                    <i className={shortcut.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-klein">
                      {shortcut.name}
                    </span>
                    <span className="block truncate text-xs text-stone">
                      {shortcut.hint}
                    </span>
                  </span>
                  <i className="ri-arrow-right-line text-stone transition-transform group-hover:translate-x-1 group-hover:text-klein" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
