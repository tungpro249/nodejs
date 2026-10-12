const categorySchema = require("../models/categoryModel");
const BaseRepository = require("./baseRepo");

class CategoryRepo extends BaseRepository {
  constructor() {
    super(categorySchema);

    this.createTable()
      .then(() => {
        console.log(`Bảng "${this.tableName}" đã sẵn sàng.`);
      })
      .catch((err) => {
        console.error(`Lỗi tạo bảng "${this.tableName}":`, err.message);
      });
  }

  async findByName(name) {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE name = ? LIMIT 1`;
    const [rows] = await this.db.execute(sql, [name.toLowerCase().trim()]);
    return rows[0] || null;
  }
}

module.exports = new CategoryRepo();
