import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/api/axiosInstance";
import { clearCart, fetchCart } from "@/redux/slices/cart";

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 50;

const labelCls = "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { data: userData } = useSelector((state) => state.currentUser);

  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [placingOrder, setPlacingOrder] = useState(false);

  const validItems = items.filter((item) => item.itemDetails);

  const subtotal = validItems.reduce(
    (sum, item) => sum + item.itemDetails.price * item.quantity,
    0
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (!userData || validItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const validateCard = () => {
    if (!/^\d{13,19}$/.test(card.number.replace(/\s/g, ""))) {
      return "Please enter a valid card number";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
      return "Expiry date must be in MM/YY format";
    }
    if (!/^\d{3,4}$/.test(card.cvc)) {
      return "Please enter a valid CVC";
    }
    return null;
  };

  const placeOrder = async () => {
    const cardError = validateCard();
    if (cardError) {
      toast.error(cardError, { position: "top-right", autoClose: 2500 });
      return;
    }

    setPlacingOrder(true);
    try {
      const orderItems = validItems.map((item) => ({
        product: item.product,
        productType: item.productType,
        quantity: item.quantity,
        price: item.itemDetails.price,
        name: item.itemDetails.title ?? item.itemDetails.name,
      }));

      const orderResponse = await axiosInstance.post("/orders", {
        customer: userData._id,
        items: orderItems,
        status: "Paid",
        totalAmount: total,
      });

      await axiosInstance.post("/payments", {
        orderId: orderResponse.data._id,
        amount: total,
      });

      await axiosInstance.post("/cart/clear", { customer: userData._id });
      dispatch(clearCart());
      dispatch(fetchCart(userData._id));

      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ??
          "Could not place the order. Please try again.",
        { position: "top-right", autoClose: 2500 }
      );
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
          <p className="eyebrow">Almost yours</p>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
            Checkout
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-14 md:px-6 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:px-8">
        {/* Order recap */}
        <div>
          <h2 className="font-display text-2xl font-semibold">Your order</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {validItems.map((item) => (
              <div
                key={`${item.productType}-${item.product}`}
                className="flex items-center gap-6 py-5"
              >
                <div className="shrink-0 border border-line p-1">
                  <img
                    src={item.itemDetails.image}
                    alt={item.itemDetails.name ?? item.itemDetails.title}
                    className="h-20 w-20 object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={labelCls}>
                    {item.productType === "Artwork"
                      ? "Artwork"
                      : "Exhibition ticket"}
                  </p>
                  <h3 className="mt-1 truncate font-display text-lg font-semibold italic">
                    {item.itemDetails.name ?? item.itemDetails.title}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg tabular-nums">
                    {item.itemDetails.price} DH
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    Qty {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <aside>
          <div className="border border-line p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-semibold">Payment</h2>
            <form
              className="mt-6 grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                placeOrder();
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="card-number" className={labelCls}>
                  Card number
                </Label>
                <Input
                  id="card-number"
                  placeholder="4242 4242 4242 4242"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  className="h-11 border-line bg-transparent tabular-nums"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry-date" className={labelCls}>
                    Expiry
                  </Label>
                  <Input
                    id="expiry-date"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                    className="h-11 border-line bg-transparent tabular-nums"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc" className={labelCls}>
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                    className="h-11 border-line bg-transparent tabular-nums"
                  />
                </div>
              </div>

              <dl className="mt-2 space-y-3 border-t border-line pt-5">
                <div className="flex items-baseline justify-between">
                  <dt className={labelCls}>Subtotal</dt>
                  <dd className="text-sm tabular-nums">{subtotal} DH</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className={labelCls}>Shipping</dt>
                  <dd className="text-sm tabular-nums">
                    {shipping === 0 ? "Free" : `${shipping} DH`}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="font-display text-lg font-semibold">Total</dt>
                  <dd className="font-display text-2xl tabular-nums">
                    {total} DH
                  </dd>
                </div>
              </dl>

              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full text-[12px] font-semibold uppercase tracking-[0.15em]"
                disabled={placingOrder}
              >
                {placingOrder ? "Placing order…" : "Place order"}
              </Button>
              <p className="text-center text-xs text-stone">
                Demo checkout — card details are validated but never stored.
              </p>
            </form>
          </div>
        </aside>
      </section>
      <ToastContainer />
    </>
  );
};

export default Checkout;
