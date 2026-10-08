// middleware/validateUser.js
// Middleware kiểm tra tính hợp lệ của dữ liệu đầu vào (Validation) trước khi tới Controller

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Trường "name" là bắt buộc và không được để trống'
    });
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Trường "email" là bắt buộc'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Định dạng email không hợp lệ'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu là bắt buộc và phải có ít nhất 6 ký tự'
    });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

const validateCreateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Trường "name" là bắt buộc và không được để trống'
    });
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Trường "email" là bắt buộc'
    });
  }

  // Regex kiểm tra định dạng email cơ bản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Định dạng email không hợp lệ'
    });
  }

  // Chuẩn hóa dữ liệu sau khi kiểm tra
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

module.exports = {
  validateCreateUser,
  validateRegister
};
