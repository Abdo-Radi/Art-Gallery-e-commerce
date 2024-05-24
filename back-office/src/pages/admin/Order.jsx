import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import { fetchOrders, deleteOrder } from "../../redux/slices/order";

const OrderPage = () => {
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(5);
  const [currPage, setCurrPage] = useState(0);
  const totalPages = Math.ceil(orders.length / limit);
  const paginatedOrders = orders.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOrders()); // Re-fetch orders when refreshFlag changes
  }, [dispatch, refreshFlag]);

  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      dispatch(deleteOrder(orderId));
      Swal.fire("Deleted!", "The order has been deleted.", "success"); // Show success message
      setRefreshFlag((prev) => !prev); // Toggle to trigger re-fetch
    }
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark/border-strokedark dark/bg-boxdark sm/px-7.5 xl/pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark/text-white">
            Orders
          </h2>
        </div>

        {isLoading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark/bg-meta-4">
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
                  {paginatedOrders.map((order) => (
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
                          <button onClick={() => handleDelete(order._id)}>
                            <i className="ri-delete-bin-6-line hover-text-primary"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center space-x-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 ${
                      currPage === i ? "bg-primary text-white" : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
