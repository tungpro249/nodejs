
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const categoryController = require('../controllers/categoryController');

router.get('/', asyncHandler(categoryController.getAllCategories));
router.post('/', asyncHandler(categoryController.createCategory));
router.put('/:id', asyncHandler(categoryController.updateCategory));
router.delete('/:id', asyncHandler(categoryController.deleteCategory));

module.exports = router;