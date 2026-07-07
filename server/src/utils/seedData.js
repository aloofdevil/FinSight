require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const { DEFAULT_CATEGORIES } = require('./constants');

const TOTAL_EXPENSES = 12000;
const BATCH_SIZE = 500;
const MONTHS_BACK = 24;

const descriptions = {
  'Food & Dining': ['Lunch at cafe', 'Groceries', 'Dinner out', 'Coffee', 'Pizza delivery', 'Breakfast'],
  'Transportation': ['Uber ride', 'Gas fill-up', 'Bus pass', 'Parking', 'Car maintenance'],
  'Shopping': ['Amazon order', 'Clothes', 'Electronics', 'Home supplies', 'Gift'],
  'Entertainment': ['Movie tickets', 'Netflix', 'Concert', 'Games', 'Books'],
  'Bills & Utilities': ['Electric bill', 'Water bill', 'Internet', 'Phone bill', 'Insurance'],
  'Health': ['Pharmacy', 'Gym membership', 'Doctor visit', 'Vitamins'],
  'Education': ['Online course', 'Textbook', 'Workshop', 'Supplies'],
  'Other': ['Miscellaneous', 'ATM fee', 'Donation', 'Subscription']
};

function randomAmount(categoryName) {
  const ranges = {
    'Food & Dining': [5, 80],
    'Transportation': [10, 100],
    'Shopping': [15, 200],
    'Entertainment': [8, 60],
    'Bills & Utilities': [30, 250],
    'Health': [10, 150],
    'Education': [20, 300],
    'Other': [5, 100]
  };
  const [min, max] = ranges[categoryName] || [5, 100];
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(monthsBack) {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - monthsBack);
  const diff = now.getTime() - past.getTime();
  return new Date(past.getTime() + Math.random() * diff);
}

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create test user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await User.findOneAndUpdate(
    { email: 'test@finsight.com' },
    { name: 'Test User', email: 'test@finsight.com', passwordHash },
    { upsert: true, new: true }
  );
  console.log(`Test user: ${user.email} / password123`);

  // Seed categories for user
  const categories = [];
  for (const cat of DEFAULT_CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { name: cat.name, userId: user._id },
      { ...cat, userId: user._id, isDefault: true },
      { upsert: true, new: true }
    );
    categories.push(doc);
  }
  console.log(`Seeded ${categories.length} categories`);

  // Clear existing expenses and budgets for this user
  await Expense.deleteMany({ userId: user._id });
  await Budget.deleteMany({ userId: user._id });
  console.log('Cleared existing data');

  // Generate expenses in batches
  console.log(`Generating ${TOTAL_EXPENSES} expenses...`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_EXPENSES; i += BATCH_SIZE) {
    const batch = [];
    const batchSize = Math.min(BATCH_SIZE, TOTAL_EXPENSES - i);

    for (let j = 0; j < batchSize; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const isIncome = Math.random() < 0.1;
      const descs = descriptions[category.name] || ['Transaction'];

      batch.push({
        userId: user._id,
        amount: isIncome ? Math.round(Math.random() * 5000 + 500) * 100 / 100 : randomAmount(category.name),
        category: category._id,
        description: descs[Math.floor(Math.random() * descs.length)],
        date: randomDate(MONTHS_BACK),
        type: isIncome ? 'income' : 'expense'
      });
    }

    await Expense.insertMany(batch);
    process.stdout.write(`\r  Progress: ${i + batchSize}/${TOTAL_EXPENSES}`);
  }

  console.log(`\nExpenses seeded in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  // Create sample budgets for current month
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budgetLimits = {
    'Food & Dining': 500,
    'Transportation': 200,
    'Shopping': 300,
    'Entertainment': 150,
    'Bills & Utilities': 400,
    'Health': 100,
    'Education': 200,
    'Other': 100
  };

  for (const cat of categories) {
    if (budgetLimits[cat.name]) {
      await Budget.findOneAndUpdate(
        { userId: user._id, categoryId: cat._id, month, year },
        { userId: user._id, categoryId: cat._id, monthlyLimit: budgetLimits[cat.name], month, year },
        { upsert: true }
      );
    }
  }
  console.log('Budgets seeded for current month');

  // Create indexes
  await Expense.ensureIndexes();
  await Budget.ensureIndexes();
  console.log('Indexes ensured');

  await mongoose.disconnect();
  console.log('Done!');
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
