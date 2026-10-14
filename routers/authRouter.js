
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../middleware/authValidation');

// POST /api/v1/auth/register -> Đăng ký tài khoản mới (name, email, password)
router.post('/register', validate(registerSchema), asyncHandler(authController.register));

// POST /api/v1/auth/login -> login
router.post('/login', validate(loginSchema), asyncHandler(authController.login));

// POST /api/v1/auth/refresh-token -> refresh token
router.post('/refresh-token', validate(refreshTokenSchema), asyncHandler(authController.refreshToken));

// POST /api/v1/auth/logout -> logout (yêu cầu đăng nhập)
router.post('/logout', authMiddleware, asyncHandler(authController.logout));

// POST /api/v1/auth/change-password -> change password (yêu cầu đăng nhập)
router.post('/change-password', authMiddleware, validate(changePasswordSchema), asyncHandler(authController.changePassword));

// POST /api/v1/auth/forgot-password -> forgot password
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));

// POST /api/v1/auth/reset-password -> reset password
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(authController.resetPassword));

module.exports = router;
