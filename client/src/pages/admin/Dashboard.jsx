import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getArtists } from "../../redux/slices/artist";
import { getArtworks } from "../../redux/slices/artwork";
import CardDataStats from "../../components/admin/CardDataStats";
import axiosInstance from "../../api/axiosInstance";
import Chart from "../../components/admin/Chart";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState({});
  const [artworks, setArtworks] = useState([]);

  const getStats = async () => {
    try {
      const { data } = await axiosInstance.get("/stats");
      setOrders(data.orders);
      setArtworks(data.artworks);
    } catch (error) {
      console.log(error.message);
    }
  };

  const { total: totalArtists } = useSelector((state) => state.artists);
  const { total: totalArtworks } = useSelector((state) => state.artworks);

  useEffect(() => {
    getStats();
    dispatch(getArtists());
    dispatch(getArtworks());
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
        <CardDataStats title="Total orders" total={orders.totalOrders}>
          <i className="ri-shopping-basket-2-line text-primary text-xl"></i>
        </CardDataStats>
        <CardDataStats title="Total sales" total={orders.totalSales}>
          <i className="ri-shopping-cart-line text-primary text-xl"></i>
        </CardDataStats>
      </div>
      <div>
        <Chart artworks={artworks} />
      </div>
    </div>
  );
};

export default Dashboard;
