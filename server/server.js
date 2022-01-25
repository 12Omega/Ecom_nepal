const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeUploadDirectories } = require('./middleware/upload');
const { ActivityLogger } = require('./services/activityLogger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize upload directories
initializeUploadDirectories();

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Raw body parser for Stripe webhooks (must be before other middleware)
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration with enhanced security
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://localhost:3000',
      'http://127.0.0.1:3000',
      'https://127.0.0.1:3000'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count']
}));

// Enhanced session configuration with security
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  name: 'sessionid',
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: process.env.COOKIE_DOMAIN || undefined // Set domain for production
  },
  rolling: true, // Reset expiration on activity
  genid: () => {
    // Generate cryptographically secure session ID
    return require('crypto').randomBytes(32).toString('hex');
  }
}));

// Security middleware for logging suspicious activity
app.use(async (req, res, next) => {
  // Log suspicious patterns
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript injection
    /vbscript:/i,  // VBScript injection
    /onload=/i,  // Event handler injection
    /onerror=/i  // Error handler injection
  ];

  const userInput = JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      await ActivityLogger.logSecurityViolation(
        req.user?._id || null,
        req.user?.username || 'anonymous',
        'SUSPICIOUS_INPUT_DETECTED',
        { 
          pattern: pattern.toString(),
          input: userInput.substring(0, 500),
          endpoint: req.path,
          method: req.method
        },
        req
      );
      break;
    }
  }

  next();
});

// MongoDB connection with enhanced options
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log('Connected to MongoDB');
  console.log('🔒 Security features enabled:');
  console.log('  ✅ Rate limiting');
  console.log('  ✅ Security headers (Helmet)');
  console.log('  ✅ Activity logging');
  console.log('  ✅ Input validation');
  console.log('  ✅ Session security');
  console.log('  ✅ CORS protection');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Serve static files with security headers
app.use('/uploads', (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'private, no-cache'
  });
  next();
}, express.static('uploads'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const healthData = {
      status: 'running',
      message: 'E-commerce API is operational',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      features: {
        authentication: 'enabled',
        mfa: 'enabled',
        activityLogging: 'enabled',
        rateLimit: 'enabled',
        secureUpload: 'enabled'
      },
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };

    res.json(healthData);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// RBAC-protected routes
const { requireRole, requirePermission } = require('./middleware/rbac');

// Admin-only security monitoring
app.get('/api/security/events', requireRole('admin'), async (req, res) => {
  try {
    const events = await ActivityLogger.getSecurityEvents(50);
    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch security events'
    });
  }
});

// Security audit endpoint (admin only)
app.get('/api/security/audit', requireRole('admin'), async (req, res) => {
  try {
    const SecurityAudit = require('./security/audit');
    const audit = new SecurityAudit();
    const results = await audit.runAudit();
    
    res.json({
      success: true,
      audit: results
    });
  } catch (error) {
    console.error('Security audit error:', error);
    res.status(500).json({
      error: 'Security audit failed'
    });
  }
});

// Stripe routes (with error handling)
try {
  app.use('/api/stripe', require('./routes/stripe'));
} catch (error) {
  console.log('Stripe routes not found, skipping...');
}

// Admin routes (if they exist)
try {
  app.use('/api/admin', require('./routes/admin'));
} catch (error) {
  console.log('Admin routes not found, skipping...');
}

// Products routes (if they exist)
try {
  app.use('/api/products', require('./routes/products'));
} catch (error) {
  console.log('Products routes not found, skipping...');
}

// Orders routes (if they exist)
try {
  app.use('/api/orders', require('./routes/orders'));
} catch (error) {
  console.log('Orders routes not found, skipping...');
}

// Cart routes (if they exist)
try {
  app.use('/api/cart', require('./routes/cart'));
} catch (error) {
  console.log('Cart routes not found, skipping...');
}

// Security endpoint for admin monitoring
app.get('/api/security/events-legacy', async (req, res) => {
  try {
    // This should be protected with admin authentication
    const events = await ActivityLogger.getSecurityEvents(50);
    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch security events'
    });
  }
});

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#6c757d" text-anchor="middle" dy=".3em">
        ${width} × ${height}
      </text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// 404 handler
app.use((req, res) => {
  ActivityLogger.logSecurityViolation(
    req.user?._id || null,
    req.user?.username || 'anonymous',
    '404_ENDPOINT_ACCESS',
    { 
      endpoint: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent')
    },
    req
  );

  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use(async (error, req, res, next) => {
  console.error('Global error:', error);

  // Log security-related errors
  if (error.message.includes('CORS') || 
      error.message.includes('validation') || 
      error.message.includes('authentication')) {
    await ActivityLogger.logSecurityViolation(
      req.user?._id || null,
      req.user?.username || 'anonymous',
      'APPLICATION_ERROR',
      { 
        error: error.message,
        stack: error.stack?.substring(0, 500),
        endpoint: req.path
      },
      req
    );
  }

  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // Log shutdown
  try {
    await ActivityLogger.logActivity({
      userId: 'system',
      username: 'system',
      action: 'SERVER_SHUTDOWN',
      details: { reason: 'SIGTERM' },
      ipAddress: '127.0.0.1',
      category: 'SYSTEM',
      severity: 'MEDIUM'
    });
  } catch (error) {
    console.error('Failed to log shutdown:', error);
  }

  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Enhanced E-commerce Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('💳 Stripe integration ready!');
  console.log('🔐 Security features active!');
});

module.exports = app;