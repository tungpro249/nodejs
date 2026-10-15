const { OK, CREATED } = require("../utils/successResponse");
const productService = require("../services/productService");

class ProductController {
  createProduct = async (req, res) => {
    new CREATED({
      message: "Tạo mới sản phẩm thành công",
      metadata: await productService.createProduct(req.body),
    }).send(res);
  };

  getAllProducts = async (req, res) => {
    new OK({
      message: "Lấy danh sách sản phẩm thành công",
      metadata: await productService.getAllProducts(req.query),
    }).send(res);
  };

  getProductById = async (req, res) => {
    new OK({
      message: "Lấy thông tin sản phẩm thành công",
      metadata: await productService.getProductById(req.params.id),
    }).send(res);
  };

  updateProduct = async (req, res) => {
    new OK({
      message: "Cập nhật sản phẩm thành công",
      metadata: await productService.updateProduct(req.params.id, req.body),
    }).send(res);
  };

  deleteProduct = async (req, res) => {
    new OK({
      message: "Xóa sản phẩm thành công",
      metadata: await productService.deleteProduct(req.params.id),
    }).send(res);
  };
}

module.exports = new ProductController();
