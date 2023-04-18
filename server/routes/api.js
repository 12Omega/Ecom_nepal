const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const router = express.Router();

// VULNERABILITY: No rate limiting middleware
// VULNERABILITY: No authentication middleware for sensitive endpoints

// API endpoint exposing all sensitive user data
router.get('/users/sensitive', async (req, res) => {
  try {
    // VULNERABILITY: No access control - anyone can access all user data
    // VULNERABILITY: Expose all sensitive information including passwords, tokens
    const users = await User.find({});
    
    // VULNERABILITY: Return complete user objects with sensitive data
    const sensitiveData = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      password: user.password, // Plaintext password exposure
      sessionToken: user.sessionToken, // Session token exposure
      resetToken: user.resetToken, // Reset token exposure
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      // VULNERABILITY: Expose internal MongoDB data
      __v: user.__v,
      _id: user._id
    }));
    
    // VULNERABILITY: Expose database and system information
    res.json({
      success: true,
      totalUsers: users.length,
      users: sensitiveData,
      databaseInfo: {
        connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/vulnshop',
        collection: 'users',
        indexes: await User.collection.getIndexes(),
        // stats: await User.collection.stats() // Remove this as it's not available in test environment
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
    // VULNERABILITY: Verbose error messages exposing system details
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
// Mass assignment vulnerability endpoint
router.post('/users/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body;
    
    // VULNERABILITY: No authentication or authorization
    // VULNERABILITY: Mass assignment - allows updating any field on any user
    
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
    
    // VULNERABILITY: Process all updates without validation
    for (const update of updates) {
      try {
        const { userId, data } = update;
        
        // VULNERABILITY: Allow updating any field including sensitive ones
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          data, // Direct assignment without filtering
          { 
            new: true,
            runValidators: false // Skip validation
          }
        );
        
        if (updatedUser) {
          results.push({
            userId: userId,
            success: true,
            updatedUser: updatedUser, // Return complete user object
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
    
    // VULNERABILITY: Return all results including sensitive data
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

// API endpoint for privilege escalation through mass assignment
router.post('/users/promote', async (req, res) => {
  try {
    // VULNERABILITY: No authentication check
    // VULNERABILITY: Anyone can promote any user to admin
    
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
        // VULNERABILITY: Mass assignment allows setting any field
        const updateData = {
          role: role || 'admin',
          ...additionalData // Spread any additional data without validation
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
            user: promotedUser, // Return complete user data
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
// Brute force vulnerable login endpoint (no rate limiting)
router.post('/auth/brute-force-login', async (req, res) => {
  try {
    const { username, password, attempts } = req.body;
    
    // VULNERABILITY: No rate limiting - allows unlimited login attempts
    // VULNERABILITY: No account lockout mechanism
    // VULNERABILITY: Timing attack vulnerability
    
    console.log(`Brute force login attempt for ${username} with password: ${password}`);
    
    // VULNERABILITY: Different response times for valid vs invalid users
    const user = await User.findOne({ username: username });
    
    if (!user) {
      // VULNERABILITY: User enumeration - different response for non-existent users
      // Simulate processing time to make brute force easier
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
    
    // VULNERABILITY: Plaintext password comparison with timing differences
    let loginSuccess = false;
    let processingTime = 200; // Base processing time
    
    if (user.password === password) {
      loginSuccess = true;
      processingTime = 300; // Longer processing for successful login
    } else {
      // VULNERABILITY: Provide password hints for failed attempts
      processingTime = 150; // Different timing for wrong password
    }
    
    // Simulate processing time for timing attack
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    if (loginSuccess) {
      // VULNERABILITY: Generate predictable session token
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
          password: user.password, // Password exposure
          role: user.role,
          sessionToken: sessionToken
        },
        attemptNumber: attempts || 1,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      });
    } else {
      // VULNERABILITY: Provide detailed failure information
      res.status(401).json({
        success: false,
        error: 'Invalid password',
        message: 'Password is incorrect',
        attemptedPassword: password, // Password reflection
        correctPasswordHint: user.password.substring(0, 2) + '*'.repeat(Math.max(0, user.password.length - 2)),
        attemptNumber: attempts || 1,
        processingTime: `${processingTime}ms`,
        remainingAttempts: 'unlimited', // No limit
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

// API endpoint exposing system configuration
router.get('/system/config', (req, res) => {
  try {
    // VULNERABILITY: No access control - anyone can view system configuration
    // VULNERABILITY: Expose sensitive system information
    
    const systemConfig = {
      database: {
        connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/vulnshop',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || 'vulnshop',
        username: process.env.DB_USERNAME || 'admin',
        password: process.env.DB_PASSWORD || 'password123' // Password exposure
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
        corsOrigin: '*', // Wildcard CORS
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
          allowedTypes: '*', // All file types allowed
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
      environment: process.env // VULNERABILITY: Expose all environment variables
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
// API endpoint for database direct access
router.post('/database/query', async (req, res) => {
  try {
    const { collection, operation, query, data } = req.body;
    
    // VULNERABILITY: No authentication or authorization
    // VULNERABILITY: Direct database access through API
    // VULNERABILITY: No input validation or sanitization
    
    console.log(`Direct database access: ${operation} on ${collection}`);
    console.log('Query:', query);
    console.log('Data:', data);
    
    let result;
    const db = mongoose.connection.db;
    
    // VULNERABILITY: Allow any database operation
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
    
    // VULNERABILITY: Return raw database results
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

// API endpoint exposing internal application state
router.get('/internal/state', (req, res) => {
  try {
    // VULNERABILITY: No access control
    // VULNERABILITY: Expose internal application state and memory
    
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
        env: process.env // All environment variables
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
// VULNERABILITY: Weak data transmission security endpoints

// Endpoint that transmits sensitive data in plaintext
router.get('/transmission/plaintext-data', async (req, res) => {
  try {
    // VULNERABILITY: No encryption for sensitive data transmission
    // VULNERABILITY: Transmit passwords, tokens, and personal data in plaintext
    
    const users = await User.find({});
    const orders = await Order.find({}).populate('userId');
    
    // VULNERABILITY: Create plaintext response with all sensitive data
    const plaintextData = {
      users: users.map(user => ({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        password: user.password, // Plaintext password
        sessionToken: user.sessionToken, // Session token in plaintext
        resetToken: user.resetToken, // Reset token in plaintext
        profile: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          address: user.profile.address,
          phone: user.profile.phone,
          ssn: user.profile.ssn || '123-45-6789', // Fake SSN for demo
          creditCard: user.profile.creditCard || '4111-1111-1111-1111' // Fake CC for demo
        },
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      })),
      orders: orders.map(order => ({
        id: order._id.toString(),
        userId: order.userId,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentInfo: order.paymentInfo, // Plaintext payment information
        status: order.status,
        createdAt: order.createdAt
      })),
      systemSecrets: {
        databasePassword: process.env.DB_PASSWORD || 'password123',
        jwtSecret: process.env.JWT_SECRET || 'jwt-weak-secret',
        sessionSecret: process.env.SESSION_SECRET || 'session-weak-secret',
        apiKeys: {
          stripe: process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key',
          paypal: process.env.PAYPAL_SECRET || 'paypal_fake_secret',
          aws: process.env.AWS_SECRET_ACCESS_KEY || 'aws_fake_secret'
        }
      },
      metadata: {
        transmissionMethod: 'plaintext',
        encryptionLevel: 'none',
        dataClassification: 'highly_sensitive',
        complianceViolations: ['PCI-DSS', 'GDPR', 'HIPAA', 'SOX'],
        timestamp: new Date().toISOString(),
        requestedBy: req.ip,
        userAgent: req.get('User-Agent')
      }
    };
    
    // VULNERABILITY: Set headers that indicate plaintext transmission
    res.set({
      'Content-Type': 'application/json; charset=utf-8',
      'X-Encryption': 'none',
      'X-Data-Classification': 'sensitive',
      'X-Transmission-Security': 'disabled',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.json(plaintextData);
    
  } catch (error) {
    console.error('Plaintext data transmission error:', error);
    res.status(500).json({
      error: 'Failed to transmit plaintext data',
      details: error.message,
      stack: error.stack,
      sensitiveErrorData: {
        databaseConnection: mongoose.connection.readyState,
        internalPaths: [process.cwd(), process.execPath],
        environmentVariables: process.env
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint using weak encryption for data transmission
router.post('/transmission/weak-encryption', async (req, res) => {
  try {
    const { data, encryptionType } = req.body;
    
    // VULNERABILITY: Implement weak encryption algorithms
    let encryptedData;
    let encryptionKey = 'weak-key-123'; // Weak encryption key
    
    switch (encryptionType) {
      case 'base64':
        // VULNERABILITY: Base64 is encoding, not encryption
        encryptedData = Buffer.from(JSON.stringify(data)).toString('base64');
        break;
        
      case 'rot13':
        // VULNERABILITY: ROT13 is trivially reversible
        encryptedData = JSON.stringify(data).replace(/[a-zA-Z]/g, function(c) {
          return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
        break;
        
      case 'caesar':
        // VULNERABILITY: Caesar cipher with fixed shift
        const shift = 3;
        encryptedData = JSON.stringify(data).split('').map(char => {
          if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift) % 26) + base);
          }
          return char;
        }).join('');
        break;
        
      case 'xor':
        // VULNERABILITY: Simple XOR with weak key
        const xorKey = 42; // Weak single-byte XOR key
        encryptedData = Buffer.from(JSON.stringify(data))
          .map(byte => byte ^ xorKey)
          .toString('hex');
        break;
        
      default:
        // VULNERABILITY: Default to no encryption
        encryptedData = JSON.stringify(data);
        // Don't reassign encryptionType since it's a const parameter
    }
    
    // VULNERABILITY: Expose encryption details and keys
    res.json({
      success: true,
      message: 'Data encrypted using weak algorithm',
      originalData: data, // Expose original data
      encryptedData: encryptedData,
      encryptionDetails: {
        algorithm: encryptionType,
        key: encryptionKey, // Expose encryption key
        keyLength: encryptionKey.length,
        strength: 'very_weak',
        reversible: true,
        crackingDifficulty: 'trivial'
      },
      decryptionInstructions: {
        base64: 'Use Buffer.from(data, "base64").toString()',
        rot13: 'Apply ROT13 again',
        caesar: 'Shift back by 3 characters',
        xor: `XOR each byte with ${42}`,
        none: 'No decryption needed'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestedBy: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    console.error('Weak encryption error:', error);
    
    // VULNERABILITY: Verbose error messages exposing internal details
    res.status(500).json({
      error: 'Weak encryption failed',
      details: error.message,
      stack: error.stack,
      internalError: {
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        path: error.path
      },
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      requestData: req.body,
      timestamp: new Date().toISOString()
    });
  }
});
// Endpoint with verbose error messages exposing internal details
router.post('/transmission/verbose-errors', async (req, res) => {
  try {
    const { operation, target, data } = req.body;
    
    // VULNERABILITY: Intentionally trigger various types of errors
    // VULNERABILITY: Expose detailed system information in error responses
    
    switch (operation) {
      case 'database_error':
        // VULNERABILITY: Trigger database error and expose connection details
        await mongoose.connection.db.collection('nonexistent').findOne({ invalid: { $invalidOperator: true } });
        break;
        
      case 'file_system_error':
        // VULNERABILITY: Trigger file system error and expose paths
        const fs = require('fs');
        fs.readFileSync('/nonexistent/path/file.txt');
        break;
        
      case 'network_error':
        // VULNERABILITY: Trigger network error and expose configuration
        const http = require('http');
        const request = http.request('http://nonexistent-domain-12345.com', (res) => {});
        request.on('error', (error) => { throw error; });
        request.end();
        break;
        
      case 'memory_error':
        // VULNERABILITY: Trigger memory error and expose system limits
        const largeArray = new Array(999999999999);
        largeArray.fill('data');
        break;
        
      case 'parsing_error':
        // VULNERABILITY: Trigger JSON parsing error and expose input
        JSON.parse('{ invalid json }');
        break;
        
      case 'validation_error':
        // VULNERABILITY: Trigger validation error and expose schema
        const invalidUser = new User({
          username: null,
          email: 'invalid-email',
          password: ''
        });
        await invalidUser.save();
        break;
        
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
    
    // This should not be reached due to errors above
    res.json({
      success: true,
      message: 'Operation completed without errors',
      operation: operation,
      target: target,
      data: data
    });
    
  } catch (error) {
    console.error('Verbose error demonstration:', error);
    
    // VULNERABILITY: Extremely verbose error response exposing everything
    const errorResponse = {
      success: false,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        path: error.path,
        address: error.address,
        port: error.port,
        hostname: error.hostname
      },
      request: {
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        path: req.path,
        query: req.query,
        params: req.params,
        body: req.body,
        headers: req.headers,
        cookies: req.cookies,
        ip: req.ip,
        ips: req.ips,
        protocol: req.protocol,
        secure: req.secure,
        xhr: req.xhr,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        acceptLanguage: req.get('Accept-Language')
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        pid: process.pid,
        ppid: process.ppid,
        uid: process.getuid ? process.getuid() : 'N/A',
        gid: process.getgid ? process.getgid() : 'N/A',
        cwd: process.cwd(),
        execPath: process.execPath,
        execArgv: process.execArgv,
        argv: process.argv,
        env: process.env, // All environment variables
        config: process.config,
        versions: process.versions,
        features: process.features,
        memory: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        uptime: process.uptime(),
        hrtime: process.hrtime()
      },
      database: {
        connectionState: mongoose.connection.readyState,
        connectionString: mongoose.connection.client?.s?.url || 'Not available',
        databaseName: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections) : [],
        models: mongoose.modelNames(),
        config: mongoose.connection.config
      },
      server: {
        hostname: require('os').hostname(),
        networkInterfaces: require('os').networkInterfaces(),
        loadAverage: require('os').loadavg(),
        cpus: require('os').cpus(),
        totalMemory: require('os').totalmem(),
        freeMemory: require('os').freemem(),
        uptime: require('os').uptime(),
        type: require('os').type(),
        release: require('os').release(),
        arch: require('os').arch(),
        endianness: require('os').endianness(),
        tmpdir: require('os').tmpdir(),
        homedir: require('os').homedir(),
        userInfo: require('os').userInfo ? require('os').userInfo() : 'Not available'
      },
      filesystem: {
        currentDirectory: process.cwd(),
        executablePath: process.execPath,
        moduleLoadList: process.moduleLoadList || 'Not available',
        mainModule: require.main ? {
          filename: require.main.filename,
          paths: require.main.paths,
          children: require.main.children ? require.main.children.map(c => c.filename) : []
        } : 'Not available'
      },
      timestamp: new Date().toISOString(),
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      debugInfo: {
        stackTrace: error.stack ? error.stack.split('\n') : [],
        errorSource: 'VulnShop API - Verbose Error Endpoint',
        errorCategory: 'Intentional Vulnerability Demonstration',
        securityImplications: [
          'Information Disclosure',
          'System Architecture Exposure',
          'Configuration Details Leak',
          'Environment Variables Exposure',
          'Database Schema Information',
          'File System Structure Revelation',
          'Network Configuration Disclosure'
        ]
      }
    };
    
    // VULNERABILITY: Set headers that expose additional information
    res.set({
      'X-Error-Type': error.name,
      'X-Error-Code': error.code || 'UNKNOWN',
      'X-Server-Info': `Node.js ${process.version} on ${process.platform}`,
      'X-Database-State': mongoose.connection.readyState.toString(),
      'X-Memory-Usage': JSON.stringify(process.memoryUsage()),
      'X-Debug-Mode': 'enabled',
      'X-Verbose-Errors': 'enabled'
    });
    
    res.status(500).json(errorResponse);
  }
});

// Endpoint for insecure data transmission over HTTP
router.get('/transmission/insecure-http', async (req, res) => {
  try {
    // VULNERABILITY: Force HTTP transmission for sensitive data
    // VULNERABILITY: Disable HTTPS redirects and security headers
    
    // Remove security headers
    res.removeHeader('Strict-Transport-Security');
    res.removeHeader('X-Content-Type-Options');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('X-XSS-Protection');
    
    // VULNERABILITY: Set headers that encourage HTTP usage
    res.set({
      'X-Force-HTTP': 'true',
      'X-HTTPS-Disabled': 'true',
      'X-Insecure-Transport': 'enabled',
      'X-SSL-Bypass': 'active'
    });
    
    // VULNERABILITY: Retrieve and transmit sensitive data over potentially insecure connection
    const users = await User.find({}).limit(10);
    const sensitiveData = {
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
        sessionToken: user.sessionToken,
        profile: user.profile
      })),
      serverSecrets: {
        databaseUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/vulnshop',
        jwtSecret: process.env.JWT_SECRET || 'jwt-weak-secret',
        sessionSecret: process.env.SESSION_SECRET || 'session-weak-secret'
      },
      transmissionInfo: {
        protocol: req.protocol,
        secure: req.secure,
        encrypted: false,
        method: 'HTTP',
        warning: 'This data is being transmitted over an insecure connection',
        recommendation: 'Use HTTPS for sensitive data transmission'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestedBy: req.ip,
        userAgent: req.get('User-Agent')
      }
    };
    
    res.json(sensitiveData);
    
  } catch (error) {
    console.error('Insecure HTTP transmission error:', error);
    res.status(500).json({
      error: 'Insecure HTTP transmission failed',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});/ /   A P I   i m p r o v e m e n t s  
 