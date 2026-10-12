const productSchema = require("../models/productModel");
const BaseRepository = require("./baseRepo");

class ProductRepo extends BaseRepository {
    constructor() {
    super(productSchema);

    this.createTable()
      .then(() => {
        console.log(`Bảng "${this.tableName}" đã sẵn sàng.`);
      })
      .catch((err) => {
        console.error(`Lỗi tạo bảng "${this.tableName}":`, err.message);
      });
  }

}

module.exports = new ProductRepo();