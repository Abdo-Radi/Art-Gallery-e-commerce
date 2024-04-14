const router = require('express').Router();
const { getAdmins } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/jwt');
const { isAuthorized } = require('../middleware/authorization');

router.use(verifyToken);

router.get('/', isAuthorized('admin'), getAdmins);

module.exports = router;