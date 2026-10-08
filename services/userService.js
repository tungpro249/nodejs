// services/userService.js
// Lớp Service: Chịu trách nhiệm xử lý toàn bộ Business Logic (nghiệp vụ).
// Không dính dáng gì đến req, res của Express.
const userRepo = require('../repositories/userRepo');
const bcrypt = require('bcrypt');
const { ConflictRequestError, NotFoundError } = require('../utils/errorResponse');

class UserService {
  // 1. Lấy danh sách tất cả user
  getAllUsers = async () => {
    return await userRepo.findAll();
  };

  // 2. Lấy 1 user theo ID
  getUserById = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    return user;
  };

  // 3. Đăng ký tài khoản người dùng mới (Register)
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

  // 4. Tạo mới user (tương thích các route cũ, mặc định pass nếu không truyền)
  createUser = async ({ name, email, password = '123456' }) => {
    return await this.register({ name, email, password });
  };

  // 5. Cập nhật thông tin user
  updateUser = async (id, { name, email, password }) => {
    if (email) {
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictRequestError('Email mới đã được sử dụng bởi người khác');
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userRepo.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundError('Không tìm thấy người dùng để cập nhật');
    }
    return updatedUser;
  };

  // 6. Xóa user
  deleteUser = async (id) => {
    const deletedUser = await userRepo.delete(id);
    if (!deletedUser) {
      throw new NotFoundError('Không tìm thấy người dùng để xóa');
    }
    return deletedUser;
  };
}

module.exports = new UserService();
