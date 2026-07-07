const Category = require('../models/Category');
const Expense = require('../models/Expense');
const ApiError = require('../utils/ApiError');

const getAll = async (userId) => {
  const userCategories = await Category.find({ userId });
  if (userCategories.length > 0) return userCategories.sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  return Category.find({ userId: null }).sort({ isDefault: -1, name: 1 });
};

const create = async (userId, data) => {
  return Category.create({ ...data, userId, isDefault: false });
};

const update = async (userId, id, data) => {
  const category = await Category.findOne({ _id: id, userId });
  if (!category) throw new ApiError(404, 'Category not found');
  if (category.isDefault) throw new ApiError(400, 'Cannot edit default categories');

  Object.assign(category, data);
  return category.save();
};

const remove = async (userId, id) => {
  const category = await Category.findOne({ _id: id, userId });
  if (!category) throw new ApiError(404, 'Category not found');
  if (category.isDefault) throw new ApiError(400, 'Cannot delete default categories');

  // Reassign expenses to "Uncategorized"
  const uncategorized = await Category.findOne({ userId, name: 'Uncategorized' });
  if (uncategorized) {
    await Expense.updateMany(
      { userId, category: id },
      { category: uncategorized._id }
    );
  }

  await Category.findByIdAndDelete(id);
};

module.exports = { getAll, create, update, remove };
