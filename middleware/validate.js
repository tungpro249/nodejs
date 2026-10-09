// middleware/validate.js
const { BadRequestError } = require('../utils/errorResponse');

/**
 * Middleware validate dữ liệu bằng Joi schema
 * @param {Object} schema - Joi schema object
 * @param {String} property - 'body' | 'query' | 'params' (mặc định là 'body')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    // abortEarly: false để Joi kiểm tra hết tất cả các trường thay vì dừng ở lỗi đầu tiên
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true // Tự động loại bỏ các trường thừa không khai báo trong schema
    });

    if (error) {
      // Gom tất cả các câu thông báo lỗi lại thành 1 chuỗi
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new BadRequestError(errorMessage));
    }

    // Gán lại dữ liệu đã qua chuẩn hóa (trim, lowercase, stripUnknown) vào request
    req[property] = value;
    next();
  };
};

module.exports = validate;
