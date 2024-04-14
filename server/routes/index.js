const router = require('express').Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

router.use(authRoutes);
router.use('/admins', adminRoutes);

module.exports = router;