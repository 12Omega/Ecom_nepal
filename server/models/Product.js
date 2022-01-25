const mongoose = require('mongoose');
const validator = require('validator');

// SECURE: Enhanced Product schema with input validation and sanitization
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    validate: {
      validator: function(v) {
        // Prevent XSS by checking for HTML tags
        return !/<[^>]*>/g.test(v);
      },
      message: 'Product name cannot contain HTML tags'
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
    validate: {
      validator: function(v) {
        // Prevent XSS by checking for script tags
        return !/<script[^>]*>.*?<\/script>/gi.test(v);
      },
      message: 'Description cannot contain script tags'
    }
  },
  shortDescription: {
    type: String,
    default: '',
    maxlength: 200,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
    max: [1000000, 'Price exceeds maximum allowed value'],
    validate: {
      validator: function(v) {
        return Number.isFinite(v) && v >= 0;
      },
      message: 'Price must be a valid positive number'
    }
  },
  originalPrice: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000000
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: {
      values: ['Electronics', 'Fashion', 'Home & Office', 'Food & Beverage', 
               'Sports & Fitness', 'Books & Media', 'Health & Beauty', 
               'Toys & Games', 'Automotive', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },
  subcategory: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  brand: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  manufacturer: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  model: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[A-Z0-9-]+$/.test(v);
      },
      message: 'SKU must contain only uppercase letters, numbers, and hyphens'
    }
  },
  barcode: {
    type: String,
    default: '',
    trim: true
  },
  imageUrl: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || validator.isURL(v, { protocols: ['http', 'https'] });
      },
      message: 'Invalid image URL'
    }
  },
  images: [{
    url: {
      type: String,
      validate: {
        validator: function(v) {
          return validator.isURL(v, { protocols: ['http', 'https'] });
        },
        message: 'Invalid image URL'
      }
    },
    alt: {
      type: String,
      maxlength: 200
    },
    isPrimary: { type: Boolean, default: false }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be an integer'
    }
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50,
    validate: {
      validator: function(v) {
        // Prevent XSS in tags
        return !/<[^>]*>/g.test(v);
      },
      message: 'Tags cannot contain HTML'
    }
  }],
  origin: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  countryOfOrigin: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  // Physical specifications
  dimensions: {
    length: { type: Number, default: 0, min: 0 },
    width: { type: Number, default: 0, min: 0 },
    height: { type: Number, default: 0, min: 0 },
    unit: { 
      type: String, 
      default: 'cm',
      enum: ['cm', 'in', 'm']
    }
  },
  weight: {
    value: { type: Number, default: 0, min: 0 },
    unit: { 
      type: String, 
      default: 'kg',
      enum: ['kg', 'g', 'lb', 'oz']
    }
  },
  color: {
    type: String,
    default: '',
    trim: true,
    maxlength: 50
  },
  size: {
    type: String,
    default: '',
    trim: true,
    maxlength: 50
  },
  material: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  // Product details
  features: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  specifications: [{
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    value: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  warranty: {
    duration: { type: Number, default: 0, min: 0 },
    unit: { 
      type: String, 
      default: 'months',
      enum: ['days', 'months', 'years']
    },
    description: { 
      type: String, 
      default: '',
      maxlength: 500
    }
  },
  // Shipping information
  shipping: {
    weight: { type: Number, default: 0, min: 0 },
    dimensions: {
      length: { type: Number, default: 0, min: 0 },
      width: { type: Number, default: 0, min: 0 },
      height: { type: Number, default: 0, min: 0 }
    },
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0, min: 0 },
    processingTime: { type: Number, default: 1, min: 0 },
    estimatedDelivery: { 
      type: String, 
      default: '3-5 business days',
      maxlength: 100
    }
  },
  // SEO and marketing
  seoTitle: {
    type: String,
    default: '',
    trim: true,
    maxlength: 100
  },
  seoDescription: {
    type: String,
    default: '',
    trim: true,
    maxlength: 300
  },
  keywords: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  // Ratings and reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  ratingDistribution: {
    five: { type: Number, default: 0, min: 0 },
    four: { type: Number, default: 0, min: 0 },
    three: { type: Number, default: 0, min: 0 },
    two: { type: Number, default: 0, min: 0 },
    one: { type: Number, default: 0, min: 0 }
  },
  // Sales data
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  // Related products
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  crossSellProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // Inventory management
  reorderLevel: {
    type: Number,
    default: 5,
    min: 0
  },
  maxOrderQuantity: {
    type: Number,
    default: 100,
    min: 1
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  // Pricing history
  priceHistory: [{
    price: {
      type: Number,
      min: 0
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    reason: {
      type: String,
      maxlength: 200
    }
  }],
  // Product status
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'out_of_stock', 'coming_soon'],
    default: 'active'
  },
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Remove internal fields from JSON output
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ createdAt: -1 });

