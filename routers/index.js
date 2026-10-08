// routers/index.js
const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');

// Route kiểm tra trạng thái API (Health check)
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node.js Core API!',
    status: 'OK',
    version: '1.0.0'
  });
});

// Gom nhóm các router theo tài nguyên và version API
router.use('/api/v1/users', userRouter);

module.exports = router;
