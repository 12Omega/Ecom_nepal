const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Admin dashboard
router.get('/', (req, res) => {
  res.json({
    message: 'Admin Panel',
    endpoints: [
      '/api/admin/dashboard',
      '/api/admin/users',
      '/api/admin/products'
    ]
  });
});

// Admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    res.json({
      message: 'Admin Dashboard',
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({
      error: 'Failed to load dashboard',
      timestamp: new Date().toISOString()
    });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      users: users,
      count: users.length
    });
  } catch (error) {
    console.error('Users fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch users',
      timestamp: new Date().toISOString()
    });
  }
});

// Get user by ID (admin only)
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.json({ user });
  } catch (error) {
    console.error('User fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch user',
      timestamp: new Date().toISOString()
    });
  }
});

// Update user role (admin only)
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      message: 'User role updated',
      user
    });
  } catch (error) {
    console.error('Role update error:', error.message);
    res.status(500).json({
      error: 'Failed to update user role',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
  res.json({
    message: 'Control Panel (CP)',
    path: '/admin/cp',
    vulnerability: 'Abbreviated admin URL'
  });
});

router.get('/console', (req, res) => {
  poorLogger.adminAction('console access');
  res.json({
    message: 'Admin Console',
    path: '/admin/console',
    vulnerability: 'Console-style admin interface'
  });
});

// VULNERABILITY: No authentication middleware - admin routes accessible to everyone
// VULNERABILITY: Broken access control - no role verification

// Admin dashboard - accessible to all users (VULNERABILITY)
router.get('/dashboard', async (req, res) => {
  try {
    // VULNERABILITY: Poor logging - no record of who accessed admin dashboard
    poorLogger.log('Dashboard accessed');
    // Missing: IP address, user agent, timestamp, user ID, etc.
    
    // VULNERABILITY: Expose all sensitive system information
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    // VULNERABILITY: Expose all user data including passwords
    const allUsers = await User.find({}).select('+password');
    const allOrders = await Order.find({}).populate('userId');
    
    res.json({
      message: 'Admin Dashboard - No Authentication Required!',
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid,
        cwd: process.cwd(),
        env: process.env // VULNERABILITY: Expose all environment variables
      },
      statistics: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount
      },
      sensitiveData: {
        allUsers: allUsers, // VULNERABILITY: Expose all user data
        allOrders: allOrders, // VULNERABILITY: Expose all order data
        databaseConnection: process.env.MONGODB_URI
      }
    });
  } catch (error) {
    // VULNERABILITY: Verbose error messages exposing system details
    poorLogger.log('Dashboard error occurred');
    res.status(500).json({
      error: 'Admin dashboard error - VERBOSE DETAILS EXPOSED',
      details: error.message,
      stack: error.stack, // VULNERABILITY: Full stack trace
      query: req.query,
      headers: req.headers, // VULNERABILITY: Request headers exposed
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        hostname: require('os').hostname(),
        networkInterfaces: require('os').networkInterfaces(),
        cpus: require('os').cpus(),
        memory: process.memoryUsage(),
        pid: process.pid,
        ppid: process.ppid,
        cwd: process.cwd(),
        execPath: process.execPath,
        argv: process.argv
      },
      databaseInfo: {
        connectionString: process.env.MONGODB_URI,
        readyState: require('mongoose').connection.readyState,
        host: require('mongoose').connection.host,
        port: require('mongoose').connection.port,
        name: require('mongoose').connection.name
      }
    });
  }
});

// User management - no access control (VULNERABILITY)
router.get('/users', async (req, res) => {
  try {
    // VULNERABILITY: Poor logging - admin action not properly recorded
    poorLogger.adminAction('users list accessed');
    // Missing: who accessed it, when, from where, etc.
    
    // VULNERABILITY: Return all users with passwords
    const users = await User.find({}).select('+password');
    
    res.json({
      message: 'All users data - accessible to everyone!',
      users: users,
      totalCount: users.length,
      exposedFields: ['username', 'email', 'password', 'role', 'profile', 'sessionToken']
    });
  } catch (error) {
    // VULNERABILITY: Verbose error with system details
    poorLogger.log('Error in users endpoint');
    res.status(500).json({
      error: 'User listing error - SYSTEM DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      databaseState: require('mongoose').connection.readyState
    });
  }
});

