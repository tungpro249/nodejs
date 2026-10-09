
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateRegister } = require('../middleware/validateUser');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../middleware/authValidation');

// POST /api/v1/auth/register -> Đăng ký tài khoản mới (name, email, password)
router.post('/register', validate(registerSchema), asyncHandler(authController.register));

// POST /api/v1/auth/login -> Đăng ký tài khoản mới (name, email, password)
router.post('/login', validate(loginSchema), asyncHandler(authController.login));

// POST /api/v1/auth/refresh-token -> Đăng ký tài khoản mới (name, email, password)
router.post('/refresh-token', asyncHandler(authController.refreshToken));

// POST /api/v1/auth/logout -> Đăng ký tài khoản mới (name, email, password)
router.post('/logout', asyncHandler(authController.logout));

module.exports = router;
