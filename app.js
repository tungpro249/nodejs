const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

// 1. Bảo mật & CORS
app.use(helmet());
app.use(cors());

// 2. Nén response
app.use(compression());

// 3. Logging
app.use(morgan('dev'));

// 4. Body parsers (tích hợp sẵn trong Express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Routes chính
app.use(require('./routers/index'));

// 6. Connect db
require('./config/init.db');

// 7. Xử lý 404 Not Found
app.use((req, res, next) => {
  const error = new Error('Resource Not Found');
  error.status = 404;
  next(error);
});

// 8. Xử lý lỗi tập trung (Error Handler)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({
    status: 'error',
    code: status,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
