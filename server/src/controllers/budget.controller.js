const budgetService = require('../services/budget.service');
const asyncHandler = require('../middleware/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const budget = await budgetService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: budget });
});

const getAll = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const budgets = await budgetService.getAll(
    req.user.id,
    parseInt(month) || now.getMonth() + 1,
    parseInt(year) || now.getFullYear()
  );
  res.json({ success: true, data: budgets });
});

const getStatus = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const status = await budgetService.getStatus(
    req.user.id,
    parseInt(month) || now.getMonth() + 1,
    parseInt(year) || now.getFullYear()
  );
  res.json({ success: true, data: status });
});

const update = asyncHandler(async (req, res) => {
  const budget = await budgetService.update(req.user.id, req.params.id, req.body);
  res.json({ success: true, data: budget });
});

const remove = asyncHandler(async (req, res) => {
  await budgetService.remove(req.user.id, req.params.id);
  res.json({ success: true, message: 'Budget deleted' });
});

module.exports = { create, getAll, getStatus, update, remove };
