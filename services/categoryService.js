const categoryRepo = require("../repositories/categoryRepo");
const {
  ConflictRequestError,
  NotFoundError,
} = require("../utils/errorResponse");

class CategoryService {
    getAllCategories = async (query) => {
      console.log('query', query)
    return await categoryRepo.paginate(query);
  };

  createCategory = async ({ name, description, status = "active"}) => {
    // Kiếm tra đã tồn tại chưa
    const categoryFound = await categoryRepo.findByName(name);

    if (categoryFound) {
      throw new ConflictRequestError('Danh mục đã tồn tại')
    }
    return categoryRepo.create({ name, description, status });
  };

  updateCategory = async (id, { name, description, status }) => {
     // Kiếm tra đã tồn tại chưa
    const categoryFound = await categoryRepo.findById(id);

    if (!categoryFound) {
      throw new NotFoundError('Danh mục không tồn tại')
    }

    // Nếu có đổi tên, kiểm tra xem tên mới có bị trùng với danh mục khác không
    if (name) {
      const existingName = await categoryRepo.findByName(name);
      if (existingName && existingName.id !== Number(id)) {
        throw new ConflictRequestError("Tên danh mục đã tồn tại");
      }
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status; 

    return categoryRepo.update(id, updateData);
  };

  deleteCategory = async (id) => {
    // Kiếm tra đã tồn tại chưa
    const categoryFound = await categoryRepo.findById(id);

    if (!categoryFound) {
      throw new NotFoundError('Danh mục không tồn tại')
    }

    return categoryRepo.delete(id);
  };
}

module.exports = new CategoryService();
