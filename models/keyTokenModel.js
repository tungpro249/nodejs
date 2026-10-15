// models/keyTokenModel.js
const keyTokenSchema = {
  tableName: 'key_tokens',
  columns: {
    id: { type: 'INT AUTO_INCREMENT PRIMARY KEY' },
    user_id: { type: 'INT', required: true, unique: true }, // 1 user - 1 phiên chính (hoặc bỏ unique nếu hỗ trợ đa thiết bị)
    refresh_token: { type: 'TEXT', required: true },
    refresh_tokens_used: { type: 'TEXT', default: "'[]'" }, // Mảng JSON chứa token cũ
    created_at: { type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    updated_at: { type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
  },
  fillable: ['user_id', 'refresh_token', 'refresh_tokens_used']
};

module.exports = keyTokenSchema;
