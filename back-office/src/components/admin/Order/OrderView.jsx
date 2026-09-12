import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../../../redux/slices/order";

const STATUSES = ["Open", "Paid", "Closed", "Canceled"];

const money = (value) => `${(Number(value) || 0).toFixed(2)} DH`;
const lineTotal = (item) => (Number(item.price) || 0) * (Number(item.quantity) || 0);

const OrderView = ({ order, chipClass, onClose }) => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const items = order.items ?? [];
  const itemsTotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  // Shipping isn't stored separately; it's whatever the total adds on top.
  const shipping = Math.max(
    0,
    Math.round(((order.totalAmount ?? 0) - itemsTotal) * 100) / 100
  );
  const isCanceled = order.status === "Canceled";

  const saveStatus = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    const result = await dispatch(updateOrderStatus({ id: order._id, status }));
    setSaving(false);
    if (updateOrderStatus.rejected.match(result)) {
      setError(result.payload ?? result.error.message);
    } else {
      setSaved(true);
    }
  };

  return (
    <div className="modal-card-wide">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Sales</p>
          <h3 className="modal-title">Order details</h3>
          <p className="mt-1 font-mono text-xs text-stone">{order._id}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn-icon"
          title="Close"
          aria-label="Close"
        >
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      <div className="modal-body space-y-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="label-cap">Customer</dt>
            <dd className="mt-1.5 text-ink">
              {order.customer ? (
                <>
                  {order.customer.firstName} {order.customer.lastName}
                  <span className="block text-xs text-stone">
                    {order.customer.email}
                  </span>
                </>
              ) : (
                <span className="text-stone-light">Deleted customer</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="label-cap">Placed</dt>
            <dd className="mt-1.5 text-ink">
              {new Date(order.date).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="label-cap">Status</dt>
            <dd className="mt-1.5">
              <span className={`chip ${chipClass}`}>{order.status}</span>
            </dd>
          </div>
          <div>
            <dt className="label-cap">Payment</dt>
            <dd className="mt-1.5 text-ink">
              {order.payment ? (
                <>
                  <span className="tabular-nums">
                    {money(order.payment.amount)}
                  </span>
                  <span className="block text-xs text-stone">
                    {new Date(order.payment.date).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-stone-light">No payment recorded</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="overflow-x-auto border border-line">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-empty">
                    No items recorded.
                  </td>
                </tr>
              )}
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="text-ink">
                    {item.name ?? <span className="text-stone-light">—</span>}
                  </td>
                  <td className="text-stone">
                    {item.productType === "Exhibition"
                      ? "Ticket"
                      : item.productType ?? "—"}
                  </td>
                  <td className="text-right tabular-nums">{item.quantity}</td>
                  <td className="text-right tabular-nums">
                    {money(item.price)}
                  </td>
                  <td className="text-right tabular-nums">
                    {money(lineTotal(item))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="ml-auto max-w-xs space-y-2 text-sm">
          {shipping > 0 && (
            <>
              <div className="flex justify-between">
                <dt className="text-stone">Items</dt>
                <dd className="tabular-nums">{money(itemsTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">Shipping</dt>
                <dd className="tabular-nums">{money(shipping)}</dd>
              </div>
            </>
          )}
          <div className="flex justify-between border-t border-line pt-2 font-semibold text-ink">
            <dt>Total</dt>
            <dd className="tabular-nums">{money(order.totalAmount)}</dd>
          </div>
        </dl>
      </div>

      {error ? (
        <p role="alert" className="modal-error">
          {error}
        </p>
      ) : (
        !isCanceled &&
        status === "Canceled" && (
          <p className="modal-error">
            Canceling puts this order&apos;s artworks and tickets back on sale,
            and can&apos;t be undone.
          </p>
        )
      )}

      <div className="modal-foot">
        {isCanceled ? (
          <p className="text-sm text-stone">
            This order was canceled and can&apos;t be changed.
          </p>
        ) : (
          <>
            <select
              aria-label="Order status"
              value={status}
              disabled={saving}
              onChange={(e) => {
                setStatus(e.target.value);
                setSaved(false);
                setError("");
              }}
              className="select-field max-w-[10rem]"
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={saveStatus}
              disabled={saving || status === order.status}
              className="btn-primary"
            >
              {saving
                ? "Saving…"
                : status === "Canceled"
                ? "Cancel order"
                : "Update status"}
            </button>
            {saved && (
              <span role="status" className="text-xs text-success">
                Status updated
              </span>
            )}
          </>
        )}
        <button type="button" onClick={onClose} className="btn-outline ml-auto">
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderView;
