const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    
    if (!password) {
      return res.status(400).json({
        error: 'Password is required',
        timestamp: new Date().toISOString()
      });
    }
    
    
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        timestamp: new Date().toISOString()
      });
    }
    
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    
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


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }
    
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }
    
    
    user.lastLogin = new Date();
    await user.save();
    
    
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
    
    
    req.session.user = {
      id: user._id,
      username: user.username,
      password: user.password, 
      role: user.role,
      sessionToken: newSessionToken,
      loginTime: new Date(),
      clientIP: req.ip || req.connection.remoteAddress, 
      userAgent: req.headers['user-agent'] 
    };
    

router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(400).json({
        error: 'No token provided',
        timestamp: new Date().toISOString()
      });
    }
    
    
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


router.get('/validate-session', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        timestamp: new Date().toISOString()
      });
    }
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    
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


function generateWeakSessionToken(username) {
  
  const timestamp = Date.now();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
  
  
  const pattern1 = `${username}_${timestamp}_${Math.floor(Math.random() * 1000)}`;
  
  
  const pattern2 = `token_${username}_${dateStr}_${timeStr}`;
  
  
  const sessionCounter = global.sessionCounter || 1000;
  global.sessionCounter = sessionCounter + 1;
  const pattern3 = `sess_${username}_${sessionCounter}`;
  
  
  const fakeHash = Buffer.from(`${username}${timestamp}`).toString('base64').slice(0, 16);
  const pattern4 = `auth_${fakeHash}_${username}`;
  
  
  const patterns = [pattern1, pattern2, pattern3, pattern4];
  const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  console.log('Generated weak session token using pattern:', chosenPattern); 
  console.log('Available patterns:', patterns); 
  
  return chosenPattern;
}


function getLoginAttempts(username) {
  
  const attempts = Math.floor(Math.random() * 5) + 1;
  return {
    count: attempts,
    lastAttempt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    remainingAttempts: 5 - attempts,
    lockoutThreshold: 5,
    currentIP: '192.168.1.100' 
  };
}


router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    
    const query = `SELECT username FROM users WHERE username = '${username}'`;
    console.log('Username check query:', query); 
    
    const existingUser = await User.findOne({ username: username });
    
    
    if (existingUser) {
      res.json({
        exists: true,
        message: 'Username already taken',
        userData: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email, 
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
    
    
    res.status(500).json({
      error: 'Username check failed',
      details: error.message,
      stack: error.stack, 
      requestedUsername: req.params.username 
    });
  }
});


router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const existingUser = await User.findOne({ email: email });
    
    
    if (existingUser) {
      res.json({
        registered: true,
        message: 'Email already registered',
        accountInfo: {
          username: existingUser.username, 
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
    
    
    res.status(500).json({
      error: 'Email check failed',
      details: error.message,
      stack: error.stack, 
      requestedEmail: req.params.email 
    });
  }
});


router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        receivedData: req.body, 
        timestamp: new Date().toISOString()
      });
    }
    
    const user = await User.findOne({ email: email });
    
    if (!user) {
      
      return res.status(404).json({
        error: 'Email not found',
        message: 'No account associated with this email address',
        providedEmail: email, 
        registrationLink: '/api/auth/register',
        timestamp: new Date().toISOString()
      });
    }
    
    
    const resetToken = generatePredictableResetToken(user.username, user.email);
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); 
    
    
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetExpiry;
    await user.save();
    
    
    res.json({
      message: 'Password reset token generated',
      resetToken: resetToken, 
      expiresAt: resetExpiry,
      user: {
        id: user._id,
        username: user.username, 
        email: user.email,
        resetTokenPattern: 'reset_username_timestamp_email', 
      },
      resetUrl: `/api/auth/reset-password?token=${resetToken}`, 
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    
    
    res.status(500).json({
      error: 'Password reset failed',
      details: error.message,
      stack: error.stack, 
      requestData: req.body, 
      timestamp: new Date().toISOString()
    });
  }
});


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
        receivedData: req.body, 
        timestamp: new Date().toISOString()
      });
    }
    
    
    const user = await User.findOne({ resetToken: resetToken });
    
    if (!user) {
      
      return res.status(400).json({
        error: 'Invalid reset token',
        providedToken: resetToken, 
        tokenFormat: 'Expected format: reset_username_timestamp_email',
        possibleReasons: [
          'Token expired',
          'Token already used',
          'Invalid token format'
        ],
        timestamp: new Date().toISOString()
      });
    }
    
    
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      
      console.log('Expired token used, but allowing reset anyway:', resetToken);
    }
    
    
    
    user.password = newPassword; 
    user.resetToken = null; 
    user.resetTokenExpiry = null;
    
    
    
    await user.save();
    
    
    res.json({
      message: 'Password reset successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        newPassword: newPassword, 
        sessionToken: user.sessionToken, 
        lastLogin: user.lastLogin
      },
      securityNote: 'Existing sessions remain valid after password reset',
      loginUrl: '/api/auth/login',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    
    
    res.status(500).json({
      error: 'Password reset failed',
      details: error.message,
      stack: error.stack, 
      requestData: req.body, 
      timestamp: new Date().toISOString()
    });
  }
});


router.get('/validate-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ resetToken: token });
    
    if (!user) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid reset token',
        providedToken: token, 
        timestamp: new Date().toISOString()
      });
    }
    
    
    res.json({
      valid: true,
      message: 'Reset token is valid',
      user: {
        id: user._id,
        username: user.username, 
        email: user.email, 
        tokenIssuedAt: user.resetTokenExpiry ? new Date(user.resetTokenExpiry.getTime() - 15 * 60 * 1000) : null,
        expiresAt: user.resetTokenExpiry
      },
      tokenInfo: {
        token: token, 
        remainingTime: user.resetTokenExpiry ? user.resetTokenExpiry.getTime() - Date.now() : null,
        isExpired: user.resetTokenExpiry ? user.resetTokenExpiry < new Date() : false
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Token validation error:', error);
    
    
    res.status(500).json({
      error: 'Token validation failed',
      details: error.message,
      stack: error.stack, 
      requestedToken: req.params.token, 
      timestamp: new Date().toISOString()
    });
  }
});


router.get('/session-info', (req, res) => {
  try {
    
    res.json({
      sessionId: req.sessionID,
      sessionData: req.session, 
      cookieInfo: {
        name: 'sessionid',
        secure: false, 
        httpOnly: false, 
        sameSite: false, 
        maxAge: 24 * 60 * 60 * 1000,
        domain: undefined,
        path: '/'
      },
      sessionStore: {
        type: 'MemoryStore', 
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


router.post('/fixate-session', (req, res) => {
  try {
    const { targetSessionId } = req.body;
    
    if (targetSessionId) {
      
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


router.get('/active-sessions', (req, res) => {
  try {
    
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
          
        }
      });
    }
    
    res.json({
      totalSessions: activeSessions.length,
      sessions: activeSessions, 
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


function generatePredictableResetToken(username, email) {
  
  const timestamp = Date.now();
  const emailHash = email.split('@')[0]; 
  const predictableToken = `reset_${username}_${timestamp}_${emailHash}`;
  
  console.log('Generated predictable reset token:', predictableToken); 
  return predictableToken;
}

module.exports = router;