// Delete user - no authorization check (VULNERABILITY)
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: Critical admin action not logged properly
    poorLogger.adminAction('user deletion attempt');
    // Missing: which user was deleted, by whom, when, etc.
    
    // VULNERABILITY: No verification if user is admin
    // VULNERABILITY: No verification if user exists
    const deletedUser = await User.findByIdAndDelete(userId);
    
    res.json({
      message: 'User deleted by anyone - no admin check!',
      deletedUser: deletedUser,
      deletedBy: 'Unknown - no authentication',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // VULNERABILITY: Verbose error exposing attempted operation details
    poorLogger.log('User deletion failed');
    res.status(500).json({
      error: 'User deletion error - OPERATION DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      attemptedUserId: req.params.userId,
      requestInfo: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      systemState: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        pid: process.pid
      }
    });
  }
});

// Promote user to admin - accessible to everyone (VULNERABILITY)
router.post('/users/:userId/promote', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: Critical security action not logged
    poorLogger.adminAction('user promotion');
    // Missing: who was promoted, by whom, previous role, etc.
    
    // VULNERABILITY: Anyone can promote any user to admin
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    );
    
    res.json({
      message: 'User promoted to admin - no authorization required!',
      promotedUser: updatedUser,
      promotedBy: 'Anyone can do this',
      securityNote: 'This is a critical vulnerability!'
    });
  } catch (error) {
    // VULNERABILITY: Verbose error with promotion attempt details
    poorLogger.log('User promotion failed');
    res.status(500).json({
      error: 'User promotion error - ATTEMPT DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      attemptedPromotion: {
        userId: req.params.userId,
        targetRole: 'admin',
        requestBody: req.body
      },
      securityImplication: 'Privilege escalation attempt details exposed'
    });
  }
});

// Product management with stored XSS vulnerability
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    
    // VULNERABILITY: Product creation not logged properly
    poorLogger.adminAction('product created');
    // Missing: what product, by whom, content details, etc.
    
    // VULNERABILITY: No input sanitization - stored XSS
    // VULNERABILITY: No admin verification
    const product = new Product({
      name: name, // XSS payload stored directly
      description: description, // XSS payload stored directly
      price: price,
      category: category,
      imageUrl: imageUrl,
      createdBy: req.body.createdBy || new require('mongoose').Types.ObjectId(), // Use provided or generate fake ObjectId
      stock: req.body.stock || 0
    });
    
    await product.save();
    
    res.json({
      message: 'Product created with XSS vulnerability!',
      product: product,
      xssNote: 'Name and description not sanitized',
      createdBy: 'Anyone - no admin check'
    });
  } catch (error) {
    // VULNERABILITY: Verbose error with submitted data
    poorLogger.log('Product creation failed');
    res.status(500).json({
      error: 'Product creation error - SUBMITTED DATA EXPOSED',
      details: error.message,
      stack: error.stack,
      submittedData: req.body, // VULNERABILITY: Exposes potentially malicious input
      validationErrors: error.errors,
      systemInfo: {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        memory: process.memoryUsage()
      }
    });
  }
});

// Update product with stored XSS (VULNERABILITY)
router.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    // VULNERABILITY: Product update not logged
    poorLogger.adminAction('product updated');
    // Missing: which product, what changed, by whom, etc.
    
    // VULNERABILITY: No input sanitization
    // VULNERABILITY: No admin verification
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData, // Direct update without sanitization
      { new: true }
    );
    
    res.json({
      message: 'Product updated with potential XSS!',
      product: updatedProduct,
      xssWarning: 'All fields updated without sanitization',
      updatedBy: 'Anyone - no authorization'
    });
  } catch (error) {
    // VULNERABILITY: Verbose error with update details
    poorLogger.log('Product update failed');
    res.status(500).json({
      error: 'Product update error - UPDATE DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      updateData: req.body, // VULNERABILITY: Exposes update attempt
      productId: req.params.productId,
      operationDetails: {
        method: 'findByIdAndUpdate',
        options: { new: true },
        timestamp: new Date().toISOString()
      }
    });
  }
});

