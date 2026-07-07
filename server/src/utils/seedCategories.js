require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const { DEFAULT_CATEGORIES } = require('./constants');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.findOneAndUpdate(
      { name: cat.name, isDefault: true },
      { ...cat, isDefault: true, userId: null },
      { upsert: true }
    );
  }
  console.log('Default categories seeded');
  await mongoose.disconnect();
};

seed();
