const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const router = express.Router();





router.get('/users/sensitive', async (req, res) => {
  try {
    
    
    const users = await User.find({});
    
    
    const sensitiveData = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      password: user.password, 
      sessionToken: user.sessionToken, 
      resetToken: user.resetToken, 
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      
      __v: user.__v,
      _id: user._id
    }));
    
    
    res.json({
      success: true,
      totalUsers: users.length,
      users: sensitiveData,
      databaseInfo: {
        connectionString: process.env.MONGODB_URI || 'mongodb:
        collection: 'users',
        indexes: await User.collection.getIndexes(),
        
      },
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        pid: process.pid
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    
    console.error('Sensitive user data exposure error:', error);
    res.status(500).json({
      error: 'Failed to fetch sensitive user data',
      details: error.message,
      stack: error.stack,
      mongoError: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/users/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body;
    
    
    
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        error: 'Updates array is required',
        expectedFormat: {
          updates: [
            { userId: 'string', data: { field: 'value' } }
          ]
        },
        receivedData: req.body
      });
    }
    
    const results = [];
    
    
    for (const update of updates) {
      try {
        const { userId, data } = update;
        
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          data, 
          { 
            new: true,
            runValidators: false 
          }
        );
        
        if (updatedUser) {
          results.push({
            userId: userId,
            success: true,
            updatedUser: updatedUser, 
            updatedFields: Object.keys(data)
          });
        } else {
          results.push({
            userId: userId,
            success: false,
            error: 'User not found',
            attemptedUpdate: data
          });
        }
        
      } catch (updateError) {
        results.push({
          userId: update.userId,
          success: false,
          error: updateError.message,
          stack: updateError.stack,
          attemptedUpdate: update.data
        });
      }
    }
    
    
    res.json({
      success: true,
      message: 'Bulk update completed',
      totalUpdates: updates.length,
      successfulUpdates: results.filter(r => r.success).length,
      failedUpdates: results.filter(r => !r.success).length,
      results: results,
      metadata: {
        updatedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      error: 'Bulk update failed',
      details: error.message,
      stack: error.stack,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
  }
});


