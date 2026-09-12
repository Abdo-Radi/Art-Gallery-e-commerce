const router = require("express").Router();

const shoppingCartController = require("../controllers/shoppingCartController");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.use(verifyToken);
// Carts belong to storefront customers
router.use(isAuthorized("customer"));

router.get("/:customer", shoppingCartController.getItems);
router.post("/add", shoppingCartController.addItem);
router.post("/remove", shoppingCartController.removeItem);

// Route to increase the quantity of an item in the cart
router.post("/increase", shoppingCartController.increaseItemQuantity);

// Route to decrease the quantity of an item in the cart
router.post("/decrease", shoppingCartController.decreaseItemQuantity);

// Route to empty the cart (used after a successful checkout)
router.post("/clear", shoppingCartController.clearCart);

module.exports = router;
