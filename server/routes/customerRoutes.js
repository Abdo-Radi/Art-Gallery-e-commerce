const router = require("express").Router();
const {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { isAuthorized } = require("../middleware/authorization");
const { verifyToken } = require("../middleware/jwt");

router.use(verifyToken);
// Customer records are personal data: admins only, reads included.
router.use(isAuthorized("admin"));

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", addCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
