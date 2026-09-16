const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedConnection = conn;
    console.log('MongoDB Connected Successfully!');
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
