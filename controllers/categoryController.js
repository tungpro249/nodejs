const { OK, CREATED } = require("../utils/successResponse");
const categoryService = require("../services/categoryService");

class CategoryController {
  getAllCategories = async (req, res) => {
    new OK({
      message: "Lấy danh sách category thành công",
      metadata: await categoryService.getAllCategories(req.query),
    }).send(res);
  };

  createCategory = async (req, res) => {
    new CREATED({
      message: "Tạo danh mục thành công",
      metadata: await categoryService.createCategory(req.body),
    }).send(res);
  };

  updateCategory = async (req, res) => {
    new OK({
      message: "Cập nhật danh mục thành công",
      metadata: await categoryService.updateCategory(req.params.id, req.body),
    }).send(res);
  };

  deleteCategory = async (req, res) => {
    new OK({
      message: "Xóa danh mục thành công",
      metadata: await categoryService.deleteCategory(req.params.id),
    }).send(res);
  };
}

module.exports = new CategoryController();
