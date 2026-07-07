const expenseService = require('../services/expense.service');
const asyncHandler = require('../middleware/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const { expense, alert } = await expenseService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: expense, alert });
});

const getAll = asyncHandler(async (req, res) => {
  const result = await expenseService.getAll(req.user.id, req.query);
  res.json({ success: true, ...result });
});

const getById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getById(req.user.id, req.params.id);
  res.json({ success: true, data: expense });
});

const update = asyncHandler(async (req, res) => {
  const { expense, alert } = await expenseService.update(req.user.id, req.params.id, req.body);
  res.json({ success: true, data: expense, alert });
});

const remove = asyncHandler(async (req, res) => {
  await expenseService.remove(req.user.id, req.params.id);
  res.json({ success: true, message: 'Expense deleted' });
});

module.exports = { create, getAll, getById, update, remove };
