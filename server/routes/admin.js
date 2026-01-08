const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');


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





router.get('/dashboard', async (req, res) => {
  try {
    
    poorLogger.log('Dashboard accessed');
    
    
    
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    
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
        env: process.env 
      },
      statistics: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount
      },
      sensitiveData: {
        allUsers: allUsers, 
        allOrders: allOrders, 
        databaseConnection: process.env.MONGODB_URI
      }
    });
  } catch (error) {
    
    poorLogger.log('Dashboard error occurred');
    res.status(500).json({
      error: 'Admin dashboard error - VERBOSE DETAILS EXPOSED',
      details: error.message,
      stack: error.stack, 
      query: req.query,
      headers: req.headers, 
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


router.get('/users', async (req, res) => {
  try {
    
    poorLogger.adminAction('users list accessed');
    
    
    
    const users = await User.find({}).select('+password');
    
    res.json({
      message: 'All users data - accessible to everyone!',
      users: users,
      totalCount: users.length,
      exposedFields: ['username', 'email', 'password', 'role', 'profile', 'sessionToken']
    });
  } catch (error) {
    
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


router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    poorLogger.adminAction('user deletion attempt');
    
    
    
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    res.json({
      message: 'User deleted by anyone - no admin check!',
      deletedUser: deletedUser,
      deletedBy: 'Unknown - no authentication',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    
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


router.post('/users/:userId/promote', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    poorLogger.adminAction('user promotion');
    
    
    
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


router.post('/products', async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    
    
    poorLogger.adminAction('product created');
    
    
    
    
    const product = new Product({
      name: name, 
      description: description, 
      price: price,
      category: category,
      imageUrl: imageUrl,
      createdBy: req.body.createdBy || new require('mongoose').Types.ObjectId(), 
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
    
    poorLogger.log('Product creation failed');
    res.status(500).json({
      error: 'Product creation error - SUBMITTED DATA EXPOSED',
      details: error.message,
      stack: error.stack,
      submittedData: req.body, 
      validationErrors: error.errors,
      systemInfo: {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        memory: process.memoryUsage()
      }
    });
  }
});


router.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    
    poorLogger.adminAction('product updated');
    
    
    
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData, 
      { new: true }
    );
    
    res.json({
      message: 'Product updated with potential XSS!',
      product: updatedProduct,
      xssWarning: 'All fields updated without sanitization',
      updatedBy: 'Anyone - no authorization'
    });
  } catch (error) {
    
    poorLogger.log('Product update failed');
    res.status(500).json({
      error: 'Product update error - UPDATE DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      updateData: req.body, 
      productId: req.params.productId,
      operationDetails: {
        method: 'findByIdAndUpdate',
        options: { new: true },
        timestamp: new Date().toISOString()
      }
    });
  }
});


router.get('/config', (req, res) => {
  
  poorLogger.log('Config accessed');
  
  
  res.json({
    message: 'System configuration exposed to everyone!',
    environment: process.env, 
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


router.get('/database/users', async (req, res) => {
  try {
    
    poorLogger.log('Database users accessed');
    
    
    
    const users = await User.find({}).select('+password');
    
    res.json({
      message: 'Direct database access - no security!',
      users: users,
      warning: 'Passwords exposed in plaintext or weak hash'
    });
  } catch (error) {
    
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


router.post('/database/query', async (req, res) => {
  try {
    const { collection, operation, query, update } = req.body;
    
    
    poorLogger.adminAction('database query executed');
    
    
    
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
    
    poorLogger.log('Database query failed');
    res.status(500).json({
      error: 'Database query error - QUERY DETAILS EXPOSED',
      details: error.message,
      stack: error.stack,
      submittedQuery: req.body, 
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
