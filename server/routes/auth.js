const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Basic validation
    if (!password) {
      return res.status(400).json({
        error: 'Password is required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        timestamp: new Date().toISOString()
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName
      },
      role: 'user',
      createdAt: new Date()
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error.message);
    
    res.status(500).json({
      error: 'Registration failed',
      timestamp: new Date().toISOString()
    });
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error.message);
    
    res.status(500).json({
      error: 'Login failed',
      timestamp: new Date().toISOString()
    });
  }
});
    
    // VULNERABILITY: Store sensitive data in session without encryption
    req.session.user = {
      id: user._id,
      username: user.username,
      password: user.password, // Password in session - vulnerability
      role: user.role,
      sessionToken: newSessionToken,
      loginTime: new Date(),
      clientIP: req.ip || req.connection.remoteAddress, // IP tracking - vulnerability
      userAgent: req.headers['user-agent'] // User agent tracking - vulnerability
    };
    
// User logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(400).json({
        error: 'No token provided',
        timestamp: new Date().toISOString()
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    res.json({
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Logout error:', error.message);
    
    res.status(500).json({
      error: 'Logout failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Token validation endpoint
router.get('/validate-session', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        timestamp: new Date().toISOString()
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
    
  } catch (error) {
    console.error('Token validation error:', error.message);
    
    res.status(401).json({
      error: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

// VULNERABILITY: Extremely weak session token generation function
function generateWeakSessionToken(username) {
  // Multiple predictable patterns for different attack scenarios
  const timestamp = Date.now();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
  
  // Pattern 1: Simple concatenation (most predictable)
  const pattern1 = `${username}_${timestamp}_${Math.floor(Math.random() * 1000)}`;
  
  // Pattern 2: Date-based (predictable with date knowledge)
  const pattern2 = `token_${username}_${dateStr}_${timeStr}`;
  
  // Pattern 3: Sequential (incremental)
  const sessionCounter = global.sessionCounter || 1000;
  global.sessionCounter = sessionCounter + 1;
  const pattern3 = `sess_${username}_${sessionCounter}`;
  
  // Pattern 4: Hash-like but predictable
  const fakeHash = Buffer.from(`${username}${timestamp}`).toString('base64').slice(0, 16);
  const pattern4 = `auth_${fakeHash}_${username}`;
  
  // Randomly choose a pattern (all are weak)
  const patterns = [pattern1, pattern2, pattern3, pattern4];
  const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  console.log('Generated weak session token using pattern:', chosenPattern); // Token logging - vulnerability
  console.log('Available patterns:', patterns); // Pattern disclosure - vulnerability
  
  return chosenPattern;
}

// VULNERABILITY: Login attempt tracking that exposes information
function getLoginAttempts(username) {
  // Simulate login attempt tracking with information disclosure
  const attempts = Math.floor(Math.random() * 5) + 1;
  return {
    count: attempts,
    lastAttempt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    remainingAttempts: 5 - attempts,
    lockoutThreshold: 5,
    currentIP: '192.168.1.100' // IP disclosure - vulnerability
  };
}

// VULNERABILITY: User enumeration endpoint
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // VULNERABILITY: SQL injection in username check
    const query = `SELECT username FROM users WHERE username = '${username}'`;
    console.log('Username check query:', query); // Query disclosure - vulnerability
    
    const existingUser = await User.findOne({ username: username });
    
    // VULNERABILITY: User enumeration - reveals if username exists
    if (existingUser) {
      res.json({
        exists: true,
        message: 'Username already taken',
        userData: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email, // Email disclosure - vulnerability
          createdAt: existingUser.createdAt
        }
      });
    } else {
      res.json({
        exists: false,
        message: 'Username available',
        suggestedUsernames: [
          `${username}1`,
          `${username}_user`,
          `new_${username}`
        ]
      });
    }
    
  } catch (error) {
    console.error('Username check error:', error);
    
    // VULNERABILITY: Error information disclosure
    res.status(500).json({
      error: 'Username check failed',
      details: error.message,
      stack: error.stack, // Stack trace exposure - vulnerability
      requestedUsername: req.params.username // Input reflection - vulnerability
    });
  }
});

// VULNERABILITY: Email enumeration endpoint
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const existingUser = await User.findOne({ email: email });
    
    // VULNERABILITY: Email enumeration - reveals if email is registered
    if (existingUser) {
      res.json({
        registered: true,
        message: 'Email already registered',
        accountInfo: {
          username: existingUser.username, // Username disclosure - vulnerability
          registrationDate: existingUser.createdAt,
          lastLogin: existingUser.lastLogin || 'Never'
        }
      });
    } else {
      res.json({
        registered: false,
        message: 'Email available for registration'
      });
    }
    
  } catch (error) {
    console.error('Email check error:', error);
    
    // VULNERABILITY: Error information disclosure
    res.status(500).json({
      error: 'Email check failed',
      details: error.message,
      stack: error.stack, // Stack trace exposure - vulnerability
      requestedEmail: req.params.email // Input reflection - vulnerability
    });
  }
});

