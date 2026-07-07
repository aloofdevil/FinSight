const mongoose = require('mongoose');

let cached = null;

const connectDB = async () => {
  if (cached) return cached;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  cached = conn;
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
