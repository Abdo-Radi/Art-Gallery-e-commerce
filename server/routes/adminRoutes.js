const router = require('express').Router();
const { verifyToken } = require('../middleware/jwt');
const { isAuthorized } = require('../middleware/authorization');
const adminController = require("../controllers/adminController");

router.use(isAuthorized('admin'));
router.use(verifyToken);

router.get('/', adminController.getAdmins);
router.post("/", adminController.addAdmin)
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;