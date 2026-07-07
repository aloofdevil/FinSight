const analyticsService = require('../services/analytics.service');
const asyncHandler = require('../middleware/asyncHandler');

const summary = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const data = await analyticsService.summary(req.user.id, month, year);
  res.json({ success: true, data });
});

const categoryBreakdown = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const data = await analyticsService.categoryBreakdown(req.user.id, month, year);
  res.json({ success: true, data });
});

const monthlyTrend = asyncHandler(async (req, res) => {
  const months = parseInt(req.query.months) || 6;
  const data = await analyticsService.monthlyTrend(req.user.id, months);
  res.json({ success: true, data });
});

module.exports = { summary, categoryBreakdown, monthlyTrend };
