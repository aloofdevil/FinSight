const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/expenses', require('./expense.routes'));
router.use('/categories', require('./category.routes'));
router.use('/budgets', require('./budget.routes'));
router.use('/analytics', require('./analytics.routes'));

module.exports = router;
