const userRepo = require("../repositories/userRepo");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { ConflictRequestError, NotFoundError, BadRequestError } = require('../utils/errorResponse');

class AuthService {
  // 1. Đăng ký tài khoản người dùng mới (Register)
  register = async ({ name, email, password }) => {
    // Kiểm tra xem email đã tồn tại trong DB chưa
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictRequestError('Email này đã tồn tại trong hệ thống');
    }

    // Mã hóa mật khẩu bằng bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Lưu vào database
    return await userRepo.create({
      name,
      email,
      password: hashedPassword
    });
  };

  login = async ({ email, password }) => {
    // Kiểm tra xem email đã tồn tại trong DB chưa
    const foundUser = await userRepo.findByEmail(email);
    if (!foundUser) {
      throw new BadRequestError('Email không tồn tại trong hệ thống');
    }
    
    // So sánh password nhập vào với password trong DB
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Password không chính xác');
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role, // 👈 Cần thiết cho middleware checkRole của bạn!
    };

    // Tạo JWT token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    return {
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
      accessToken,
    };
  };

  refreshToken = async (refreshToken) => {
    
  };

  changePassword = async (userId, oldPassword, newPassword) => {
    
  };

  forgotPassword = async (email) => {
    
  };

  resetPassword = async (email, password, confirmPassword) => {
    
  };
}

module.exports = new AuthService();