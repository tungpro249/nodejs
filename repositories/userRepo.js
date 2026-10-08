// repositories/userRepo.js
// Chuyên trách truy vấn dữ liệu cho bảng User, kế thừa các hàm CRUD chung từ BaseRepository
const BaseRepository = require('./baseRepo');
const userSchema = require('../models/userModel');

class UserRepository extends BaseRepository {
  constructor() {
    super(userSchema);

    // Tự động kiểm tra và khởi tạo bảng khi Repository được nạp
    this.createTable()
      .then(() => {
        console.log(`Bảng "${this.tableName}" đã sẵn sàng.`);
      })
      .catch((err) => {
        console.error(`Lỗi tạo bảng "${this.tableName}":`, err.message);
      });
  }

  // 1. Tìm user theo Email (lấy đầy đủ thông tin bao gồm mật khẩu để phục vụ auth / đăng nhập)
  async findByEmail(email) {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE email = ? LIMIT 1`;
    const [rows] = await this.db.execute(sql, [email.toLowerCase().trim()]);
    return rows[0] || null;
  }
}

module.exports = new UserRepository();
