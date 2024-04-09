const router = require('express').Router();
const { registerHandler, loginHandler, logoutHandler } = require('../controllers/authController');

router.post('/register', registerHandler);

router.post('/login', loginHandler);

router.get('/logout', logoutHandler);

module.exports = router;