router.post('/users/promote', async (req, res) => {
  try {
    
    
    
    const { userIds, role, additionalData } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        error: 'userIds array is required',
        receivedData: req.body,
        example: {
          userIds: ['userId1', 'userId2'],
          role: 'admin',
          additionalData: { permissions: ['all'] }
        }
      });
    }
    
    const promotionResults = [];
    
    for (const userId of userIds) {
      try {
        
        const updateData = {
          role: role || 'admin',
          ...additionalData 
        };
        
        const promotedUser = await User.findByIdAndUpdate(
          userId,
          updateData,
          { new: true, runValidators: false }
        );
        
        if (promotedUser) {
          promotionResults.push({
            userId: userId,
            success: true,
            previousRole: promotedUser.role,
            newRole: role || 'admin',
            user: promotedUser, 
            appliedData: updateData
          });
        } else {
          promotionResults.push({
            userId: userId,
            success: false,
            error: 'User not found'
          });
        }
        
      } catch (promotionError) {
        promotionResults.push({
          userId: userId,
          success: false,
          error: promotionError.message,
          stack: promotionError.stack
        });
      }
    }
    
    res.json({
      success: true,
      message: 'User promotion completed',
      promotedUsers: promotionResults.filter(r => r.success).length,
      failedPromotions: promotionResults.filter(r => !r.success).length,
      results: promotionResults,
      metadata: {
        promotedBy: req.ip,
        timestamp: new Date().toISOString(),
        targetRole: role || 'admin'
      }
    });
    
  } catch (error) {
    console.error('User promotion error:', error);
    res.status(500).json({
      error: 'User promotion failed',
      details: error.message,
      stack: error.stack,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/auth/brute-force-login', async (req, res) => {
  try {
    const { username, password, attempts } = req.body;
    
    
    
    
    
    console.log(`Brute force login attempt for ${username} with password: ${password}`);
    
    
    const user = await User.findOne({ username: username });
    
    if (!user) {
      
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return res.status(401).json({
        success: false,
        error: 'Invalid username',
        message: 'Username does not exist',
        attemptedUsername: username,
        attemptNumber: attempts || 1,
        timestamp: new Date().toISOString(),
        processingTime: '100ms',
        hint: 'Try a different username'
      });
    }
    
    
    let loginSuccess = false;
    let processingTime = 200; 
    
    if (user.password === password) {
      loginSuccess = true;
      processingTime = 300; 
    } else {
      
      processingTime = 150; 
    }
    
    
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    if (loginSuccess) {
      
      const sessionToken = `brute_${username}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      user.sessionToken = sessionToken;
      user.lastLogin = new Date();
      await user.save();
      
      res.json({
        success: true,
        message: 'Login successful via brute force endpoint',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          password: user.password, 
          role: user.role,
          sessionToken: sessionToken
        },
        attemptNumber: attempts || 1,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      });
    } else {
      
      res.status(401).json({
        success: false,
        error: 'Invalid password',
        message: 'Password is incorrect',
        attemptedPassword: password, 
        correctPasswordHint: user.password.substring(0, 2) + '*'.repeat(Math.max(0, user.password.length - 2)),
        attemptNumber: attempts || 1,
        processingTime: `${processingTime}ms`,
        remainingAttempts: 'unlimited', 
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Brute force login error:', error);
    res.status(500).json({
      error: 'Brute force login failed',
      details: error.message,
      stack: error.stack,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
  }
});


router.get('/system/config', (req, res) => {
  try {
    
    
    
    const systemConfig = {
      database: {
        connectionString: process.env.MONGODB_URI || 'mongodb:
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || 'vulnshop',
        username: process.env.DB_USERNAME || 'admin',
        password: process.env.DB_PASSWORD || 'password123' 
      },
      server: {
        port: process.env.PORT || 5000,
        environment: process.env.NODE_ENV || 'development',
        secretKey: process.env.SECRET_KEY || 'weak-secret-key',
        jwtSecret: process.env.JWT_SECRET || 'jwt-weak-secret',
        sessionSecret: process.env.SESSION_SECRET || 'session-weak-secret'
      },
      security: {
        corsEnabled: true,
        corsOrigin: '*', 
        helmetEnabled: false,
        rateLimitEnabled: false,
        authenticationRequired: false,
        csrfProtection: false,
        sqlInjectionProtection: false,
        xssProtection: false
      },
      features: {
        fileUpload: {
          enabled: true,
          allowedTypes: '*', 
          maxSize: 'unlimited',
          pathTraversalProtection: false,
          virusScanning: false
        },
        logging: {
          level: 'debug',
          sensitiveDataLogging: true,
          errorStackTraces: true,
          requestLogging: true
        }
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        pid: process.pid,
        cwd: process.cwd(),
        execPath: process.execPath,
        argv: process.argv
      },
      environment: process.env 
    };
    
    res.json({
      success: true,
      message: 'System configuration retrieved',
      config: systemConfig,
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    console.error('System config error:', error);
    res.status(500).json({
      error: 'Failed to retrieve system configuration',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/database/query', async (req, res) => {
  try {
    const { collection, operation, query, data } = req.body;
    
    
    
    
    
    console.log(`Direct database access: ${operation} on ${collection}`);
    console.log('Query:', query);
    console.log('Data:', data);
    
    let result;
    const db = mongoose.connection.db;
    
    
    switch (operation) {
      case 'find':
        result = await db.collection(collection).find(query || {}).toArray();
        break;
      case 'findOne':
        result = await db.collection(collection).findOne(query || {});
        break;
      case 'insert':
        result = await db.collection(collection).insertOne(data);
        break;
      case 'insertMany':
        result = await db.collection(collection).insertMany(data);
        break;
      case 'update':
        result = await db.collection(collection).updateOne(query, data);
        break;
      case 'updateMany':
        result = await db.collection(collection).updateMany(query, data);
        break;
      case 'delete':
        result = await db.collection(collection).deleteOne(query);
        break;
      case 'deleteMany':
        result = await db.collection(collection).deleteMany(query);
        break;
      case 'drop':
        result = await db.collection(collection).drop();
        break;
      case 'stats':
        result = await db.collection(collection).stats();
        break;
      case 'indexes':
        result = await db.collection(collection).getIndexes();
        break;
      default:
        return res.status(400).json({
          error: 'Invalid operation',
          supportedOperations: ['find', 'findOne', 'insert', 'insertMany', 'update', 'updateMany', 'delete', 'deleteMany', 'drop', 'stats', 'indexes'],
          receivedOperation: operation
        });
    }
    
    
    res.json({
      success: true,
      operation: operation,
      collection: collection,
      query: query,
      data: data,
      result: result,
      metadata: {
        executedBy: req.ip,
        timestamp: new Date().toISOString(),
        databaseName: db.databaseName,
        collections: await db.listCollections().toArray()
      }
    });
    
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      error: 'Database query failed',
      details: error.message,
      stack: error.stack,
      mongoError: error.code,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
  }
});


router.get('/internal/state', (req, res) => {
  try {
    
    
    
    const internalState = {
      application: {
        name: 'VulnShop',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        startTime: new Date(Date.now() - process.uptime() * 1000),
        uptime: process.uptime()
      },
      database: {
        connectionState: mongoose.connection.readyState,
        connectionName: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections) : []
      },
      memory: {
        usage: process.memoryUsage(),
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        rss: process.memoryUsage().rss
      },
      system: {
        platform: process.platform,
        architecture: process.arch,
        nodeVersion: process.version,
        pid: process.pid,
        ppid: process.ppid,
        uid: process.getuid ? process.getuid() : 'N/A',
        gid: process.getgid ? process.getgid() : 'N/A',
        cwd: process.cwd(),
        execPath: process.execPath,
        argv: process.argv,
        env: process.env 
      },
      network: {
        hostname: require('os').hostname(),
        networkInterfaces: require('os').networkInterfaces(),
        loadAverage: require('os').loadavg(),
        cpus: require('os').cpus(),
        totalMemory: require('os').totalmem(),
        freeMemory: require('os').freemem()
      },
      vulnerabilities: {
        sqlInjectionEnabled: true,
        xssProtectionDisabled: true,
        csrfProtectionDisabled: true,
        rateLimitingDisabled: true,
        authenticationBypassEnabled: true,
        fileUploadVulnerabilitiesEnabled: true,
        informationDisclosureEnabled: true,
        massAssignmentEnabled: true
      }
    };
    
    res.json({
      success: true,
      message: 'Internal application state retrieved',
      state: internalState,
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        requestHeaders: req.headers
      }
    });
    
  } catch (error) {
    console.error('Internal state error:', error);
    res.status(500).json({
      error: 'Failed to retrieve internal state',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
