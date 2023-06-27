const mongoose = require('mongoose');

// Enhanced Order schema with comprehensive order details
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // VULNERABILITY: Insecure direct object reference - no access control
  },
  orderNumber: {
    type: String,
    unique: true,
    // VULNERABILITY: Predictable order numbers
  },
  // Order items with detailed information
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productImage: {
      type: String,
      default: ''
    },
    productSku: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true,
      // VULNERABILITY: No validation - allows negative quantities
    },
    unitPrice: {
      type: Number,
      required: true,
      // VULNERABILITY: Price stored per item - allows manipulation
    },
    totalPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    // Product details at time of order
    productDetails: {
      category: String,
      brand: String,
      model: String,
      color: String,
      size: String,
      weight: Number
    }
  }],
  // Order totals
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    // VULNERABILITY: Calculated client-side - can be manipulated
  },
  // Order status and tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Payment information
  paymentInfo: {
    // VULNERABILITY: Sensitive payment data stored in plaintext
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery', 'digital_wallet'],
      default: 'credit_card'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: ''
    },
    paymentDate: {
      type: Date
    },
    cardNumber: {
      type: String,
      // VULNERABILITY: No encryption - stored in plaintext
    },
    expiryDate: {
      type: String,
      // VULNERABILITY: No encryption - stored in plaintext
    },
    cvv: {
      type: String,
      // VULNERABILITY: No encryption - stored in plaintext
    },
    cardholderName: {
      type: String,
      // VULNERABILITY: No encryption - stored in plaintext
    },
    billingAddress: {
      street: String,
      street2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    // Payment gateway details
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  // Shipping information
  shippingAddress: {
    recipientName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    street2: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    instructions: {
      type: String,
      default: ''
    }
  },
  // Shipping details
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'same_day', 'pickup'],
      default: 'standard'
    },
    carrier: {
      type: String,
      default: ''
    },
    trackingNumber: {
      type: String,
      default: ''
    },
    trackingUrl: {
      type: String,
      default: ''
    },
    estimatedDelivery: {
      type: Date
    },
    actualDelivery: {
      type: Date
    },
    shippedDate: {
      type: Date
    },
    deliveryAttempts: [{
      date: Date,
      status: String,
      note: String
    }]
  },
  // Customer information
  customer: {
    name: String,
    email: String,
    phone: String,
    isGuest: { type: Boolean, default: false }
  },
  // Order notes and communication
  notes: {
    customer: {
      type: String,
      default: ''
    },
    internal: {
      type: String,
      default: ''
    },
    admin: {
      type: String,
      default: ''
    }
  },
  // Discounts and coupons
  coupons: [{
    code: String,
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed_amount', 'free_shipping'],
      default: 'percentage'
    },
    discountValue: Number,
    appliedAmount: Number
  }],
  // Return and refund information
  returns: [{
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      reason: String
    }],
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'received', 'processed', 'refunded'],
      default: 'requested'
    },
    reason: String,
    requestDate: { type: Date, default: Date.now },
    processedDate: Date,
    refundAmount: Number,
    notes: String
  }],
  // Order source and channel
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'email', 'social_media', 'marketplace'],
    default: 'website'
  },
  channel: {
    type: String,
    default: 'online'
  },
  // Marketing and analytics
  referralSource: {
    type: String,
    default: ''
  },
  campaignId: {
    type: String,
    default: ''
  },
  affiliateId: {
    type: String,
    default: ''
  },
  // Order priority and flags
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String,
    default: ''
  },
  isRush: {
    type: Boolean,
    default: false
  },
  // Timestamps
  placedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
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

// VULNERABILITY: Generate predictable order numbers
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    // VULNERABILITY: Predictable order number generation
    const timestamp = Date.now();
    const userId = this.userId.toString().slice(-4);
    this.orderNumber = `ORD-${userId}-${timestamp}`;
    
    // VULNERABILITY: Log sensitive order information
    console.log(`Creating new order: ${this.orderNumber}`);
    console.log(`Order details:`, this.toObject());
    console.log(`Payment info:`, this.paymentInfo); // Sensitive data logging
  }
  
  this.updatedAt = new Date();
  
  // Call next to continue with save operation
  if (typeof next === 'function') {
    next();
  }
});

