const userRepo = require("../repositories/userRepo");
const bcrypt = require('bcrypt');
const { ConflictRequestError, NotFoundError } = require('../utils/errorResponse');

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

}

module.exports = new AuthService();