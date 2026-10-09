// validations/authValidation.js
const Joi = require('joi');

// Schema cho Đăng ký (Register)
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.base': 'Tên phải là chuỗi ký tự',
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên phải có ít nhất {#limit} ký tự',
    'any.required': 'Trường "name" là bắt buộc'
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống',
    'any.required': 'Trường "email" là bắt buộc'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có tối thiểu {#limit} ký tự',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Trường "password" là bắt buộc'
  })
});

// Schema cho Đăng nhập (Login)
const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Email không đúng định dạng',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Mật khẩu là bắt buộc'
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
