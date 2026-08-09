import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "@/api/axiosInstance";
import { clearCart, fetchCart } from "@/redux/slices/cart";

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 50;

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
        error.response?.data?.message ?? "Could not place the order. Please try again.",
        { position: "top-right", autoClose: 2500 }
      );
      setPlacingOrder(false);
    }
  };

  return (
    <main className="flex-1 container px-4 md:px-6 lg:px-20 py-12">
      <div className="grid md:grid-cols-[2fr_1fr] gap-12">
        <div className="rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            <div className="grid gap-6">
              {validItems.map((item) => (
                <div
                  key={`${item.productType}-${item.product}`}
                  className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
                >
                  <img
                    src={item.itemDetails.image}
                    alt={item.itemDetails.name ?? item.itemDetails.title}
                    className="rounded-md"
                    style={{
                      aspectRatio: "100/100",
                      objectFit: "cover",
                    }}
                    width={100}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.itemDetails.name ?? item.itemDetails.title}
                    </h3>
                    <p className="text-gray-500">{item.productType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {item.itemDetails.price} DH
                    </p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              placeOrder();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="Enter your card number"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="CVC"
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500">Subtotal</p>
                <p className="text-lg font-semibold">{subtotal} DH</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500">Shipping</p>
                <p className="text-lg font-semibold">
                  {shipping === 0 ? "Free" : `${shipping} DH`}
                </p>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Total</p>
                <p className="text-xl font-bold">{total} DH</p>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
};

export default Checkout;
