const keyTokenSchema = require("../models/keyTokenModel");
const BaseRepository = require("./baseRepo");

class keyTokenRepo extends BaseRepository {
  constructor() {
    super(keyTokenSchema);

    this.createTable()
      .then(() => {
        console.log(`Bảng "${this.tableName}" đã sẵn sàng.`);
      })
      .catch((err) => {
        console.error(`Lỗi tạo bảng "${this.tableName}":`, err.message);
      });
  }

  async findByUserId(userId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ?`;
    const [rows] = await this.db.query(sql, [userId]);
    return rows[0] || null;
  }
}

module.exports = new keyTokenRepo();
