const router = require('express').Router();
const paymentController = require('../controllers/payementController');

router.post('/', paymentController.recordPayment);
router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePaymentById);

module.exports = router;