// SECURE: Pre-save middleware for data sanitization
productSchema.pre('save', function(next) {
  // Sanitize string fields
  if (this.isModified('name')) {
    this.name = this.name.replace(/<[^>]*>/g, '').trim();
  }
  if (this.isModified('description')) {
    this.description = this.description.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
  }
  
  // Update timestamp
  this.updatedAt = new Date();
  
  next();
});

// SECURE: Method to get safe product data for public display
productSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    shortDescription: this.shortDescription,
    price: this.price,
    originalPrice: this.originalPrice,
    discountPercentage: this.discountPercentage,
    category: this.category,
    subcategory: this.subcategory,
    brand: this.brand,
    imageUrl: this.imageUrl,
    images: this.images,
    stock: this.stock > 0 ? 'In Stock' : 'Out of Stock',
    featured: this.featured,
    tags: this.tags,
    averageRating: this.averageRating,
    totalReviews: this.totalReviews,
    status: this.status
  };
};

// SECURE: Static method for safe search with input sanitization
productSchema.statics.searchProducts = async function(searchTerm, category, options = {}) {
  try {
    // Sanitize search term to prevent NoSQL injection
    const sanitizedSearch = searchTerm ? 
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').substring(0, 100) : '';
    
    const query = { status: 'active' };
    
    if (sanitizedSearch) {
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
        { tags: { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }
    
    // Validate category against enum
    if (category && this.schema.path('category').enumValues.includes(category)) {
      query.category = category;
    }
    
    // Apply pagination
    const page = Math.max(1, parseInt(options.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 20));
    const skip = (page - 1) * limit;
    
    const products = await this.find(query)
      .select('-__v -createdBy -lastModifiedBy')
      .limit(limit)
      .skip(skip)
      .sort(options.sort || { createdAt: -1 });
    
    const total = await this.countDocuments(query);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    // Don't expose internal error details
    console.error('Search error:', error.message);
    throw new Error('Search failed');
  }
};

// SECURE: Method to update price with validation and audit trail
productSchema.methods.updatePrice = async function(newPrice, userId, reason = '') {
  // Validate price
  if (typeof newPrice !== 'number' || newPrice < 0 || newPrice > 1000000) {
    throw new Error('Invalid price value');
  }
  
  // Add to price history
  this.priceHistory.push({
    price: this.price,
    date: new Date(),
    reason: reason.substring(0, 200)
  });
  
  // Keep only last 50 price changes
  if (this.priceHistory.length > 50) {
    this.priceHistory = this.priceHistory.slice(-50);
  }
  
  this.price = newPrice;
  this.lastModifiedBy = userId;
  
  return await this.save();
};

// SECURE: Static method for bulk operations with validation
productSchema.statics.bulkUpdatePrices = async function(priceUpdates, userId) {
  // Validate input
  if (!Array.isArray(priceUpdates) || priceUpdates.length === 0) {
    throw new Error('Invalid price updates');
  }
  
  if (priceUpdates.length > 100) {
    throw new Error('Cannot update more than 100 products at once');
  }
  
  const results = [];
  const errors = [];
  
  for (const update of priceUpdates) {
    try {
      const product = await this.findById(update.productId);
      if (!product) {
        errors.push({ productId: update.productId, error: 'Product not found' });
        continue;
      }
      
      await product.updatePrice(update.newPrice, userId, update.reason || 'Bulk update');
      results.push({ productId: product._id, success: true });
    } catch (error) {
      errors.push({ productId: update.productId, error: error.message });
    }
  }
  
  return { results, errors };
};

// SECURE: Method to increment view count safely
productSchema.methods.incrementViewCount = async function() {
  return await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
};

// SECURE: Static method to get featured products
productSchema.statics.getFeaturedProducts = async function(limit = 10) {
  return await this.find({ 
    featured: true, 
    status: 'active',
    stock: { $gt: 0 }
  })
  .select('-__v -createdBy -lastModifiedBy')
  .limit(Math.min(limit, 50))
  .sort({ createdAt: -1 });
};

// SECURE: Method to check stock availability
productSchema.methods.isAvailable = function(quantity = 1) {
  return this.status === 'active' && 
         this.stock >= quantity && 
         quantity >= this.minOrderQuantity &&
         quantity <= this.maxOrderQuantity;
};

// SECURE: Method to reserve stock
productSchema.methods.reserveStock = async function(quantity) {
  if (!this.isAvailable(quantity)) {
    throw new Error('Product not available in requested quantity');
  }
  
  this.stock -= quantity;
  
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  }
  
  return await this.save();
};

// SECURE: Method to release reserved stock
productSchema.methods.releaseStock = async function(quantity) {
  this.stock += quantity;
  
  if (this.status === 'out_of_stock' && this.stock > 0) {
    this.status = 'active';
  }
  
  return await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
