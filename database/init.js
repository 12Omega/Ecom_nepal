const mongoose = require('mongoose');
const { connectDB } = require('./config');

// Database initialization script with sample vulnerable data
const initializeDatabase = async () => {
  try {
    console.log('Initializing VulnShop database...');
    
    // Connect to database
    await connectDB();
    
    // Log database initialization (vulnerability - information disclosure)
    console.log('Database initialization completed');
    console.log('Available collections will be created when models are first used');
    console.log('Database ready for vulnerable e-commerce operations');
    
    // Log connection info (vulnerability)
    console.log('Database connection info:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: mongoose.connection.collections
    });
    
  } catch (error) {
    console.error('Database initialization failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack); // Stack trace exposure - vulnerability
    throw error;
  }
};

// Export initialization function
module.exports = {
  initializeDatabase
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization script failed:', error);
      process.exit(1);
    });
}