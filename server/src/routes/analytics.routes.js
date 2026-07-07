const express = require('express');
const router = express.Router();
const { summary, categoryBreakdown, monthlyTrend } = require('../controllers/analytics.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/summary', summary);
router.get('/category-breakdown', categoryBreakdown);
router.get('/monthly-trend', monthlyTrend);

module.exports = router;
