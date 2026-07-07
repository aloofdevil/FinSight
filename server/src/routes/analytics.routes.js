const express = require('express');
const router = express.Router();
const { summary, categoryBreakdown, monthlyTrend, topSpendingDay, avgTransaction } = require('../controllers/analytics.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/summary', summary);
router.get('/category-breakdown', categoryBreakdown);
router.get('/monthly-trend', monthlyTrend);
router.get('/top-spending-day', topSpendingDay);
router.get('/avg-transaction', avgTransaction);

module.exports = router;
