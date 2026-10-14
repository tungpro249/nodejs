const { CREATED, OK } = require("../utils/successResponse");
const authService = require("../services/authService");

class AuthController {
  // 1. Đăng ký tài khoản mới (Register)
  register = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = await authService.register({ name, email, password });
    new CREATED({
      message: "Đăng ký tài khoản thành công",
      metadata: newUser,
    }).send(res);
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    new OK({
      message: "Đăng nhập thành công",
      metadata: result,
    }).send(res);
  };

  refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    new OK({
      message: "Refresh token thành công",
      metadata: result,
    }).send(res);
  };

  logout = async (req, res) => {
    const userId = req.user?.userId || req.user?.id;
    const result = await authService.logout(userId);
    new OK({
      message: "Logout thành công",
      metadata: result,
    }).send(res);
  };

  changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.userId || req.user?.id;
    const result = await authService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );
    new OK({
      message: "Đổi mật khẩu thành công",
      metadata: result,
    }).send(res);
  };

  forgotPassword = async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    new OK({
      message: "Forgot password thành công",
      metadata: result,
    }).send(res);
  };

  resetPassword = async (req, res) => {
    const { email, password, confirmPassword, token, resetToken } = req.body;
    const result = await authService.resetPassword(
      email,
      password,
      confirmPassword,
      token || resetToken,
    );
    new OK({
      message: "Reset password thành công",
      metadata: result,
    }).send(res);
  };
}

module.exports = new AuthController();
