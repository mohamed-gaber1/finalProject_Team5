const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected Successfully!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
 
  }
};

module.exports = connectDB;
