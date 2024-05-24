import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CardDataStats from "../../components/admin/CardDataStats";
import Chart from "../../components/admin/Chart";
import { getStats } from "../../redux/slices/stats";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { totalArtists, totalArtworks, artworkStats, orderStats } = useSelector(
    (state) => state.stats
  );

  useEffect(() => {
    dispatch(getStats());
  }, []);

  return (
    <div>
      <div className="mb-4.5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total artists" total={totalArtists}>
          <i className="ri-user-line text-primary text-xl"></i>
        </CardDataStats>
        <CardDataStats title="Total artworks" total={totalArtworks}>
          <i className="ri-paint-brush-line text-primary text-xl"></i>
        </CardDataStats>
        <CardDataStats title="Total orders" total={orderStats.totalOrders}>
          <i className="ri-shopping-basket-2-line text-primary text-xl"></i>
        </CardDataStats>
        <CardDataStats title="Total sales" total={orderStats.totalSales}>
          <i className="ri-shopping-cart-line text-primary text-xl"></i>
        </CardDataStats>
      </div>
      <div>
        <Chart artworks={artworkStats} />
      </div>
    </div>
  );
};

export default Dashboard;
