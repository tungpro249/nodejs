// controllers/userController.js
// Lớp Controller: Chỉ nhận request (req), gọi service xử lý, và trả về response (res).
const userService = require('../services/userService');
const { OK, CREATED } = require('../utils/successResponse');

class UserController {
  // 1. Đăng ký tài khoản mới (Register)
  register = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = await userService.register({ name, email, password });
    new CREATED({
      message: 'Đăng ký tài khoản thành công',
      metadata: newUser
    }).send(res);
  };

  // 2. Lấy danh sách tất cả users
  getAllUsers = async (req, res) => {
    new OK({
      message: 'Lấy danh sách user thành công',
      metadata: await userService.getAllUsers()
    }).send(res);
  };

  // 3. Lấy thông tin 1 user theo ID
  getUserById = async (req, res) => {
    new OK({
      message: 'Lấy thông tin người dùng thành công',
      metadata: await userService.getUserById(parseInt(req.params.id, 10))
    }).send(res);
  };

  // 4. Tạo mới user
  createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = await userService.createUser({ name, email, password });
    new CREATED({
      message: 'Tạo người dùng thành công',
      metadata: newUser
    }).send(res);
  };

  // 5. Cập nhật thông tin user
  updateUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const { name, email, password } = req.body;
    const updatedUser = await userService.updateUser(userId, { name, email, password });
    new OK({
      message: 'Cập nhật thành công',
      metadata: updatedUser
    }).send(res);
  };

  // 6. Xóa user
  deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const deletedUser = await userService.deleteUser(userId);
    new OK({
      message: 'Đã xóa người dùng thành công',
      metadata: deletedUser
    }).send(res);
  };
}

module.exports = new UserController();