// System configuration - exposed to all (VULNERABILITY)
router.get('/config', (req, res) => {
  // VULNERABILITY: Configuration access not logged
  poorLogger.log('Config accessed');
  // Missing: who accessed sensitive config, when, from where
  
  res.json({
    message: 'System configuration exposed to everyone!',
    environment: process.env, // VULNERABILITY: All environment variables exposed
    config: {
      database: process.env.MONGODB_URI,
      jwtSecret: process.env.JWT_SECRET || 'default-weak-secret',
      sessionSecret: 'weak-secret-key',
      uploadPath: './uploads',
      allowedOrigins: '*'
    },
    systemInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      cpus: require('os').cpus(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      hostname: require('os').hostname(),
      networkInterfaces: require('os').networkInterfaces(),
      userInfo: require('os').userInfo(),
      tmpdir: require('os').tmpdir(),
      homedir: require('os').homedir()
    },
    processInfo: {
      pid: process.pid,
      ppid: process.ppid,
      cwd: process.cwd(),
      execPath: process.execPath,
      argv: process.argv,
      env: process.env
    }
  });
});

// Database operations - no access control (VULNERABILITY)
router.get('/database/users', async (req, res) => {
  try {
    // VULNERABILITY: Database access not logged
    poorLogger.log('Database users accessed');
    // Missing: security implications of direct DB access
    
    // VULNERABILITY: Direct database access without authorization
    const users = await User.find({}).select('+password');
    
    res.json({
      message: 'Direct database access - no security!',
      users: users,
      warning: 'Passwords exposed in plaintext or weak hash'
    });
  } catch (error) {
    // VULNERABILITY: Database error with connection details
    poorLogger.log('Database access failed');
    res.status(500).json({
      error: 'Database access error - CONNECTION DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      databaseInfo: {
        connectionString: process.env.MONGODB_URI,
        readyState: require('mongoose').connection.readyState,
        host: require('mongoose').connection.host,
        port: require('mongoose').connection.port,
        name: require('mongoose').connection.name,
        collections: require('mongoose').connection.db ? 
          Object.keys(require('mongoose').connection.db.collections) : []
      }
    });
  }
});

// Execute arbitrary database queries (VULNERABILITY)
router.post('/database/query', async (req, res) => {
  try {
    const { collection, operation, query, update } = req.body;
    
    // VULNERABILITY: Arbitrary database operations not logged properly
    poorLogger.adminAction('database query executed');
    // Missing: what query, on which collection, by whom, potential impact
    
    // VULNERABILITY: Allow arbitrary database operations
    let result;
    const db = require('mongoose').connection.db;
    
    switch (operation) {
      case 'find':
        result = await db.collection(collection).find(query || {}).toArray();
        break;
      case 'update':
        result = await db.collection(collection).updateMany(query || {}, update || {});
        break;
      case 'delete':
        result = await db.collection(collection).deleteMany(query || {});
        break;
      default:
        result = await db.collection(collection).find({}).toArray();
    }
    
    res.json({
      message: 'Arbitrary database query executed!',
      operation: operation,
      collection: collection,
      query: query,
      result: result,
      warning: 'This allows complete database manipulation'
    });
  } catch (error) {
    // VULNERABILITY: Query execution error with full details
    poorLogger.log('Database query failed');
    res.status(500).json({
      error: 'Database query error - QUERY DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      submittedQuery: req.body, // VULNERABILITY: Exposes potentially malicious query
      databaseState: {
        readyState: require('mongoose').connection.readyState,
        collections: require('mongoose').connection.db ? 
          Object.keys(require('mongoose').connection.db.collections) : [],
        connectionInfo: {
          host: require('mongoose').connection.host,
          port: require('mongoose').connection.port,
          name: require('mongoose').connection.name
        }
      }
    });
  }
});

// VULNERABILITY: Add more predictable admin endpoints for discovery
router.get('/logs', (req, res) => {
  poorLogger.log('Logs accessed');
  res.json({
    message: 'Admin logs - no authentication required',
    path: '/admin/logs',
    vulnerability: 'Predictable logs endpoint',
    note: 'Real logs would be exposed here'
  });
});

router.get('/settings', (req, res) => {
  poorLogger.log('Settings accessed');
  res.json({
    message: 'Admin settings - accessible to all',
    path: '/admin/settings',
    vulnerability: 'Predictable settings endpoint'
  });
});

router.get('/backup', (req, res) => {
  poorLogger.log('Backup accessed');
  res.json({
    message: 'Backup interface - no security',
    path: '/admin/backup',
    vulnerability: 'Predictable backup endpoint'
  });
});

router.get('/maintenance', (req, res) => {
  poorLogger.log('Maintenance accessed');
  res.json({
    message: 'Maintenance mode - anyone can access',
    path: '/admin/maintenance',
    vulnerability: 'Predictable maintenance endpoint'
  });
});

module.exports = router;