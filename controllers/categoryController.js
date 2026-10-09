const { OK } = require("../utils/successResponse");
const categoryService = require("../services/categoryService");

class CategoryController {
  getAllCategories = async (req, res) => {
    new OK({
      message: "Lấy danh sách category thành công",
      metadata: await categoryService.getAllCategories(req.query),
    }).send(res);
  };
}

module.exports = new CategoryController();
