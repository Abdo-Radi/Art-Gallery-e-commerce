import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { removeItemFromCart } from "@/redux/slices/cart";
import { LuMinus } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { LuTrash } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const { data: userData } = useSelector((state) => state.currentUser);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.itemDetails.price * item.quantity,
    0
  );

  return userData ? (
    <section className="container px-4 md:px-6 lg:px-20 py-12 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
      <div className="rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-700">
        <h2 className="mb-4 text-2xl font-bold">Your Cart</h2>
        <div className="space-y-6">
          {items.map((item, i) =>
            item.productType === "Artwork" ? (
              <div key={i} className="flex items-center gap-4">
                <img
                  alt="Product"
                  className="rounded-md"
                  height={100}
                  src={item.itemDetails.image}
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">
                    {item.itemDetails.title}
                  </h3>
                  <p className="text-gray-500">
                    {item.itemDetails.artist.firstName}{" "}
                    {item.itemDetails.artist.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">
                    {item.itemDetails.price} DH
                  </p>
                  <Button
                    onClick={() => {
                      dispatch(
                        removeItemFromCart({
                          customer: userData._id,
                          product: item.product,
                          productType: "Artwork",
                        })
                      );
                    }}
                    size="icon"
                    variant="outline"
                  >
                    <LuTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-center gap-4">
                <img
                  alt="Product"
                  className="rounded-md"
                  height={100}
                  src={item.itemDetails.image}
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">
                    {item.itemDetails.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="icon" variant="outline">
                      <LuMinus className="h-4 w-4" />
                    </Button>
                    <Input
                      className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center dark:border-gray-600"
                      defaultValue={1}
                      min={1}
                      type="number"
                    />
                    <Button size="icon" variant="outline">
                      <LuPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">$500.00</p>
                  <Button size="icon" variant="outline">
                    <LuTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-700">
        <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p>Items</p>
            <p className="font-medium">{items.length}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Shipping</p>
            <p className="font-medium">
              {totalPrice >= 1000 ? "Free" : "50 DH"}
            </p>
          </div>
          {/* <Separator /> */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold">{totalPrice} DH</p>
          </div>
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </section>
  ) : (
    "Please login or create an account if you are a new member!"
  );
};

export default Cart;
