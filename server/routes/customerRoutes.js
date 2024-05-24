const router = require("express").Router();
const {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { isAuthorized } = require("../middleware/authorization");

router.get("/", getCustomers);
router.get("/:id", getCustomerById);

router.use(isAuthorized("admin"));

router.post("/", addCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
