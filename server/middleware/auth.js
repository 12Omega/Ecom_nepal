const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const { ActivityLogger } = require('../services/activityLogger');

// Rate limiting configurations
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many login attempts, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await ActivityLogger.logSecurityViolation(
      null,
      req.body.username || 'unknown',
      'RATE_LIMIT_EXCEEDED',
      { endpoint: '/login', attempts: req.rateLimit.totalHits },
      req
    );
    res.status(429).json({
      error: 'Too many login attempts',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: {
    error: 'Too many registration attempts, please try again later'
  }
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: {
    error: 'Too many password reset attempts, please try again later'
  }
});

const mfaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 MFA attempts per 5 minutes
  message: {
    error: 'Too many MFA attempts, please try again later'
  }
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      await ActivityLogger.logSecurityViolation(
        null,
        'anonymous',
        'MISSING_AUTH_TOKEN',
        { endpoint: req.path },
        req
      );
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      await ActivityLogger.logSecurityViolation(
        decoded.userId,
        decoded.username,
        'INVALID_USER_TOKEN',
        { tokenUserId: decoded.userId },
        req
      );
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.accountStatus !== 'active') {
      await ActivityLogger.logSecurityViolation(
        user._id,
        user.username,
        'INACTIVE_ACCOUNT_ACCESS',
        { accountStatus: user.accountStatus },
        req
      );
      return res.status(403).json({ 
        error: 'Account is not active',
        code: 'ACCOUNT_INACTIVE',
        status: user.accountStatus
      });
    }

    // Check if session is still valid
    if (user.sessionToken && user.sessionToken !== decoded.sessionToken) {
      await ActivityLogger.logSecurityViolation(
        user._id,
        user.username,
        'SESSION_TOKEN_MISMATCH',
        { providedToken: decoded.sessionToken, currentToken: user.sessionToken },
        req
      );
      return res.status(401).json({ 
        error: 'Session expired or invalid',
        code: 'SESSION_INVALID'
      });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      await ActivityLogger.logSecurityViolation(
        null,
        'anonymous',
        'INVALID_JWT_TOKEN',
        { error: error.message },
        req
      );
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      await ActivityLogger.logSecurityViolation(
        null,
        'anonymous',
        'EXPIRED_JWT_TOKEN',
        { expiredAt: error.expiredAt },
        req
      );
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!roles.includes(req.user.role)) {
        await ActivityLogger.logSecurityViolation(
          req.user._id,
          req.user.username,
          'UNAUTHORIZED_ACCESS',
          { 
            requiredRoles: roles, 
            userRole: req.user.role,
            endpoint: req.path 
          },
          req
        );
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: roles,
          current: req.user.role
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ 
        error: 'Authorization failed',
        code: 'AUTHZ_ERROR'
      });
    }
  };
};

// MFA verification middleware
const verifyMFA = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Skip MFA if not enabled for user
    if (!req.user.twoFactorEnabled) {
      return next();
    }

    const { mfaToken } = req.body;
    
    if (!mfaToken) {
      return res.status(400).json({ 
        error: 'MFA token required',
        code: 'MFA_TOKEN_REQUIRED'
      });
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token: mfaToken,
      window: 2 // Allow 2 time steps (60 seconds) tolerance
    });

    if (!verified) {
      await ActivityLogger.logAuth(
        req.user._id,
        req.user.username,
        'MFA_FAILED',
        false,
        { providedToken: mfaToken },
        req
      );
      return res.status(401).json({ 
        error: 'Invalid MFA token',
        code: 'MFA_INVALID'
      });
    }

    await ActivityLogger.logAuth(
      req.user._id,
      req.user.username,
      'MFA_SUCCESS',
      true,
      {},
      req
    );

    next();
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ 
      error: 'MFA verification failed',
      code: 'MFA_ERROR'
    });
  }
};

// Account lockout middleware
const checkAccountLockout = async (req, res, next) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return next();
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (user && user.accountLockout) {
      const now = new Date();
      
      // Check if account is currently locked
      if (user.accountLockout.lockedUntil && user.accountLockout.lockedUntil > now) {
        const remainingTime = Math.ceil((user.accountLockout.lockedUntil - now) / 1000 / 60);
        
        await ActivityLogger.logSecurityViolation(
          user._id,
          user.username,
          'LOCKED_ACCOUNT_ACCESS_ATTEMPT',
          { 
            remainingLockTime: remainingTime,
            failedAttempts: user.accountLockout.failedAttempts 
          },
          req
        );

        return res.status(423).json({
          error: 'Account is locked',
          code: 'ACCOUNT_LOCKED',
          lockedUntil: user.accountLockout.lockedUntil,
          remainingMinutes: remainingTime
        });
      }

      // Reset lockout if time has passed
      if (user.accountLockout.lockedUntil && user.accountLockout.lockedUntil <= now) {
        user.accountLockout = {
          failedAttempts: 0,
          lockedUntil: null,
          lockoutCount: user.accountLockout.lockoutCount || 0
        };
        await user.save();
      }
    }

    next();
  } catch (error) {
    console.error('Account lockout check error:', error);
    next(); // Continue on error to avoid blocking legitimate users
  }
};

// Self-access middleware (user can only access their own data)
const requireSelfAccess = (paramName = 'userId') => {
  return async (req, res, next) => {
    try {
      const requestedUserId = req.params[paramName];
      const currentUserId = req.user._id.toString();

      // Allow admins to access any user's data
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user is accessing their own data
      if (requestedUserId !== currentUserId) {
        await ActivityLogger.logSecurityViolation(
          req.user._id,
          req.user.username,
          'UNAUTHORIZED_DATA_ACCESS',
          { 
            requestedUserId,
            currentUserId,
            endpoint: req.path 
          },
          req
        );
        return res.status(403).json({
          error: 'Access denied - can only access your own data',
          code: 'SELF_ACCESS_REQUIRED'
        });
      }

      next();
    } catch (error) {
      console.error('Self-access check error:', error);
      res.status(500).json({ 
        error: 'Access validation failed',
        code: 'ACCESS_CHECK_ERROR'
      });
    }
  };
};

// Generate secure session token
const generateSecureToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Length bonus
  score += Math.min(password.length * 2, 20);
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 5;
  if (/[A-Z]/.test(password)) score += 5;
  if (/\d/.test(password)) score += 5;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  
  // Complexity bonus
  if (password.length >= 12) score += 10;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) score += 15;

  if (score < 30) return 'weak';
  if (score < 60) return 'medium';
  if (score < 80) return 'strong';
  return 'very_strong';
};

module.exports = {
  authenticateToken,
  authorize,
  verifyMFA,
  checkAccountLockout,
  requireSelfAccess,
  generateSecureToken,
  validatePasswordStrength,
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  mfaLimiter
};

