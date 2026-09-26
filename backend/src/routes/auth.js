const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');
const { verifyToken } = require('../middleware/auth');

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/signup', authLimiter, validateRegister, authController.register);

router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/signin', authLimiter, validateLogin, authController.login);

router.get('/me', verifyToken, authController.getMe);

module.exports = router;
