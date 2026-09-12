const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const { isAuthorized } = require('../middleware/authorization');
const { verifyToken } = require('../middleware/jwt');

router.use(verifyToken);

// Customers record a payment from the storefront checkout
router.post('/', isAuthorized('customer'), paymentController.recordPayment);

// Everything else is admin-only
router.get('/', isAuthorized('admin'), paymentController.getPayments);
router.get('/:id', isAuthorized('admin'), paymentController.getPaymentById);
router.put('/:id', isAuthorized('admin'), paymentController.updatePayment);
router.delete('/:id', isAuthorized('admin'), paymentController.deletePaymentById);

module.exports = router;