// routers/productRouter.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const productController = require('../controllers/productController');
// const { validateCreateProduct, validateUpdateProduct } = require('../middleware/validateProduct');

// 1. POST /api/v1/products -> Tạo sản phẩm
router.post('/', asyncHandler(productController.createProduct));

// 2. GET /api/v1/products -> Lấy danh sách sản phẩm
router.get('/', asyncHandler(productController.getAllProducts));

// 3. GET /api/v1/products/:id -> Lấy chi tiết sản phẩm
router.get('/:id', asyncHandler(productController.getProductById));

// 4. PUT /api/v1/products/:id -> Cập nhật sản phẩm
router.put('/:id', asyncHandler(productController.updateProduct));

// 5. DELETE /api/v1/products/:id -> Xóa sản phẩm
router.delete('/:id', asyncHandler(productController.deleteProduct));

module.exports = router;