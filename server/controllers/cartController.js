const cartModel = require("../models/ShoppingCart");

const cartController = {
  //! Show cart
  showCart: async (req, res) => {
    // Removed customer ID checking for now
    const cart = await cartModel.find(); // Retrieve all items in the cart
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(404).send({ message: "Cart is empty" });
    }
  },

  //! Delete product from cart
  deleteProductFromCart: async (req, res) => {
    const { id } = req.params;
    try {
      const productDeletedFromCart = await cartModel.findByIdAndDelete(id);
      if (productDeletedFromCart) {
        res
          .status(200)
          .send({ message: "The product has been deleted from cart", id: id });
      } else {
        res.status(404).send({ message: "Product not found in cart" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  //! Increase the quantity
  increaseQuantity: async (req, res) => {
    const { id } = req.params;
    try {
      const cartItem = await cartModel.findById(id);
      if (cartItem) {
        const updateQuantity = await cartModel.findByIdAndUpdate(
          id,
          {
            quantity: cartItem.quantity + 1,
          },
          { new: true }
        );
        res.status(200).send(updateQuantity);
      } else {
        res.status(404).send({ message: "Product not found in cart" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  //! Decrease the quantity
  decreaseQuantity: async (req, res) => {
    const { id } = req.params;
    try {
      const cartItem = await cartModel.findById(id);
      if (cartItem && cartItem.quantity >= 2) {
        const updateQuantity = await cartModel.findByIdAndUpdate(
          id,
          {
            quantity: cartItem.quantity - 1,
          },
          { new: true }
        );
        res.status(200).send(updateQuantity);
      } else {
        res.status(400).send({
          message:
            "Quantity cannot be decreased further or product not found in cart",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};

module.exports = cartController;
