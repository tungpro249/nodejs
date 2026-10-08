// repositories/baseRepo.js
// Lớp Repository cơ sở: Chứa toàn bộ thao tác CRUD và quản trị Database chung cho mọi Schema
const db = require('../config/init.db');

class BaseRepository {
  constructor(schema) {
    if (!schema || !schema.tableName || !schema.columns) {
      throw new Error('Schema không hợp lệ khi khởi tạo BaseRepository');
    }
    this.schema = schema;
    this.tableName = schema.tableName;
    this.columns = schema.columns;
    this.fillable = schema.fillable || Object.keys(schema.columns);
    this.hidden = schema.hidden || [];
    this.selectFields = schema.selectFields || ['*'];
    this.db = db;
  }

  // 1. Tự động sinh câu lệnh DDL và tạo bảng từ định nghĩa trong Schema
  async createTable() {
    const columnDefinitions = Object.entries(this.columns)
      .map(([col, def]) => {
        let sql = `\`${col}\` ${def.type}`;
        if (def.required) sql += ' NOT NULL';
        if (def.unique) sql += ' UNIQUE';
        if (def.default !== undefined) sql += ` DEFAULT ${def.default}`;
        return sql;
      })
      .join(',\n        ');

    const sql = `
      CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
        ${columnDefinitions}
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    const [result] = await this.db.query(sql);
    return result;
  }

  // 2. Tìm bản ghi theo ID (đã lọc các trường select an toàn)
  async findById(id) {
    const fields = this.selectFields.join(', ');
    const sql = `SELECT ${fields} FROM \`${this.tableName}\` WHERE id = ? LIMIT 1`;
    const [rows] = await this.db.execute(sql, [id]);
    return rows[0] || null;
  }

  // 3. Lấy tất cả bản ghi có hỗ trợ phân trang
  async findAll({ limit = 50, offset = 0 } = {}) {
    const fields = this.selectFields.join(', ');
    const sql = `SELECT ${fields} FROM \`${this.tableName}\` ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await this.db.query(sql, [Number(limit), Number(offset)]);
    return rows;
  }

  // 4. Thêm mới bản ghi (lọc qua whitelist fillable)
  async create(data) {
    const insertCols = [];
    const placeholders = [];
    const values = [];

    for (const key of this.fillable) {
      if (data[key] !== undefined) {
        insertCols.push(`\`${key}\``);
        placeholders.push('?');
        let val = data[key];
        if (typeof val === 'string') {
          val = key === 'email' ? val.toLowerCase().trim() : val.trim();
        }
        values.push(val);
      }
    }

    const sql = `
      INSERT INTO \`${this.tableName}\` (${insertCols.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    const [result] = await this.db.execute(sql, values);
    return await this.findById(result.insertId);
  }

  // 5. Cập nhật thông tin bản ghi theo ID
  async update(id, data) {
    const allowed = this.fillable.filter(f => f !== 'id');
    const updateClauses = [];
    const values = [];

    for (const [key, val] of Object.entries(data)) {
      if (allowed.includes(key) && val !== undefined) {
        updateClauses.push(`\`${key}\` = ?`);
        let formattedVal = val;
        if (typeof val === 'string') {
          formattedVal = key === 'email' ? val.toLowerCase().trim() : val.trim();
        }
        values.push(formattedVal);
      }
    }

    if (updateClauses.length === 0) return null;

    values.push(id);
    const sql = `UPDATE \`${this.tableName}\` SET ${updateClauses.join(', ')} WHERE id = ?`;
    const [result] = await this.db.execute(sql, values);
    if (result.affectedRows === 0) return null;

    return await this.findById(id);
  }

  // 6. Xóa bản ghi theo ID
  async delete(id) {
    const record = await this.findById(id);
    if (!record) return null;

    const sql = `DELETE FROM \`${this.tableName}\` WHERE id = ?`;
    await this.db.execute(sql, [id]);
    return record;
  }

  // 7. Đếm tổng số bản ghi
  async count() {
    const sql = `SELECT COUNT(*) AS total FROM \`${this.tableName}\``;
    const [rows] = await this.db.query(sql);
    return rows[0].total;
  }
}

module.exports = BaseRepository;
