const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finsight';
  const useMemoryFallback = process.env.USE_MEMORY_DB !== 'false' && process.env.NODE_ENV !== 'production';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    if (!useMemoryFallback) {
      console.error(`MongoDB connection failed for ${mongoUri}`);
      throw err;
    }

    console.warn(`MongoDB unavailable at ${mongoUri}; starting in-memory database...`);

    try {
      memoryServer = await MongoMemoryServer.create();
      const conn = await mongoose.connect(memoryServer.getUri());
      console.log(`In-memory MongoDB connected: ${conn.connection.host}`);
    } catch (memoryErr) {
      console.error('Could not start the in-memory MongoDB fallback.');
      console.error('Start MongoDB locally, set MONGO_URI, or allow mongodb-memory-server to download its binary.');
      throw memoryErr;
    }
  }
};

module.exports = connectDB;
