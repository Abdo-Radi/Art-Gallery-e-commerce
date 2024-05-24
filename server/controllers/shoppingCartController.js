const ShoppingCart = require("../models/ShoppingCart");

const addItem = async (req, res, next) => {
  try {
    const { userId, product, productType, quantity } = req.body;

    const cart = await ShoppingCart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === product &&
          item.productType === productType
      );

      if (itemIndex > -1) {
        // Item exists in cart, update quantity
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
        userId,
        items: [{ product, productType, quantity }],
      });

      await newCart.save();

      res.status(200).json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};

const getItems = async (req, res, next) => {
  try {
    const { customer } = req.params;

    const cart = await ShoppingCart.findOne({ customer }).populate(
      "items.product"
    );

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res) => {
  try {
    const { userId, productId, productType } = req.body;

    const cart = await ShoppingCart.findOne({ userId });

    if (cart) {
      cart.items = cart.items.filter(
        (item) =>
          !(
            item.productId.toString() === productId &&
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

module.exports = {
  addItem,
  getItems,
  removeItem,
};
