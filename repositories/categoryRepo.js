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
}

module.exports = new CategoryRepo();
