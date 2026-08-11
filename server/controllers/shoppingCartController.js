const ShoppingCart = require("../models/ShoppingCart");
const Artwork = require("../models/Artwork");
const Exhibition = require("../models/Exhibition");

const addItem = async (req, res, next) => {
  try {
    const { customer, product, productType, quantity } = req.body;

    let cart = await ShoppingCart.findOne({ customer });

    let message = "";

    if (!cart) {
      // Create new cart for user if it doesn't exist
      cart = new ShoppingCart({
        customer,
        items: [{ product, productType, quantity }],
      });
      message = "New cart created and item added successfully";
    } else {
      // Cart exists, check if item exists
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === product &&
          item.productType === productType
      );

      if (itemIndex > -1) {
        // Item exists in cart, update quantity if productType is "Ticket"
        if (productType === "Exhibition") {
          cart.items[itemIndex].quantity += quantity;
          message = "Item quantity updated successfully";
        } else {
          // Optionally, handle other product types differently or throw an error
          message = "Unsupported type for quantity update";
        }
      } else {
        // Item does not exist in cart, add new item
        cart.items.push({ product, productType, quantity });
        message = "Item added to cart successfully";
      }

      cart.updatedAt = Date.now();
    }

    await cart.save();
    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getItems = async (req, res, next) => {
  try {
    const { customer } = req.params;

    const cart = await ShoppingCart.findOne({ customer });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Separate items by type
    const artworkIds = cart.items
      .filter((item) => item.productType === "Artwork")
      .map((item) => item.product);
    const exhibitionIds = cart.items
      .filter((item) => item.productType === "Exhibition")
      .map((item) => item.product);

    // Two batched queries instead of one round trip per cart line, and both
    // run concurrently.
    const [artworks, exhibitions] = await Promise.all([
      Artwork.find({ _id: { $in: artworkIds } })
        .populate({ path: "artist", select: ["firstName", "lastName"] })
        .lean(),
      Exhibition.find({ _id: { $in: exhibitionIds } }).lean(),
    ]);

    const byId = new Map();
    artworks.forEach((doc) => byId.set(`Artwork:${doc._id}`, doc));
    exhibitions.forEach((doc) => byId.set(`Exhibition:${doc._id}`, doc));

    // Preserve the cart's own ordering rather than regrouping by type.
    const detailedItems = cart.items.map((item) => ({
      ...item._doc,
      itemDetails: byId.get(`${item.productType}:${item.product}`) ?? null,
    }));
    const detailedCart = { ...cart._doc, items: detailedItems };

    res.status(200).json(detailedCart);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const { customer, product, productType } = req.body;

    const cart = await ShoppingCart.findOne({ customer });

    if (cart) {
      cart.items = cart.items.filter(
        (item) =>
          !(
            item.product.toString() === product &&
            item.productType === productType
          )
      );
      cart.updatedAt = Date.now();
      await cart.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const increaseItemQuantity = async (req, res, next) => {
  try {
    const { customer, product, productType } = req.body;

    const cart = await ShoppingCart.findOne({ customer });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === product &&
          item.productType === productType
      );

      if (itemIndex > -1) {
        // Item exists in cart, increase quantity
        cart.items[itemIndex].quantity += 1;
        cart.updatedAt = Date.now();
        await cart.save();
        return res
          .status(200)
          .json({ success: true, message: "Item quantity increased" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found in cart" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
  } catch (error) {
    next(error);
  }
};

const decreaseItemQuantity = async (req, res, next) => {
  try {
    const { customer, product, productType } = req.body;

    const cart = await ShoppingCart.findOne({ customer });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === product &&
          item.productType === productType
      );

      if (itemIndex > -1) {
        // Item exists in cart, decrease quantity
        cart.items[itemIndex].quantity -= 1;
        if (cart.items[itemIndex].quantity <= 0) {
          // Remove item if quantity is zero or less
          cart.items.splice(itemIndex, 1);
        }
        cart.updatedAt = Date.now();
        await cart.save();
        return res
          .status(200)
          .json({ success: true, message: "Item quantity decreased" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found in cart" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const { customer } = req.body;

    await ShoppingCart.findOneAndUpdate(
      { customer },
      { items: [], updatedAt: Date.now() }
    );

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addItem,
  getItems,
  removeItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
};
