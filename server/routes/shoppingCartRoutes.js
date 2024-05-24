const router = require("express").Router();

const shoppingCartController = require("../controllers/shoppingCartController");
const { verifyToken } = require("../middleware/jwt");

router.use(verifyToken);

router.get("/", shoppingCartController.getItems);
router.post("/", shoppingCartController.addItem);
router.delete("/:id", shoppingCartController.removeItem);

module.exports = router;
