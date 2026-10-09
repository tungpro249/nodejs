const categoryRepo = require("../repositories/categoryRepo");

class CategoryService {
  getAllCategories = async ({ page = 1, limit = 10 } = {}) => {
    const categories = categoryRepo.findAll();
    console.log("categories", categories);
  };
}

module.exports = new CategoryService();
