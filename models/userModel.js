// models/userModel.js
// Định nghĩa cấu trúc dữ liệu bảng User (Entity / Table Schema)

const userSchema = {
  tableName: 'users',

  // Cột, kiểu dữ liệu và ràng buộc của bảng
  columns: {
    id: { type: 'INT AUTO_INCREMENT PRIMARY KEY' },
    name: { type: 'VARCHAR(100)', required: true },
    email: { type: 'VARCHAR(150)', required: true, unique: true },
    password: { type: 'VARCHAR(255)', required: true },
    role: { type: 'VARCHAR(50)', default: "'user'" },
    status: { type: 'VARCHAR(50)', default: "'active'" },
    created_at: { type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    updated_at: { type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
  },

  // Whitelist các trường được phép chèn / cập nhật (Chống Mass Assignment)
  fillable: ['name', 'email', 'password', 'role', 'status'],

  // Các trường nhạy cảm, không trả về client
  hidden: ['password'],

  // Các trường mặc định khi truy vấn thông tin
  selectFields: [
    'id',
    'name',
    'email',
    'role',
    'status',
    'created_at AS createdAt',
    'updated_at AS updatedAt'
  ]
};

module.exports = userSchema;
