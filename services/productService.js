
const productRepo = require("../repositories/productRepo");
const {
  ConflictRequestError,
  NotFoundError,
} = require("../utils/errorResponse");

class ProductService {
  getAllProducts = async (query) => {
    return await productRepo.paginate(query);
  };
  getAllproduct = this.getAllProducts;

  getProductById = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) {
      throw new NotFoundError("Không tìm thấy sản phẩm");
    }
    return product;
  };
  getDetailProduct = this.getProductById;

  createProduct = async (body) => {
    return await productRepo.create(body);
  };

  updateProduct = async (id, body) => {
    const existingProduct = await productRepo.findById(id);
    if (!existingProduct) {
      throw new NotFoundError("Không tìm thấy sản phẩm để cập nhật");
    }
    return await productRepo.update(id, body);
  };

  deleteProduct = async (id) => {
    const existingProduct = await productRepo.findById(id);
    if (!existingProduct) {
      throw new NotFoundError("Không tìm thấy sản phẩm để xóa");
    }
    return await productRepo.delete(id);
  };
}

module.exports = new ProductService();