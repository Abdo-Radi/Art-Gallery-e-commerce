const router = require('express').Router();
const { isAuthorized } = require('../middleware/authorization');
const adminController = require('../controllers/adminController');

router.use(isAuthorized('admin'));

router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdminById);
router.post('/', adminController.addAdmin)
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;