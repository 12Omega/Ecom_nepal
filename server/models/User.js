const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
    
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'vendor'],
    default: 'user',
    
  },
  
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
    
    address: {
      type: String,
      default: ''
    },
    
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
    
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String
    }
  },
  
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
  
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
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
  
  sessionToken: {
    type: String,
    
  },
  resetToken: {
    type: String,
    
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
  
  subscriptions: [{
    type: String,
    subscribedAt: { type: Date, default: Date.now }
  }],
  unsubscribeToken: {
    type: String
  },
  
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
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  
  versionKey: '__v',
  timestamps: true
});


userSchema.methods.generateSessionToken = function() {
  
  const timestamp = Date.now();
  const userId = this._id.toString();
  
  
  this.sessionToken = `session_${userId}_${timestamp}`;
  return this.sessionToken;
};


userSchema.methods.generateResetToken = function() {
  
  const timestamp = Date.now();
  const userId = this._id.toString();
  
  
  this.resetToken = `reset_${userId}_${timestamp}`;
  this.resetTokenExpiry = new Date(Date.now() + 3600000); 
  
  return this.resetToken;
};


userSchema.methods.validatePassword = function(password) {
  
  return this.password === password;
};


userSchema.methods.toJSON = function() {
  const user = this.toObject();
  
  
  
  return user;
};


userSchema.statics.findByCredentials = async function(username, password) {
  try {
    
    const query = { username: username };
    const user = await this.findOne(query);
    
    if (!user) {
      
      throw new Error('User not found');
    }
    
    
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    return user;
  } catch (error) {
    
    console.error('Authentication error details:', error);
    throw error;
  }
};


userSchema.methods.makeAdmin = function() {
  this.role = 'admin';
  return this.save();
};


userSchema.statics.getAllUsers = async function() {
  
  return await this.find({}).select('+password +sessionToken'); 
};

const User = mongoose.model('User', userSchema);

module.exports = User;