// VULNERABILITY: Method that allows negative quantities (credit generation)
orderSchema.methods.addItem = function(productId, quantity, price, name) {
  // VULNERABILITY: No validation on quantity - allows negative values
  this.items.push({
    productId: productId,
    quantity: quantity, // Can be negative
    price: price,
    name: name
  });
  
  // VULNERABILITY: Recalculate total without validation
  this.recalculateTotal();
  return this.save();
};

// VULNERABILITY: Insecure total calculation
orderSchema.methods.recalculateTotal = function() {
  // VULNERABILITY: Simple calculation - allows negative totals
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0);
  
  // VULNERABILITY: No validation of final total
  return this.totalAmount;
};

// VULNERABILITY: Method that exposes sensitive payment data
orderSchema.methods.getPaymentSummary = function() {
  // VULNERABILITY: Return sensitive payment information
  return {
    cardNumber: this.paymentInfo.cardNumber, // Full card number exposed
    expiryDate: this.paymentInfo.expiryDate,
    cvv: this.paymentInfo.cvv, // CVV exposed
    cardholderName: this.paymentInfo.cardholderName,
    totalAmount: this.totalAmount
  };
};

// VULNERABILITY: Static method with insecure direct object references
orderSchema.statics.findByOrderNumber = async function(orderNumber) {
  // VULNERABILITY: No access control - any user can access any order
  return await this.findOne({ orderNumber: orderNumber })
    .populate('userId', '+password +sessionToken') // Expose user sensitive data
    .populate('items.productId');
};

// VULNERABILITY: Method that allows order manipulation
orderSchema.methods.updateItemQuantity = function(itemIndex, newQuantity) {
  // VULNERABILITY: No bounds checking or validation
  if (this.items[itemIndex]) {
    this.items[itemIndex].quantity = newQuantity; // Can be negative
    this.recalculateTotal();
  }
  return this.save();
};

// VULNERABILITY: Method that allows price manipulation
orderSchema.methods.updateItemPrice = function(itemIndex, newPrice) {
  // VULNERABILITY: No validation - allows arbitrary price changes
  if (this.items[itemIndex]) {
    this.items[itemIndex].price = newPrice; // Can be negative
    this.recalculateTotal();
  }
  return this.save();
};

// VULNERABILITY: Static method that exposes all orders without access control
orderSchema.statics.getAllOrdersWithSensitiveData = async function() {
  // VULNERABILITY: No access control - exposes all order data
  return await this.find({})
    .populate('userId', '+password +sessionToken +resetToken')
    .select('+paymentInfo +__v'); // Expose sensitive fields
};

// VULNERABILITY: Method for race condition exploitation
orderSchema.statics.processPayment = async function(orderId, paymentData) {
  // VULNERABILITY: No locking mechanism - allows race conditions
  const order = await this.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  // VULNERABILITY: Simulate payment processing without proper concurrency control
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
  
  // VULNERABILITY: Update payment info in plaintext
  order.paymentInfo = paymentData;
  order.status = 'processing';
  
  return await order.save();
};

// VULNERABILITY: Method that allows status manipulation
orderSchema.methods.updateStatus = function(newStatus) {
  // VULNERABILITY: No validation of status transitions
  this.status = newStatus;
  return this.save();
};

// VULNERABILITY: Method that creates insecure order references
orderSchema.methods.generateShareableLink = function() {
  // VULNERABILITY: Predictable sharing mechanism
  const baseUrl = 'https://vulnshop.com/orders/';
  return `${baseUrl}${this.orderNumber}?user=${this.userId}`;
};

// VULNERABILITY: Expose sensitive data in JSON
orderSchema.methods.toJSON = function() {
  const order = this.toObject();
  
  // VULNERABILITY: Don't remove sensitive payment fields
  // Should remove paymentInfo.cardNumber, cvv, etc. but we don't
  return order;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;/ /   O r d e r   m o d e l   i m p r o v e m e n t s  
 