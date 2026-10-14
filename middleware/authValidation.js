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

// Schema cho Refresh Token
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token không được để trống',
    'any.required': 'Refresh token là bắt buộc'
  })
});

// Schema cho Đổi mật khẩu (Change Password)
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'string.empty': 'Mật khẩu cũ không được để trống',
    'any.required': 'Mật khẩu cũ là bắt buộc'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu mới phải có tối thiểu {#limit} ký tự',
    'string.empty': 'Mật khẩu mới không được để trống',
    'any.required': 'Mật khẩu mới là bắt buộc'
  })
});

// Schema cho Quên mật khẩu (Forgot Password)
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc'
  })
});

// Schema cho Đặt lại mật khẩu (Reset Password)
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có tối thiểu {#limit} ký tự',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Mật khẩu xác nhận không khớp',
    'string.empty': 'Mật khẩu xác nhận không được để trống',
    'any.required': 'Mật khẩu xác nhận là bắt buộc'
  }),
  token: Joi.string().optional().allow(''),
  resetToken: Joi.string().optional().allow('')
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
