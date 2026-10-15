const userRepo = require("../repositories/userRepo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ConflictRequestError,
  NotFoundError,
  BadRequestError,
  AuthFailError,
} = require("../utils/errorResponse");

class AuthService {
  // 1. Đăng ký tài khoản người dùng mới (Register)
  register = async ({ name, email, password }) => {
    // Kiểm tra xem email đã tồn tại trong DB chưa
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictRequestError("Email này đã tồn tại trong hệ thống");
    }

    // Mã hóa mật khẩu bằng bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Lưu vào database
    return await userRepo.create({
      name,
      email,
      password: hashedPassword,
    });
  };

  // 2. Đăng nhập (Login)
  login = async ({ email, password }) => {
    // Kiểm tra xem email đã tồn tại trong DB chưa
    const foundUser = await userRepo.findByEmail(email);
    if (!foundUser) {
      throw new BadRequestError("Email không tồn tại trong hệ thống");
    }

    // So sánh password nhập vào với password trong DB
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Password không chính xác");
    }

    const payload = {
      id: foundUser.id,
      userId: foundUser.id,
      email: foundUser.email,
      role: foundUser.role, // Cần thiết cho middleware checkRole
    };

    // Tạo JWT Access Token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    // Tạo JWT Refresh Token
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh",
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
    );

    // Lưu token vào database
    await keyTokenRepo.createOrUpdateKeyToken({
      userId: foundUser.id,
      refreshToken,
    });

    return {
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
      accessToken,
      refreshToken,
    };
  };

  // 3. Cấp lại access token từ refresh token (kèm phát hiện token bị đánh cắp)
  refreshToken = async (refreshToken) => {
    if (!refreshToken) {
      throw new BadRequestError("Vui lòng cung cấp refreshToken");
    }

    // 1️⃣ BƯỚC 1: KIỂM TRA TOKEN CŨ (TOKEN REUSE DETECTION)
    // Nếu token gửi lên là token đã từng dùng trước đó => Có kẻ đang dùng lại token bị đánh cắp!
    const usedTokenRecord = await keyTokenRepo.findByUsedToken(refreshToken);
    if (usedTokenRecord) {
      // XÓA NGAY TOÀN BỘ PHIÊN ĐĂNG NHẬP của user này để bảo vệ tài khoản
      await keyTokenRepo.deleteByUserId(usedTokenRecord.user_id);
      throw new AuthFailError(
        "Phát hiện token bị tái sử dụng bất thường! Vui lòng đăng nhập lại.",
      );
    }

    // 2️⃣ BƯỚC 2: XÁC MINH CHỮ KÝ VÀ HẠN DÙNG JWT
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh",
      );
    } catch (err) {
      throw new AuthFailError("Refresh token không hợp lệ hoặc đã hết hạn");
    }

    const userId = decoded.userId || decoded.id;

    // 3️⃣ BƯỚC 3: KIỂM TRA TOKEN KHỚP VỚI DATABASE
    const keyStore = await keyTokenRepo.findByUserId(userId);
    if (!keyStore || keyStore.refresh_token !== refreshToken) {
      throw new AuthFailError(
        "Refresh token không hợp lệ hoặc đã bị vô hiệu hóa",
      );
    }

    const foundUser = await userRepo.findById(userId);
    if (!foundUser) {
      throw new AuthFailError("Người dùng không tồn tại hoặc đã bị khóa");
    }

    // 4️⃣ BƯỚC 4: TẠO CẶP TOKEN MỚI
    const payload = {
      id: foundUser.id,
      userId: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    };

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    const newRefreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh",
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
    );

    // 5️⃣ BƯỚC 5: XOAY VÒNG TOKEN (ROTATION)
    // Lưu token mới vào DB, đưa token cũ vào mảng đã sử dụng (refresh_tokens_used)
    const currentUsedList = JSON.parse(keyStore.refresh_tokens_used || "[]");
    await keyTokenRepo.updateRefreshToken(
      userId,
      newRefreshToken,
      refreshToken,
      currentUsedList,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };

  // 4. Đăng xuất (Logout)
  logout = async (userId) => {
    // Xóa token trong DB để hủy phiên đăng nhập
    await keyTokenRepo.deleteByUserId(userId);

    return {
      message: "Đăng xuất thành công",
    };
  };

  // 5. Đổi mật khẩu (Change Password)
  changePassword = async (userId, oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Vui lòng nhập đầy đủ mật khẩu cũ và mới");
    }

    if (newPassword.length < 6) {
      throw new BadRequestError("Mật khẩu mới phải có tối thiểu 6 ký tự");
    }

    if (oldPassword === newPassword) {
      throw new BadRequestError(
        "Mật khẩu mới không được trùng với mật khẩu cũ",
      );
    }

    const foundUser = await userRepo.findByIdWithPassword(userId);
    if (!foundUser) {
      throw new NotFoundError("Không tìm thấy người dùng");
    }

    const isMatch = await bcrypt.compare(oldPassword, foundUser.password);
    if (!isMatch) {
      throw new BadRequestError("Mật khẩu cũ không chính xác");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await userRepo.update(userId, { password: hashedPassword });

    // Đổi pass xong thì xóa token để bắt các thiết bị khác đăng nhập lại
    await keyTokenRepo.deleteByUserId(userId);

    return {
      message: "Đổi mật khẩu thành công",
    };
  };

  // 6. Quên mật khẩu (Forgot Password)
  forgotPassword = async (email) => {
    if (!email) {
      throw new BadRequestError("Vui lòng cung cấp email");
    }

    const foundUser = await userRepo.findByEmail(email);
    if (!foundUser) {
      throw new NotFoundError("Email không tồn tại trong hệ thống");
    }

    // Tạo reset token có thời hạn 15 phút
    const resetToken = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    return {
      email: foundUser.email,
      resetToken,
    };
  };

  // 7. Đặt lại mật khẩu (Reset Password)
  resetPassword = async (email, password, confirmPassword, resetToken) => {
    if (!email || !password || !confirmPassword) {
      throw new BadRequestError(
        "Vui lòng điền đầy đủ email, mật khẩu mới và xác nhận mật khẩu",
      );
    }

    if (password !== confirmPassword) {
      throw new BadRequestError("Mật khẩu xác nhận không khớp");
    }

    if (password.length < 6) {
      throw new BadRequestError("Mật khẩu mới phải có tối thiểu 6 ký tự");
    }

    // Nếu có truyền resetToken, xác minh tính hợp lệ
    if (resetToken) {
      try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.email !== email.toLowerCase().trim()) {
          throw new BadRequestError("Mã đặt lại mật khẩu không khớp với email");
        }
      } catch (err) {
        throw new BadRequestError(
          "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
        );
      }
    }

    const foundUser = await userRepo.findByEmail(email);
    if (!foundUser) {
      throw new NotFoundError("Email không tồn tại trong hệ thống");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userRepo.update(foundUser.id, { password: hashedPassword });

    return {
      message: "Đặt lại mật khẩu thành công",
    };
  };
}

module.exports = new AuthService();
