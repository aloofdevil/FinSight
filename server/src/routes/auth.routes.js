const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, getMe, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { register: registerSchema, login: loginSchema, forgotPassword: forgotPasswordSchema, resetPassword: resetPasswordSchema } = require('../validators/auth.validator');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;
