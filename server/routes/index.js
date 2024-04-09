const router = require('express').Router();

const authRouters = require('./authRoutes');

router.use(authRouters);

module.exports = router;