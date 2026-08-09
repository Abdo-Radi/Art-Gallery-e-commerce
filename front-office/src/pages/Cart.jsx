import { Button } from "@/components/ui/button";
import {
  decreaseItemQuantity,
  increaseItemQuantity,
  removeItemFromCart,
} from "@/redux/slices/cart";
import { LuMinus } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { LuTrash } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 50;

const labelCls = "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";
const qtyBtn =
  "flex h-7 w-7 items-center justify-center border border-line text-ink transition-colors hover:border-klein hover:text-klein";

const Cart = () => {
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const { data: userData } = useSelector((state) => state.currentUser);

  // Items whose artwork/exhibition was deleted server-side come back with
  // itemDetails: null — skip them instead of crashing.
  const validItems = items.filter((item) => item.itemDetails);

  const itemsCount = validItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = validItems.reduce(
    (sum, item) => sum + item.itemDetails.price * item.quantity,
    0
  );
  const shipping =
    totalPrice === 0 || totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = totalPrice + shipping;

  return userData ? (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
          <p className="eyebrow">Your selection</p>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
            Cart
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 py-14 md:px-6 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:px-8">
        <div>
          {validItems.length === 0 && (
            <p className="font-display text-lg italic text-stone">
              Your cart is empty —{" "}
              <Link className="text-klein underline-offset-4 hover:underline" to="/artworks">
                browse artworks
              </Link>{" "}
              or{" "}
              <Link className="text-klein underline-offset-4 hover:underline" to="/exhibitions">
                exhibitions
              </Link>
              .
            </p>
          )}

          <div className="divide-y divide-line border-y border-line">
            {validItems.map((item) =>
              item.productType === "Artwork" ? (
                <div
                  key={`${item.productType}-${item.product}`}
                  className="flex items-center gap-6 py-6"
                >
                  <div className="shrink-0 border border-line p-1">
                    <img
                      alt={item.itemDetails.title}
                      className="h-24 w-24 object-cover"
                      src={item.itemDetails.image}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={labelCls}>Artwork</p>
                    <h3 className="mt-1 truncate font-display text-xl font-semibold italic">
                      {item.itemDetails.title}
                    </h3>
                    <p className="mt-1 text-sm text-stone">
                      {item.itemDetails.artist?.firstName}{" "}
                      {item.itemDetails.artist?.lastName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className="font-display text-lg tabular-nums">
                      {item.itemDetails.price} DH
                    </p>
                    <button
                      onClick={() => {
                        dispatch(
                          removeItemFromCart({
                            customer: userData._id,
                            product: item.product,
                            productType: "Artwork",
                          })
                        );
                      }}
                      className="text-stone transition-colors hover:text-klein"
                      aria-label="Remove from cart"
                    >
                      <LuTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={`${item.productType}-${item.product}`}
                  className="flex items-center gap-6 py-6"
                >
                  <div className="shrink-0 border border-line p-1">
                    <img
                      alt={item.itemDetails.name}
                      className="h-24 w-24 object-cover"
                      src={item.itemDetails.image}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={labelCls}>Exhibition ticket</p>
                    <h3 className="mt-1 truncate font-display text-xl font-semibold italic">
                      {item.itemDetails.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => {
                          dispatch(
                            decreaseItemQuantity({
                              customer: userData._id,
                              product: item.product,
                              productType: "Exhibition",
                            })
                          );
                        }}
                        className={
                          item.quantity === 1
                            ? `${qtyBtn} pointer-events-none opacity-40`
                            : qtyBtn
                        }
                        aria-label="Decrease quantity"
                      >
                        <LuMinus className="h-3.5 w-3.5" />
                      </button>
                      <p className="w-6 text-center text-sm tabular-nums">
                        {item.quantity}
                      </p>
                      <button
                        onClick={() => {
                          dispatch(
                            increaseItemQuantity({
                              customer: userData._id,
                              product: item.product,
                              productType: "Exhibition",
                            })
                          );
                        }}
                        className={
                          item.quantity === item.itemDetails.quantity
                            ? `${qtyBtn} pointer-events-none opacity-40`
                            : qtyBtn
                        }
                        aria-label="Increase quantity"
                      >
                        <LuPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className="font-display text-lg tabular-nums">
                      {item.itemDetails.price} DH
                    </p>
                    <button
                      onClick={() => {
                        dispatch(
                          removeItemFromCart({
                            customer: userData._id,
                            product: item.product,
                            productType: "Exhibition",
                          })
                        );
                      }}
                      className="text-stone transition-colors hover:text-klein"
                      aria-label="Remove from cart"
                    >
                      <LuTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="border border-line p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-semibold">Summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <dt className={labelCls}>Items</dt>
                <dd className="text-sm tabular-nums">{itemsCount}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className={labelCls}>Subtotal</dt>
                <dd className="text-sm tabular-nums">{totalPrice} DH</dd>
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
                  {grandTotal} DH
                </dd>
              </div>
            </dl>
            {validItems.length > 0 ? (
              <Button
                asChild
                size="lg"
                className="mt-8 w-full text-[12px] font-semibold uppercase tracking-[0.15em]"
              >
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="mt-8 w-full text-[12px] font-semibold uppercase tracking-[0.15em]"
                disabled
              >
                Proceed to checkout
              </Button>
            )}
            <p className="mt-4 text-center text-xs text-stone">
              Free shipping on orders over {FREE_SHIPPING_THRESHOLD} DH
            </p>
          </div>
        </aside>
      </section>
    </>
  ) : (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center">
      <p className="eyebrow">Members only</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">
        Sign in to see your cart
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone">
        Your selection is saved to your account — log in from the header to
        pick up where you left off.
      </p>
    </div>
  );
};

export default Cart;
