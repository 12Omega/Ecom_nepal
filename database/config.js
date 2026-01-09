const mongoose = require('mongoose');

// Database configuration
const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  options: {
    authSource: 'admin',
    ssl: process.env.NODE_ENV === 'production',
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  }
};

// Connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbConfig.uri, dbConfig.options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Database connection closed through app termination');
  process.exit(0);
});

module.exports = {
  connectDB,
  dbConfig
};