const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'vendor'],
    default: 'user'
  },
  
  // Enhanced Profile with Privacy Controls
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v < new Date();
        },
        message: 'Date of birth cannot be in the future'
      }
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say'
    },
    bio: {
      type: String,
      maxlength: 500,
      trim: true
    },
    profilePicture: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Profile picture must be a valid image URL'
      }
    },
    coverPhoto: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Cover photo must be a valid image URL'
      }
    },
    
    // Contact Information
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: 'Invalid phone number format'
      }
    },
    alternateEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format'
      }
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Invalid website URL'
      }
    },
    
    // Enhanced Address Management
    addresses: [{
      type: {
        type: String,
        enum: ['home', 'work', 'billing', 'shipping'],
        default: 'home'
      },
      label: {
        type: String,
        maxlength: 50
      },
      street: {
        type: String,
        required: true,
        maxlength: 100
      },
      street2: {
        type: String,
        maxlength: 100
      },
      city: {
        type: String,
        required: true,
        maxlength: 50
      },
      state: {
        type: String,
        required: true,
        maxlength: 50
      },
      zipCode: {
        type: String,
        required: true,
        maxlength: 20
      },
      country: {
        type: String,
        required: true,
        maxlength: 50
      },
      isDefault: { 
        type: Boolean, 
        default: false 
      },
      isActive: { 
        type: Boolean, 
        default: true 
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Privacy and Accessibility Settings
    preferences: {
      language: {
        type: String,
        enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko'],
        default: 'en'
      },
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'],
        default: 'USD'
      },
      timezone: {
        type: String,
        default: 'UTC'
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light'
      },
      
      // Notification Preferences
      notifications: {
        email: { 
          type: Boolean, 
          default: true 
        },
        sms: { 
          type: Boolean, 
          default: false 
        },
        push: { 
          type: Boolean, 
          default: true 
        },
        marketing: { 
          type: Boolean, 
          default: false 
        },
        orderUpdates: { 
          type: Boolean, 
          default: true 
        },
        securityAlerts: { 
          type: Boolean, 
          default: true 
        }
      },
      
      // Privacy Settings
      privacy: {
        profileVisibility: {
          type: String,
          enum: ['public', 'friends', 'private'],
          default: 'public'
        },
        showEmail: { 
          type: Boolean, 
          default: false 
        },
        showPhone: { 
          type: Boolean, 
          default: false 
        },
        allowMessages: { 
          type: Boolean, 
          default: true 
        },
        dataProcessingConsent: {
          type: Boolean,
          default: false
        },
        marketingConsent: {
          type: Boolean,
          default: false
        }
      },
      
      // Accessibility Settings
      accessibility: {
        highContrast: {
          type: Boolean,
          default: false
        },
        largeText: {
          type: Boolean,
          default: false
        },
        screenReader: {
          type: Boolean,
          default: false
        },
        reducedMotion: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  
  // Enhanced Security Features
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned', 'pending_verification'],
    default: 'pending_verification'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Password Security & History
  passwordHistory: [{
    hash: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  passwordExpiresAt: {
    type: Date,
    default: function() {
      // Password expires in 90 days
      return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }
  },
  passwordChangeRequired: {
    type: Boolean,
    default: false
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  
  // Multi-Factor Authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false // Don't include in queries by default
  },
  twoFactorBackupCodes: [{
    code: {
      type: String,
      required: true
    },
    used: {
      type: Boolean,
      default: false
    },
    usedAt: Date
  }],
  
  // Account Lockout Protection
  accountLockout: {
    failedAttempts: {
      type: Number,
      default: 0
    },
    lockedUntil: Date,
    lockoutCount: {
      type: Number,
      default: 0
    }
  },
  
  // Session Management
  sessionToken: {
    type: String,
    select: false
  },
  activeSessions: [{
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Password Reset & Email Verification
  resetToken: {
    type: String,
    select: false
  },
  resetTokenExpiry: Date,
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpiry: Date,
  
  // Activity Tracking
  lastLogin: Date,
  lastActivity: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  
  // E-commerce Features
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  membershipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Shopping Preferences
  wishlist: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  favoriteCategories: [String],
  recentlyViewed: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Payment Methods (encrypted)
  paymentMethods: [{
    type: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
      default: 'credit_card'
    },
    provider: String,
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number,
    isDefault: { 
      type: Boolean, 
      default: false 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    addedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  
  // Data Management
  dataExportRequests: [{
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    downloadUrl: String,
    expiresAt: Date
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.twoFactorSecret;
      delete ret.sessionToken;
      delete ret.resetToken;
      delete ret.emailVerificationToken;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance and security
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'accountLockout.lockedUntil': 1 });
userSchema.index({ lastActivity: 1 });
userSchema.index({ accountStatus: 1 });

// Pre-save middleware for password hashing
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  // Check password reuse (last 5 passwords)
  if (this.passwordHistory && this.passwordHistory.length > 0) {
    for (const oldPassword of this.passwordHistory.slice(-5)) {
      const isReused = await bcrypt.compare(this.password, oldPassword.hash);
      if (isReused) {
        throw new Error('Cannot reuse any of the last 5 passwords');
      }
    }
  }
  
  // Store current password in history before hashing new one
  if (this.isNew === false) { // Only for existing users changing password
    this.passwordHistory.push({
      hash: this.password, // Current hashed password
      createdAt: new Date()
    });
    
    // Keep only last 5 passwords
    if (this.passwordHistory.length > 5) {
      this.passwordHistory = this.passwordHistory.slice(-5);
    }
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  this.lastPasswordChange = new Date();
  this.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
  this.passwordChangeRequired = false;
});

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateSecureToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

userSchema.methods.generateResetToken = function() {
  const resetToken = this.generateSecureToken();
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = this.generateSecureToken();
  this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  this.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return verificationToken;
};

userSchema.methods.incrementFailedAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.accountLockout.lockedUntil && this.accountLockout.lockedUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'accountLockout.lockedUntil': 1 },
      $set: { 'accountLockout.failedAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'accountLockout.failedAttempts': 1 } };
  
  // If we have max attempts and no lock, lock the account
  if (this.accountLockout.failedAttempts + 1 >= 5 && !this.accountLockout.lockedUntil) {
    const lockTime = 15 * 60 * 1000; // 15 minutes
    updates.$set = { 
      'accountLockout.lockedUntil': Date.now() + lockTime,
      'accountLockout.lockoutCount': (this.accountLockout.lockoutCount || 0) + 1
    };
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetFailedAttempts = function() {
  return this.updateOne({
    $unset: { 
      'accountLockout.failedAttempts': 1,
      'accountLockout.lockedUntil': 1
    }
  });
};

userSchema.methods.addSession = function(sessionId, ipAddress, userAgent) {
  this.activeSessions.push({
    sessionId,
    ipAddress,
    userAgent,
    createdAt: new Date(),
    lastActivity: new Date(),
    isActive: true
  });
  
  // Keep only last 5 sessions
  if (this.activeSessions.length > 5) {
    this.activeSessions = this.activeSessions.slice(-5);
  }
};

userSchema.methods.removeSession = function(sessionId) {
  this.activeSessions = this.activeSessions.filter(
    session => session.sessionId !== sessionId
  );
};

userSchema.methods.isPasswordExpired = function() {
  return this.passwordExpiresAt && this.passwordExpiresAt < new Date();
};

userSchema.methods.generateBackupCodes = function() {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push({
      code: crypto.randomBytes(4).toString('hex').toUpperCase(),
      used: false
    });
  }
  this.twoFactorBackupCodes = codes;
  return codes.map(c => c.code);
};

// Static Methods
userSchema.statics.findByCredentials = async function(username, password) {
  const user = await this.findOne({
    $or: [{ username }, { email: username }]
  });
  
  if (!user) {
    return null;
  }
  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return null;
  }
  
  return user;
};

userSchema.statics.findByResetToken = async function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return this.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() }
  });
};

userSchema.statics.findByVerificationToken = async function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return this.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() }
  });
};

module.exports = mongoose.model('User', userSchema);
