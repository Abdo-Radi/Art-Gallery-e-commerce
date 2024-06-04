import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);

  return (
    <main className="flex-1 container px-4 md:px-6 lg:px-20 py-12">
      <div className="grid md:grid-cols-[2fr_1fr] gap-12">
        <div className="rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            <div className="grid gap-6">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
                >
                  <img
                    src={item.itemDetails.image}
                    alt="Product Image"
                    className="rounded-md"
                    style={{
                      aspectRatio: "100/100",
                      objectFit: "cover",
                    }}
                    width={100}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.itemDetails.name ?? item.itemDetails.title}</h3>
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
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="Enter your card number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input id="expiry-date" placeholder="MM/YY" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="CVC" />
              </div>
            </div>
          </form>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Subtotal</p>
              <p className="text-lg font-semibold">$430</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Shipping</p>
              <p className="text-lg font-semibold">$10</p>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Total</p>
              <p className="text-xl font-bold">$440</p>
            </div>
            <Button size="lg" className="w-full mt-6">
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
