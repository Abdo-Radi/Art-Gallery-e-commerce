const router = require('express').Router();
const { getCustomers, getCustomerById, searchCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { isAuthorized } = require('../middleware/authorization');

router.use(isAuthorized('admin'));

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.get('/search', searchCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;