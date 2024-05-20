const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const { isAuthorized } = require("../middleware/authorization");

router.use(isAuthorized("admin"));

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
