import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, deleteOrder } from "../../redux/features/order"; // Adjust import path

const OrderPage = () => {
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false); // To trigger re-fetch

  // Function to trigger data re-fetch
  const reloadOrders = () => {
    dispatch(fetchOrders());
  };

  // Re-fetch orders every time refreshFlag changes
  useEffect(() => {
    reloadOrders(); // Fetch orders on component mount and when refreshFlag changes
  }, [dispatch, refreshFlag]); // Added refreshFlag as a dependency

  const handleDelete = (orderId) => {
    dispatch(deleteOrder(orderId));
    setRefreshFlag((prev) => !prev); // Toggle refreshFlag to trigger re-fetch
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Orders
          </h2>
        </div>
        {isLoading && <p>Loading orders...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="p-4 font-medium text-black dark/text-white">
                  Order ID
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Customer ID
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Total Amount
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Status
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Date
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                      {order._id}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                      {order.customerId}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                      {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                      {order.status}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                      {new Date(order.date).toDateString()}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                      <div className="flex items-center text-lg gap-2.5">
                        <button>
                          <i className="ri-edit-box-line hover:text-primary"></i>
                        </button>
                        <button onClick={() => handleDelete(order._id)}>
                          <i className="ri-delete-bin-6-line hover/text-primary"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OrderPage;
