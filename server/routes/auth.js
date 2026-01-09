const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ActivityLogger } = require('../services/activityLogger');
const { requireCaptcha } = require('../middleware/captcha');
const { 
  authenticateToken, 
  loginLimiter, 
  registerLimiter, 
  passwordResetLimiter,
  mfaLimiter,
  checkAccountLockout,
  validatePasswordStrength,
  generateSecureToken
} = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .trim()
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .trim()
    .withMessage('Last name must be less than 50 characters')
];

const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// User Registration with Enhanced Security
router.post('/register', registerLimiter, registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet security requirements',
        requirements: passwordValidation.errors,
        strength: passwordValidation.strength
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      await ActivityLogger.logSecurityViolation(
        null,
        username,
        'DUPLICATE_REGISTRATION_ATTEMPT',
        { email, existingField: existingUser.username === username ? 'username' : 'email' },
        req
      );
      return res.status(400).json({
        error: 'User already exists',
        field: existingUser.username === username ? 'username' : 'email'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by pre-save middleware
      profile: {
        firstName: firstName || '',
        lastName: lastName || ''
      },
      role: 'user',
      accountStatus: 'active' // Changed from pending_verification for demo
    });

    await newUser.save();

    // Generate JWT token
    const sessionToken = generateSecureToken();
    newUser.sessionToken = sessionToken;
    await newUser.save();

    const token = jwt.sign(
      { 
        userId: newUser._id, 
        username: newUser.username, 
        role: newUser.role,
        sessionToken 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful registration
    await ActivityLogger.logAuth(
      newUser._id.toString(),
      newUser.username,
      'REGISTER',
      true,
      { email, accountStatus: 'active' },
      req
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        accountStatus: newUser.accountStatus,
        emailVerified: newUser.emailVerified
      },
      token,
      passwordStrength: passwordValidation.strength
    });

  } catch (error) {
    console.error('Registration error:', error);
    await ActivityLogger.logAuth(
      null,
      req.body.username || 'unknown',
      'REGISTER',
      false,
      { error: error.message },
      req
    );
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

// User Login with Enhanced Security
router.post('/login', loginLimiter, checkAccountLockout, requireCaptcha, loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, password, mfaToken } = req.body;

    // Find user
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    }).select('+twoFactorSecret');

    if (!user) {
      await ActivityLogger.logAuth(
        null,
        username,
        'LOGIN_FAILED',
        false,
        { reason: 'user_not_found' },
        req
      );
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await user.incrementFailedAttempts();
      
      // Increment session failed attempts for CAPTCHA
      req.session.failedAttempts = (req.session.failedAttempts || 0) + 1;
      
      await ActivityLogger.logAuth(
        user._id,
        user.username,
        'LOGIN_FAILED',
        false,
        { reason: 'invalid_password', failedAttempts: user.accountLockout.failedAttempts + 1 },
        req
      );
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check if password has expired
    if (user.isPasswordExpired()) {
      await ActivityLogger.logAuth(
        user._id,
        user.username,
        'LOGIN_BLOCKED',
        false,
        { reason: 'password_expired' },
        req
      );
      return res.status(401).json({
        error: 'Password has expired',
        code: 'PASSWORD_EXPIRED',
        message: 'Please reset your password to continue'
      });
    }

    // Check if MFA is required
    if (user.twoFactorEnabled) {
      if (!mfaToken) {
        return res.status(200).json({
          mfaRequired: true,
          message: 'Multi-factor authentication required'
        });
      }

      // Verify MFA token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: mfaToken,
        window: 2
      });

      if (!verified) {
        // Check backup codes
        const backupCode = user.twoFactorBackupCodes.find(
          code => code.code === mfaToken.toUpperCase() && !code.used
        );

        if (!backupCode) {
          await ActivityLogger.logAuth(
            user._id,
            user.username,
            'MFA_FAILED',
            false,
            { reason: 'invalid_token' },
            req
          );
          return res.status(401).json({
            error: 'Invalid MFA token'
          });
        }

        // Mark backup code as used
        backupCode.used = true;
        backupCode.usedAt = new Date();
        await user.save();
      }
    }

    // Reset failed attempts on successful login
    await user.resetFailedAttempts();
    
    // Reset session failed attempts
    req.session.failedAttempts = 0;

    // Update login information
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.lastActivity = new Date();

    // Generate new session token
    const sessionToken = generateSecureToken();
    user.sessionToken = sessionToken;

    // Add session tracking
    user.addSession(req.sessionID, ActivityLogger.getClientIP(req), req.get('User-Agent'));

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username, 
        role: user.role,
        sessionToken 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    await ActivityLogger.logAuth(
      user._id,
      user.username,
      'LOGIN_SUCCESS',
      true,
      { 
        mfaUsed: user.twoFactorEnabled,
        loginCount: user.loginCount 
      },
      req
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        profile: user.profile
      },
      token,
      sessionInfo: {
        loginCount: user.loginCount,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    await ActivityLogger.logAuth(
      null,
      req.body.username || 'unknown',
      'LOGIN_FAILED',
      false,
      { error: error.message },
      req
    );
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

// Logout with Session Invalidation
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Invalidate session token
    user.sessionToken = null;
    user.removeSession(req.sessionID);
    await user.save();

    // Log logout
    await ActivityLogger.logAuth(
      user._id,
      user.username,
      'LOGOUT',
      true,
      {},
      req
    );

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed'
    });
  }
});

// Validate Session
router.get('/validate-session', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        profile: user.profile,
        lastActivity: user.lastActivity,
        passwordExpired: user.isPasswordExpired()
      }
    });

  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({
      error: 'Session validation failed'
    });
  }
});

// Change Password
router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      await ActivityLogger.logAuth(
        user._id,
        user.username,
        'PASSWORD_CHANGE_FAILED',
        false,
        { reason: 'invalid_current_password' },
        req
      );
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'New password does not meet security requirements',
        requirements: passwordValidation.errors,
        strength: passwordValidation.strength
      });
    }

    // Check password reuse (this will be handled by the pre-save middleware)
    try {
      user.password = newPassword;
      await user.save();
    } catch (error) {
      if (error.message.includes('Cannot reuse')) {
        return res.status(400).json({
          error: 'Cannot reuse any of the last 5 passwords',
          code: 'PASSWORD_REUSE_VIOLATION'
        });
      }
      throw error;
    }

    await ActivityLogger.logAuth(
      user._id,
      user.username,
      'PASSWORD_CHANGE',
      true,
      { passwordStrength: passwordValidation.strength },
      req
    );

    res.json({
      message: 'Password changed successfully',
      passwordStrength: passwordValidation.strength,
      expiresAt: user.passwordExpiresAt
    });

  } catch (error) {
    console.error('Password change error:', error);
    await ActivityLogger.logAuth(
      req.user?._id,
      req.user?.username || 'unknown',
      'PASSWORD_CHANGE_FAILED',
      false,
      { error: error.message },
      req
    );
    res.status(500).json({
      error: 'Password change failed',
      message: 'Internal server error'
    });
  }
});

module.exports = router;