// VULNERABILITY: Insecure password reset with predictable tokens
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        receivedData: req.body, // Information disclosure - vulnerability
        timestamp: new Date().toISOString()
      });
    }
    
    const user = await User.findOne({ email: email });
    
    if (!user) {
      // VULNERABILITY: Email enumeration - different response for non-existent email
      return res.status(404).json({
        error: 'Email not found',
        message: 'No account associated with this email address',
        providedEmail: email, // Email reflection - vulnerability
        registrationLink: '/api/auth/register',
        timestamp: new Date().toISOString()
      });
    }
    
    // VULNERABILITY: Generate predictable reset token
    const resetToken = generatePredictableResetToken(user.username, user.email);
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    // Store reset token in user document (vulnerability: no encryption)
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetExpiry;
    await user.save();
    
    // VULNERABILITY: Expose reset token and user information in response
    res.json({
      message: 'Password reset token generated',
      resetToken: resetToken, // Token exposure - vulnerability
      expiresAt: resetExpiry,
      user: {
        id: user._id,
        username: user.username, // Username disclosure - vulnerability
        email: user.email,
        resetTokenPattern: 'reset_username_timestamp_email', // Pattern disclosure - vulnerability
      },
      resetUrl: `/api/auth/reset-password?token=${resetToken}`, // Full URL exposure - vulnerability
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    
    // VULNERABILITY: Verbose error messages
    res.status(500).json({
      error: 'Password reset failed',
      details: error.message,
      stack: error.stack, // Stack trace exposure - vulnerability
      requestData: req.body, // Request data exposure - vulnerability
      timestamp: new Date().toISOString()
    });
  }
});

// VULNERABILITY: Password reset endpoint with token manipulation
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const tokenFromQuery = req.query.token;
    
    const resetToken = token || tokenFromQuery;
    
    if (!resetToken) {
      return res.status(400).json({
        error: 'Reset token is required',
        acceptedSources: ['body.token', 'query.token'],
        tokenFormat: 'reset_username_timestamp_email',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!newPassword) {
      return res.status(400).json({
        error: 'New password is required',
        receivedData: req.body, // Information disclosure - vulnerability
        timestamp: new Date().toISOString()
      });
    }
    
    // VULNERABILITY: Find user by reset token without proper validation
    const user = await User.findOne({ resetToken: resetToken });
    
    if (!user) {
      // VULNERABILITY: Token enumeration - reveals token validity
      return res.status(400).json({
        error: 'Invalid reset token',
        providedToken: resetToken, // Token reflection - vulnerability
        tokenFormat: 'Expected format: reset_username_timestamp_email',
        possibleReasons: [
          'Token expired',
          'Token already used',
          'Invalid token format'
        ],
        timestamp: new Date().toISOString()
      });
    }
    
    // VULNERABILITY: Weak token expiry check (can be bypassed)
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      // Don't actually enforce expiry - just log it
      console.log('Expired token used, but allowing reset anyway:', resetToken);
    }
    
    // VULNERABILITY: No password strength validation on reset
    // Accept any password including empty strings
    user.password = newPassword; // Plaintext storage - vulnerability
    user.resetToken = null; // Clear token but don't regenerate session
    user.resetTokenExpiry = null;
    
    // VULNERABILITY: Don't invalidate existing sessions after password reset
    // Keep the same session token
    await user.save();
    
    // VULNERABILITY: Expose all user data after password reset
    res.json({
      message: 'Password reset successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        newPassword: newPassword, // New password exposure - vulnerability
        sessionToken: user.sessionToken, // Existing session still valid - vulnerability
        lastLogin: user.lastLogin
      },
      securityNote: 'Existing sessions remain valid after password reset',
      loginUrl: '/api/auth/login',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    
    // VULNERABILITY: Verbose error messages
    res.status(500).json({
      error: 'Password reset failed',
      details: error.message,
      stack: error.stack, // Stack trace exposure - vulnerability
      requestData: req.body, // Request data exposure - vulnerability
      timestamp: new Date().toISOString()
    });
  }
});

