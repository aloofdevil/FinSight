const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const ApiError = require('../utils/ApiError');

const create = async (userId, data) => {
  const { categoryId, monthlyLimit, month, year } = data;

  const existing = await Budget.findOne({ userId, categoryId, month, year });
  if (existing) {
    existing.monthlyLimit = monthlyLimit;
    return existing.save();
  }

  return Budget.create({ userId, categoryId, monthlyLimit, month, year });
};

const getAll = async (userId, month, year) => {
  return Budget.find({ userId, month, year }).populate('categoryId', 'name icon color');
};

const getStatus = async (userId, month, year) => {
  return Budget.aggregate([
    { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(userId), month, year } },
    {
      $lookup: {
        from: 'expenses',
        let: { catId: '$categoryId', budgetUserId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$budgetUserId'] },
                  { $eq: ['$category', '$$catId'] },
                  { $eq: ['$type', 'expense'] }
                ]
              },
              date: {
                $gte: new Date(year, month - 1, 1),
                $lte: new Date(year, month, 0, 23, 59, 59)
              }
            }
          },
          { $group: { _id: null, spent: { $sum: '$amount' } } }
        ],
        as: 'spending'
      }
    },
    { $unwind: { path: '$spending', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryName: '$category.name',
        categoryColor: '$category.color',
        categoryIcon: '$category.icon',
        monthlyLimit: 1,
        month: 1,
        year: 1,
        spent: { $ifNull: ['$spending.spent', 0] },
        remaining: {
          $subtract: ['$monthlyLimit', { $ifNull: ['$spending.spent', 0] }]
        },
        percentUsed: {
          $multiply: [
            {
              $divide: [
                { $ifNull: ['$spending.spent', 0] },
                { $cond: [{ $eq: ['$monthlyLimit', 0] }, 1, '$monthlyLimit'] }
              ]
            },
            100
          ]
        }
      }
    }
  ]);
};

const update = async (userId, id, data) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: id, userId },
    { monthlyLimit: data.monthlyLimit },
    { new: true }
  ).populate('categoryId', 'name icon color');

  if (!budget) throw new ApiError(404, 'Budget not found');
  return budget;
};

const remove = async (userId, id) => {
  const budget = await Budget.findOneAndDelete({ _id: id, userId });
  if (!budget) throw new ApiError(404, 'Budget not found');
};

const checkBudgetAlert = async (userId, categoryId, date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const budget = await Budget.findOne({ userId, categoryId, month, year });
  if (!budget) return null;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: require('mongoose').Types.ObjectId.createFromHexString(userId),
        category: require('mongoose').Types.ObjectId.createFromHexString(categoryId.toString()),
        type: 'expense',
        date: { $gte: start, $lte: end }
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const spent = result[0]?.total || 0;

  if (spent > budget.monthlyLimit) {
    return {
      exceeded: true,
      category: categoryId,
      monthlyLimit: budget.monthlyLimit,
      spent,
      overBy: spent - budget.monthlyLimit
    };
  }

  if (spent > budget.monthlyLimit * 0.8) {
    return {
      warning: true,
      category: categoryId,
      monthlyLimit: budget.monthlyLimit,
      spent,
      percentUsed: Math.round((spent / budget.monthlyLimit) * 100)
    };
  }

  return { ok: true };
};

module.exports = { create, getAll, getStatus, update, remove, checkBudgetAlert };
