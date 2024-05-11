const router = require('express').Router();
const { addCustomer, getCustomers, getCustomerById, searchCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { isAuthorized } = require('../middleware/authorization');

router.use(isAuthorized('admin'));

router.post('/', addCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.get('/search', searchCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;