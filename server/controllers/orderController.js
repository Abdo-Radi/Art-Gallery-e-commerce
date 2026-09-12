const mongoose = require("mongoose");
const Order = require("../models/Order");
const Artwork = require("../models/Artwork");
const Exhibition = require("../models/Exhibition");
const Payment = require("../models/Payment");

// Must match the storefront's Cart.jsx and Checkout.jsx, so the total charged
// is the total the customer was shown.
const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 50;

// Put back stock claimed for an order that could not be completed, or that an
// admin canceled.
const releaseStock = async (claimed) => {
  // Only well-formed lines: never run an update without a real product id.
  const lines = claimed.filter(
    ({ product, productType, quantity }) =>
      mongoose.isObjectIdOrHexString(product) &&
      (productType === "Artwork" ||
        (productType === "Exhibition" &&
          Number.isInteger(quantity) &&
          quantity > 0))
  );
  const results = await Promise.allSettled(
    lines.map(({ product, productType, quantity }) =>
      productType === "Artwork"
        ? Artwork.updateOne({ _id: product }, { $set: { status: "available" } })
        : Exhibition.updateOne({ _id: product }, { $inc: { quantity } })
    )
  );
  results
    .filter((result) => result.status === "rejected")
    .forEach((result) =>
      console.error(`ERROR: failed to release stock: ${result.reason.message}`)
    );
};

// Only products and quantities come from the browser. The customer comes from
// the token; prices, names, the total and the status are decided here.
const createOrder = async (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your order has no items" });
  }

  const seen = new Set();
  for (const item of items) {
    const { product, productType, quantity } = item ?? {};
    const validProduct =
      mongoose.isObjectIdOrHexString(product) &&
      ["Artwork", "Exhibition"].includes(productType);
    const validQuantity =
      Number.isInteger(quantity) &&
      quantity >= 1 &&
      (productType !== "Artwork" || quantity === 1);

    if (!validProduct || !validQuantity) {
      return res
        .status(400)
        .json({ message: "Your order contains an invalid item" });
    }

    const key = `${productType}:${String(product).toLowerCase()}`;
    if (seen.has(key)) {
      return res
        .status(400)
        .json({ message: "Your order lists the same item twice" });
    }
    seen.add(key);
  }

  // Claim stock line by line with conditional updates. Each update only matches
  // while the artwork is unsold or enough tickets remain, so two checkouts can
  // never both get the same artwork or the last tickets.
  const claimed = [];

  try {
    const orderItems = [];

    for (const { product, productType, quantity } of items) {
      const isArtwork = productType === "Artwork";

      const doc = isArtwork
        ? await Artwork.findOneAndUpdate(
            { _id: product, status: { $ne: "sold" } },
            { $set: { status: "sold" } }
          )
            .select("title price")
            .lean()
        : await Exhibition.findOneAndUpdate(
            { _id: product, quantity: { $gte: quantity } },
            { $inc: { quantity: -quantity } }
          )
            .select("name price")
            .lean();

      if (!doc) {
        await releaseStock(claimed.splice(0));

        const current = await (isArtwork ? Artwork : Exhibition)
          .findById(product)
          .select("title name quantity")
          .lean();

        if (!current) {
          return res.status(404).json({
            message: `An ${isArtwork ? "artwork" : "exhibition"} in your order no longer exists`,
          });
        }

        const left = current.quantity;
        return res.status(409).json({
          message: isArtwork
            ? `"${current.title}" has already been sold`
            : left > 0
            ? `Only ${left} ticket${left === 1 ? "" : "s"} left for "${current.name}"`
            : `"${current.name}" is sold out`,
        });
      }

      claimed.push({ product, productType, quantity });
      orderItems.push({
        product: doc._id,
        productType,
        quantity,
        price: doc.price,
        name: isArtwork ? doc.title : doc.name,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    const savedOrder = await new Order({
      customer: req.user.userId,
      items: orderItems,
      // Demo checkout: card details are only format-checked in the browser.
      status: "Paid",
      totalAmount: subtotal + shipping,
    }).save();

    // The order exists now, so the stock stays claimed.
    claimed.length = 0;
    res.status(201).json(savedOrder);
  } catch (error) {
    await releaseStock(claimed.splice(0));
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const options = {
      lean: true,
      page,
      limit: limit || 10,
      populate: { path: "customer", select: "firstName lastName email" },
    };

    const orders = await Order.paginate({}, options);

    // One batched lookup for this page's payments (one per order at most).
    const payments = await Payment.find({
      orderId: { $in: orders.docs.map((order) => order._id) },
    })
      .select("orderId amount date")
      .lean();
    const paymentByOrder = new Map(
      payments.map((payment) => [String(payment.orderId), payment])
    );
    orders.docs = orders.docs.map((order) => ({
      ...order,
      payment: paymentByOrder.get(String(order._id)) ?? null,
    }));

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Admins change an order's status and nothing else: items and totals were
// priced by the server at checkout. Canceling puts the order's artworks and
// tickets back on sale, so a canceled order is final.
const updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!Order.schema.path("status").enumValues.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    // Matching only orders that aren't canceled yet means the cancel happens
    // exactly once, even if two admins click together, so stock is released once.
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, status: { $ne: "Canceled" } },
      { $set: { status } },
      { new: true }
    )
      .populate({ path: "customer", select: "firstName lastName email" })
      .lean();

    if (!updatedOrder) {
      return (await Order.exists({ _id: orderId }))
        ? res.status(409).json({ message: "A canceled order can't be changed" })
        : res.status(404).json({ message: "Order not found" });
    }

    if (status === "Canceled") {
      await releaseStock(updatedOrder.items);
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const deleteOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrderById,
};
