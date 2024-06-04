const router = require("express").Router();

const shoppingCartController = require("../controllers/shoppingCartController");
const { verifyToken } = require("../middleware/jwt");

// router.use(verifyToken);

router.get("/:customer", shoppingCartController.getItems);
router.post("/add", shoppingCartController.addItem);
router.post("/remove", shoppingCartController.removeItem);

// Route to increase the quantity of an item in the cart
router.post("/increase", shoppingCartController.increaseItemQuantity);

// Route to decrease the quantity of an item in the cart
router.post("/decrease", shoppingCartController.decreaseItemQuantity);

module.exports = router;
