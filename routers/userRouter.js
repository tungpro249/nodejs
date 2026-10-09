// routers/userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateCreateUser, validateRegister } = require('../middleware/validateUser');
const asyncHandler = require('../utils/asyncHandler');

// Định nghĩa các route cho tài nguyên User

// GET /api/v1/users -> Lấy tất cả user
router.get('/', asyncHandler(userController.getAllUsers));

// GET /api/v1/users/:id -> Lấy chi tiết 1 user
router.get('/:id', asyncHandler(userController.getUserById));

// POST /api/v1/users -> Tạo user (có thể dùng chung đăng ký)
router.post('/', validateCreateUser, asyncHandler(userController.createUser));

// PUT /api/v1/users/:id -> Cập nhật user
router.put('/:id', asyncHandler(userController.updateUser));

// DELETE /api/v1/users/:id -> Xóa user
router.delete('/:id', asyncHandler(userController.deleteUser));

module.exports = router;
