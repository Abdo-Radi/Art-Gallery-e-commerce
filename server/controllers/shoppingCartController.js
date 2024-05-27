const ShoppingCart = require("../models/ShoppingCart");
const Artwork = require("../models/Artwork");
const Ticket = require("../models/Ticket");

const addItem = async (req, res, next) => {
  try {
    const { customer, product, productType, quantity } = req.body;

    const cart = await ShoppingCart.findOne({ customer });
    console.log(cart);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === product &&
          item.productType === productType
      );

      if (itemIndex > -1) {
        // Item exists in cart, update quantity
        if (productType === "Ticket")
          cart.items[itemIndex].quantity += quantity;
      } else {
        // Item does not exist in cart, add new item
        cart.items.push({ product, productType, quantity });
      }

      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      // Create new cart for user
      const newCart = new ShoppingCart({
        customer,
        items: [{ product, productType, quantity }],
      });

      await newCart.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
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
    const artworkItems = cart.items.filter(
      (item) => item.productType === "Artwork"
    );
    const ticketItems = cart.items.filter(
      (item) => item.productType === "Ticket"
    );

    // Fetch details for each type
    const artworkDetails = await Promise.all(
      artworkItems.map(async (item) => {
        const artwork = await Artwork.findById(item.product).populate({
          path: "artist",
          select: ["firstName", "lastName"],
        });
        return { ...item._doc, itemDetails: artwork };
      })
    );

    const ticketDetails = await Promise.all(
      ticketItems.map(async (item) => {
        const ticket = await Ticket.findById(item.product).populate({
          path: "exhibition",
        });
        return { ...item._doc, itemDetails: ticket };
      })
    );

    // Combine results
    const detailedItems = [...artworkDetails, ...ticketDetails];
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

module.exports = {
  addItem,
  getItems,
  removeItem,
  increaseItemQuantity,
  decreaseItemQuantity,
};
