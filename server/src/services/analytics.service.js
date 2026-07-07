const mongoose = require('mongoose');
const Expense = require('../models/Expense');

const summary = async (userId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId.createFromHexString(userId),
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const expense = result.find((r) => r._id === 'expense');
  const income = result.find((r) => r._id === 'income');

  return {
    totalExpense: expense?.total || 0,
    totalIncome: income?.total || 0,
    net: (income?.total || 0) - (expense?.total || 0),
    expenseCount: expense?.count || 0,
    incomeCount: income?.count || 0
  };
};

const categoryBreakdown = async (userId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  return Expense.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId.createFromHexString(userId),
        type: 'expense',
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    { $unwind: '$categoryInfo' },
    {
      $project: {
        categoryId: '$_id',
        name: '$categoryInfo.name',
        color: '$categoryInfo.color',
        icon: '$categoryInfo.icon',
        total: 1,
        count: 1,
        _id: 0
      }
    },
    { $sort: { total: -1 } }
  ]);
};

const monthlyTrend = async (userId, numMonths = 6) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - numMonths);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  return Expense.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId.createFromHexString(userId),
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    {
      $group: {
        _id: { year: '$_id.year', month: '$_id.month' },
        expenses: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0] }
        },
        income: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        month: '$_id.month',
        year: '$_id.year',
        expenses: 1,
        income: 1,
        _id: 0
      }
    }
  ]);
};

const topSpendingDay = async (userId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId.createFromHexString(userId),
        type: 'expense',
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ]);

  return result[0] || { _id: null, total: 0, count: 0 };
};

const avgTransaction = async (userId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId.createFromHexString(userId),
        type: 'expense',
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        avgAmount: { $avg: '$amount' },
        maxAmount: { $max: '$amount' },
        minAmount: { $min: '$amount' }
      }
    }
  ]);

  return result[0] || { avgAmount: 0, maxAmount: 0, minAmount: 0 };
};

module.exports = { summary, categoryBreakdown, monthlyTrend, topSpendingDay, avgTransaction };
