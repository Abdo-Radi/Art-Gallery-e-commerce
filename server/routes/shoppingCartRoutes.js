const router = require("express").Router();

const shoppingCartController = require("../controllers/shoppingCartController");
const { verifyToken } = require("../middleware/jwt");

// router.use(verifyToken);

router.get("/:customer", shoppingCartController.getItems);
router.post("/add", shoppingCartController.addItem);
router.post("/remove", shoppingCartController.removeItem);

module.exports = router;