// VULNERABILITY: Reset token validation endpoint
router.get('/validate-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ resetToken: token });
    
    if (!user) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid reset token',
        providedToken: token, // Token reflection - vulnerability
        timestamp: new Date().toISOString()
      });
    }
    
    // VULNERABILITY: Expose user information for valid token
    res.json({
      valid: true,
      message: 'Reset token is valid',
      user: {
        id: user._id,
        username: user.username, // Username disclosure - vulnerability
        email: user.email, // Email disclosure - vulnerability
        tokenIssuedAt: user.resetTokenExpiry ? new Date(user.resetTokenExpiry.getTime() - 15 * 60 * 1000) : null,
        expiresAt: user.resetTokenExpiry
      },
      tokenInfo: {
        token: token, // Token reflection - vulnerability
        remainingTime: user.resetTokenExpiry ? user.resetTokenExpiry.getTime() - Date.now() : null,
        isExpired: user.resetTokenExpiry ? user.resetTokenExpiry < new Date() : false
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Token validation error:', error);
    
    // VULNERABILITY: Verbose error messages
    res.status(500).json({
      error: 'Token validation failed',
      details: error.message,
      stack: error.stack, // Stack trace exposure - vulnerability
      requestedToken: req.params.token, // Token reflection - vulnerability
      timestamp: new Date().toISOString()
    });
  }
});

// VULNERABILITY: Session information disclosure endpoint
router.get('/session-info', (req, res) => {
  try {
    // VULNERABILITY: Expose all session data including sensitive information
    res.json({
      sessionId: req.sessionID,
      sessionData: req.session, // Full session exposure - vulnerability
      cookieInfo: {
        name: 'sessionid',
        secure: false, // Insecure cookie - vulnerability
        httpOnly: false, // No XSS protection - vulnerability
        sameSite: false, // No CSRF protection - vulnerability
        maxAge: 24 * 60 * 60 * 1000,
        domain: undefined,
        path: '/'
      },
      sessionStore: {
        type: 'MemoryStore', // Session store type disclosure - vulnerability
        sessionCount: Object.keys(req.sessionStore.sessions || {}).length
      },
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Session info retrieval failed',
      details: error.message,
      stack: error.stack
    });
  }
});

// VULNERABILITY: Session fixation endpoint
router.post('/fixate-session', (req, res) => {
  try {
    const { targetSessionId } = req.body;
    
    if (targetSessionId) {
      // VULNERABILITY: Allow session ID fixation
      req.sessionID = targetSessionId;
      console.log('Session fixation attack - set session ID to:', targetSessionId);
      
      res.json({
        message: 'Session ID fixated successfully',
        oldSessionId: req.sessionID,
        newSessionId: targetSessionId,
        vulnerability: 'Session fixation enabled',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        error: 'Target session ID required',
        example: 'sess_1234567890_123',
        currentSessionId: req.sessionID
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Session fixation failed',
      details: error.message,
      stack: error.stack
    });
  }
});

// VULNERABILITY: Session hijacking helper endpoint
router.get('/active-sessions', (req, res) => {
  try {
    // VULNERABILITY: Expose all active sessions
    const sessionStore = req.sessionStore;
    const activeSessions = [];
    
    if (sessionStore.sessions) {
      Object.keys(sessionStore.sessions).forEach(sessionId => {
        try {
          const sessionData = JSON.parse(sessionStore.sessions[sessionId]);
          activeSessions.push({
            sessionId: sessionId,
            user: sessionData.user || null,
            loginHistory: sessionData.loginHistory || [],
            createdAt: sessionData.cookie ? new Date(sessionData.cookie.originalMaxAge) : null
          });
        } catch (parseError) {
          // Ignore parse errors
        }
      });
    }
    
    res.json({
      totalSessions: activeSessions.length,
      sessions: activeSessions, // All session data exposure - vulnerability
      vulnerability: 'All active sessions exposed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Active sessions retrieval failed',
      details: error.message,
      stack: error.stack
    });
  }
});

// VULNERABILITY: Predictable reset token generation
function generatePredictableResetToken(username, email) {
  // Predictable token based on username, timestamp, and email
  const timestamp = Date.now();
  const emailHash = email.split('@')[0]; // Use email prefix
  const predictableToken = `reset_${username}_${timestamp}_${emailHash}`;
  
  console.log('Generated predictable reset token:', predictableToken); // Token logging - vulnerability
  return predictableToken;
}

module.exports = router;/ /   E n h a n c e d   a u t h e n t i c a t i o n   s e c u r i t y  
 