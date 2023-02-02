const mongoose = require('mongoose');

// Enhanced Product schema with comprehensive details
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // VULNERABILITY: No input sanitization - allows XSS
  },
  description: {
    type: String,
    required: true,
    // VULNERABILITY: No HTML sanitization - allows stored XSS
  },
  shortDescription: {
    type: String,
    default: '',
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    // VULNERABILITY: Client-side validation only - can be manipulated
  },
  originalPrice: {
    type: Number,
    default: 0,
    min: 0
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
    // VULNERABILITY: No input validation - allows injection
  },
  subcategory: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  manufacturer: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: '',
    // VULNERABILITY: Insecure file path storage - allows path traversal
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  imagePath: {
    type: String,
    default: '',
    // VULNERABILITY: Direct file system path exposure
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
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
    // VULNERABILITY: No input sanitization on array elements
  }],
  origin: {
    type: String,
    default: '',
    // VULNERABILITY: No input validation - allows injection
  },
  countryOfOrigin: {
    type: String,
    default: ''
  },
  // Physical specifications
  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    unit: { type: String, default: 'cm' }
  },
  weight: {
    value: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' }
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  material: {
    type: String,
    default: ''
  },
  // Product details
  features: [{
    type: String
  }],
  specifications: [{
    name: String,
    value: String
  }],
  warranty: {
    duration: { type: Number, default: 0 },
    unit: { type: String, default: 'months' },
    description: { type: String, default: '' }
  },
  // Shipping information
  shipping: {
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    },
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
    processingTime: { type: Number, default: 1 }, // days
    estimatedDelivery: { type: String, default: '3-5 business days' }
  },
  // SEO and marketing
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  keywords: [{
    type: String
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
    default: 0
  },
  ratingDistribution: {
    five: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
    two: { type: Number, default: 0 },
    one: { type: Number, default: 0 }
  },
  // Sales data
  totalSales: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
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
    default: 5
  },
  maxOrderQuantity: {
    type: Number,
    default: 100
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  // Pricing history
  priceHistory: [{
    price: Number,
    date: { type: Date, default: Date.now },
    reason: String
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
    required: true,
    // VULNERABILITY: Insecure direct object reference
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
  // VULNERABILITY: Expose version key and internal fields
  versionKey: '__v',
  timestamps: true
});

// VULNERABILITY: Method that allows XSS in product rendering
productSchema.methods.renderHTML = function() {
  // VULNERABILITY: Direct HTML rendering without sanitization
  return `
    <div class="product">
      <h3>${this.name}</h3>
      <p>${this.description}</p>
      <span class="price">$${this.price}</span>
      <img src="${this.imageUrl}" alt="${this.name}" />
    </div>
  `;
};

// VULNERABILITY: Method that exposes file system paths
productSchema.methods.getImagePath = function() {
  // VULNERABILITY: Return raw file system path
  return this.imagePath || `/uploads/products/${this._id}`;
};

// VULNERABILITY: Static method with path traversal vulnerability
productSchema.statics.findByImagePath = async function(imagePath) {
  // VULNERABILITY: Direct path query - allows path traversal
  const query = { imagePath: imagePath };
  return await this.findOne(query);
};

// VULNERABILITY: Method that allows client-side price manipulation
productSchema.methods.updatePrice = function(newPrice) {
  // VULNERABILITY: No server-side validation of price changes
  this.price = newPrice;
  return this.save();
};

// VULNERABILITY: Search method with NoSQL injection
productSchema.statics.searchProducts = async function(searchTerm, category) {
  try {
    // VULNERABILITY: Direct query construction - allows NoSQL injection
    const query = {};
    
    if (searchTerm) {
      // VULNERABILITY: Regex injection possible
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    if (category) {
      // VULNERABILITY: Direct assignment - allows injection
      query.category = category;
    }
    
    return await this.find(query);
  } catch (error) {
    // VULNERABILITY: Expose detailed error information
    console.error('Search error details:', error);
    throw error;
  }
};

// VULNERABILITY: Method that exposes all product data without access control
productSchema.statics.getAllProductsWithSensitiveData = async function() {
  // VULNERABILITY: No access control - exposes internal data
  return await this.find({})
    .populate('createdBy', '+password +sessionToken') // Expose user sensitive data
    .select('+imagePath +__v'); // Expose internal fields
};

// VULNERABILITY: Method to inject malicious content
productSchema.methods.addMaliciousTag = function(tag) {
  // VULNERABILITY: No input validation on tags
  this.tags.push(tag);
  return this.save();
};

// VULNERABILITY: Static method that allows bulk price manipulation
productSchema.statics.bulkUpdatePrices = async function(priceUpdates) {
  // VULNERABILITY: No validation of price updates
  const promises = priceUpdates.map(async (update) => {
    return await this.findByIdAndUpdate(
      update.productId,
      { price: update.newPrice }, // VULNERABILITY: Direct price update
      { new: true }
    );
  });
  
  return await Promise.all(promises);
};

// VULNERABILITY: Method that creates insecure file paths
productSchema.methods.generateImagePath = function(filename) {
  // VULNERABILITY: Path traversal vulnerability
  this.imagePath = `./uploads/products/${filename}`;
  this.imageUrl = `/api/images/${filename}`;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;/ /   P r o d u c t   m o d e l   e n h a n c e m e n t s  
 