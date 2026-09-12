const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { isAuthorized } = require('../middleware/authorization');
const { verifyToken } = require('../middleware/jwt');

router.use(verifyToken);

// Customers place orders from the storefront checkout
router.post('/', isAuthorized('customer'), orderController.createOrder);

// Everything else is admin-only
router.get('/', isAuthorized('admin'), orderController.getOrders);
router.get('/:id', isAuthorized('admin'), orderController.getOrderById);
router.put('/:id', isAuthorized('admin'), orderController.updateOrder);
router.delete('/:id', isAuthorized('admin'), orderController.deleteOrderById);

module.exports = router;
