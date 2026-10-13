
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateRegister } = require('../middleware/validateUser');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../middleware/authValidation');

// POST /api/v1/auth/register -> Đăng ký tài khoản mới (name, email, password)
router.post('/register', validate(registerSchema), asyncHandler(authController.register));

// POST /api/v1/auth/login -> login
router.post('/login', validate(loginSchema), asyncHandler(authController.login));

// POST /api/v1/auth/refresh-token -> refresh token
router.post('/refresh-token', asyncHandler(authController.refreshToken));

// POST /api/v1/auth/logout -> logout
router.post('/logout', asyncHandler(authController.logout));

// POST /api/v1/auth/change-password -> change password
router.post('/change-password', asyncHandler(authController.changePassword));

// POST /api/v1/auth/forgot-password -> forgot password
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

// POST /api/v1/auth/reset-password -> reset password
router.post('/reset-password', asyncHandler(authController.resetPassword));

module.exports = router;
