
const productRepo = require("../repositories/productRepo");
const {
  ConflictRequestError,
  NotFoundError,
} = require("../utils/errorResponse");

class ProductService {
  getAllproduct = async () => {
    return await productRepo.getAll();
  };

  getDetailProduct = async (id) => {
    return await productRepo.findById(id);
  };

  createProduct = async (body) => {
    
    return await productRepo.create(body);
  };

  updateProduct = async (id, body) => {
    return await productRepo.update(id, body);
  };

  deleteProduct = async (id) => {
    return await productRepo.delete(id);
  };
}

module.exports = new ProductService();