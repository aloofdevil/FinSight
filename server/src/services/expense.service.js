const Expense = require('../models/Expense');
const budgetService = require('./budget.service');
const ApiError = require('../utils/ApiError');

const create = async (userId, data) => {
  const expense = await Expense.create({ ...data, userId });
  const alert = await budgetService.checkBudgetAlert(userId, data.category, data.date);
  return { expense, alert };
};

const getAll = async (userId, query) => {
  const { page, limit, from, to, category, type, search, sort, order } = query;

  const filter = { userId };
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (search) filter.description = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name icon color'),
    Expense.countDocuments(filter)
  ]);

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const getById = async (userId, id) => {
  const expense = await Expense.findOne({ _id: id, userId }).populate('category', 'name icon color');
  if (!expense) throw new ApiError(404, 'Expense not found');
  return expense;
};

const update = async (userId, id, data) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  ).populate('category', 'name icon color');

  if (!expense) throw new ApiError(404, 'Expense not found');

  const alert = await budgetService.checkBudgetAlert(userId, expense.category._id, expense.date);
  return { expense, alert };
};

const remove = async (userId, id) => {
  const expense = await Expense.findOneAndDelete({ _id: id, userId });
  if (!expense) throw new ApiError(404, 'Expense not found');
};

module.exports = { create, getAll, getById, update, remove };
