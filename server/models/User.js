const mongoose = require('mongoose');

// Enhanced User schema with comprehensive profile details
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    // No input validation - allows injection attacks
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // No email validation - vulnerability
  },
  password: {
    type: String,
    required: true,
    // VULNERABILITY: Stored in plaintext - no hashing
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'vendor'],
    default: 'user',
    // VULNERABILITY: Can be modified by users through mass assignment
  },
  // Enhanced profile information
  profile: {
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    displayName: {
      type: String,
      default: ''
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say'
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    profilePicture: {
      type: String,
      default: ''
    },
    coverPhoto: {
      type: String,
      default: ''
    },
    // Contact information
    phone: {
      type: String,
      default: ''
    },
    alternateEmail: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    // Address information
    addresses: [{
      type: {
        type: String,
        enum: ['home', 'work', 'billing', 'shipping'],
        default: 'home'
      },
      street: String,
      street2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true }
    }],
    // Legacy address field for backward compatibility
    address: {
      type: String,
      default: ''
    },
    // Location details
    country: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    zipCode: {
      type: String,
      default: ''
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    // Preferences
    preferences: {
      language: {
        type: String,
        default: 'en'
      },
      currency: {
        type: String,
        default: 'USD'
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ['public', 'friends', 'private'],
          default: 'public'
        },
        showEmail: { type: Boolean, default: false },
        showPhone: { type: Boolean, default: false },
        allowMessages: { type: Boolean, default: true }
      },
      shopping: {
        favoriteCategories: [String],
        priceRange: {
          min: { type: Number, default: 0 },
          max: { type: Number, default: 1000 }
        },
        brands: [String],
        size: String,
        color: String
      }
    },
    // Social media links
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String
    }
  },
  // Account status and security
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned', 'pending_verification'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    default: ''
  },
  // Loyalty and rewards
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  membershipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  // Profile completion
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Activity tracking
  lastLogin: {
    type: Date
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  // Wishlist and favorites
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
  // Payment methods
  paymentMethods: [{
    type: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
      default: 'credit_card'
    },
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number,
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addedAt: { type: Date, default: Date.now }
  }],
  // Session and security tokens
  sessionToken: {
    type: String,
    // VULNERABILITY: Predictable session tokens
  },
  resetToken: {
    type: String,
    // VULNERABILITY: Predictable reset tokens
  },
  resetTokenExpiry: {
    type: Date
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpiry: {
    type: Date
  },
  // Subscription and newsletter
  subscriptions: [{
    type: String,
    subscribedAt: { type: Date, default: Date.now }
  }],
  unsubscribeToken: {
    type: String
  },
  // Analytics and tracking
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  },
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // VULNERABILITY: Expose version key and internal fields
  versionKey: '__v',
  timestamps: true
});

// VULNERABILITY: Predictable session token generation
userSchema.methods.generateSessionToken = function() {
  // Predictable token based on user ID and timestamp
  const timestamp = Date.now();
  const userId = this._id.toString();
  
  // Simple concatenation - easily predictable
  this.sessionToken = `session_${userId}_${timestamp}`;
  return this.sessionToken;
};

// VULNERABILITY: Predictable reset token generation
userSchema.methods.generateResetToken = function() {
  // Predictable reset token
  const timestamp = Date.now();
  const userId = this._id.toString();
  
  // Simple pattern - easily guessable
  this.resetToken = `reset_${userId}_${timestamp}`;
  this.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  
  return this.resetToken;
};

// VULNERABILITY: Weak password validation
userSchema.methods.validatePassword = function(password) {
  // Direct comparison - no hashing
  return this.password === password;
};

// VULNERABILITY: Expose sensitive data in JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  
  // VULNERABILITY: Don't remove sensitive fields
  // Should remove password, sessionToken, resetToken but we don't
  return user;
};

// VULNERABILITY: Static method that allows SQL-like injection
userSchema.statics.findByCredentials = async function(username, password) {
  try {
    // VULNERABILITY: Direct query construction - allows NoSQL injection
    const query = { username: username };
    const user = await this.findOne(query);
    
    if (!user) {
      // VULNERABILITY: User enumeration through different error messages
      throw new Error('User not found');
    }
    
    // VULNERABILITY: Direct password comparison
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    return user;
  } catch (error) {
    // VULNERABILITY: Expose detailed error information
    console.error('Authentication error details:', error);
    throw error;
  }
};

// VULNERABILITY: Method to escalate privileges
userSchema.methods.makeAdmin = function() {
  this.role = 'admin';
  return this.save();
};

// VULNERABILITY: Static method with weak access control
userSchema.statics.getAllUsers = async function() {
  // VULNERABILITY: No access control - any user can call this
  return await this.find({}).select('+password +sessionToken'); // Expose sensitive fields
};

const User = mongoose.model('User', userSchema);

module.exports = User;/ /   A d d e d   u s e r   v a l i d a t i o n  
 