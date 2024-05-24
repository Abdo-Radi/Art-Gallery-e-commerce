const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.use(verifyToken);
router.use(isAuthorized("admin"));

router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
