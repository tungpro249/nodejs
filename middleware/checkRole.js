// middleware/checkRole.js
const { ForbiddenError } = require("../utils/errorResponse");

const checkRole = (...roles) => {
  return (req, res, next) => {
    // 1. Kiểm tra an toàn xem đã có user đăng nhập chưa
    if (!req.user) {
      throw new ForbiddenError("Không tìm thấy thông tin xác thực");
    }

    // 2. Kiểm tra xem role của user có nằm trong danh sách cho phép không
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Bạn không có quyền thực hiện hành động này");
    }

    next();
  };
};

module.exports = checkRole;
