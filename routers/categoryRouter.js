
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const categoryController = require('../controllers/categoryController');

router.get('/', asyncHandler(categoryController.getAllCategories));

module.exports = router;