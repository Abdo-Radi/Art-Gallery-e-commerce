import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchOrders, deleteOrder } from "../../redux/slices/order";

const statusChip = {
  Paid: "chip-success",
  Open: "chip-accent",
  Closed: "chip-neutral",
  Canceled: "chip-danger",
};

const shortId = (id) =>
  typeof id === "string" && id.length > 12
    ? `${id.slice(0, 6)}…${id.slice(-4)}`
    : id;

const OrderPage = () => {
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const limit = 5;
  const [currPage, setCurrPage] = useState(0);
  const totalPages = Math.ceil(orders.length / limit);
  const paginatedOrders = orders.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
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
      Swal.fire("Deleted!", "The order has been deleted.", "success");
      setRefreshFlag((prev) => !prev);
    }
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">Sales</p>
          <h1 className="page-title">Orders</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="panel-pad font-display text-base italic text-stone">
          Loading orders…
        </div>
      ) : error ? (
        <div className="panel-pad text-sm text-danger">Error: {error}</div>
      ) : (
        <>
          <div className="panel overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th className="text-right">Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="w-px text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      No orders yet.
                    </td>
                  </tr>
                )}
                {paginatedOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span
                        className="font-mono text-xs text-stone"
                        title={order._id}
                      >
                        {shortId(order._id)}
                      </span>
                    </td>
                    <td>
                      {order.customer ? (
                        <span
                          className="font-mono text-xs text-stone"
                          title={order.customer}
                        >
                          {shortId(order.customer)}
                        </span>
                      ) : (
                        <span className="text-stone-light">—</span>
                      )}
                    </td>
                    <td className="text-right tabular-nums">
                      {order.totalAmount?.toFixed(2)}
                    </td>
                    <td>
                      {order.status ? (
                        <span
                          className={`chip ${
                            statusChip[order.status] || "chip-neutral"
                          }`}
                        >
                          {order.status}
                        </span>
                      ) : (
                        <span className="text-stone-light">—</span>
                      )}
                    </td>
                    <td className="text-stone">
                      {new Date(order.date).toDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="btn-icon-danger"
                          title="Delete"
                          aria-label="Delete order"
                          onClick={() => handleDelete(order._id)}
                        >
                          <i className="ri-delete-bin-6-line" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`page-btn ${
                    currPage === i ? "page-btn-active" : ""
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
  );
};

export default OrderPage;
