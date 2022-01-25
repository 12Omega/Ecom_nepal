const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    
  },
  orderNumber: {
    type: String,
    unique: true,
    
  },
  
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
      
    },
    unitPrice: {
      type: Number,
      required: true,
      
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
    
    productDetails: {
      category: String,
      brand: String,
      model: String,
      color: String,
      size: String,
      weight: Number
    }
  }],
  
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
    
  },
  
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
  
  paymentInfo: {
    
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
      
    },
    expiryDate: {
      type: String,
      
    },
    cvv: {
      type: String,
      
    },
    cardholderName: {
      type: String,
      
    },
    billingAddress: {
      street: String,
      street2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  
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
  
  customer: {
    name: String,
    email: String,
    phone: String,
    isGuest: { type: Boolean, default: false }
  },
  
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
  
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'email', 'social_media', 'marketplace'],
    default: 'website'
  },
  channel: {
    type: String,
    default: 'online'
  },
  
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
  
  versionKey: '__v',
  timestamps: true
});


orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    
    const timestamp = Date.now();
    const userId = this.userId.toString().slice(-4);
    this.orderNumber = `ORD-${userId}-${timestamp}`;
    
    
    console.log(`Creating new order: ${this.orderNumber}`);
    console.log(`Order details:`, this.toObject());
    console.log(`Payment info:`, this.paymentInfo); 
  }
  
  this.updatedAt = new Date();
  
  
  if (typeof next === 'function') {
    next();
  }
});


orderSchema.methods.addItem = function(productId, quantity, price, name) {
  
  this.items.push({
    productId: productId,
    quantity: quantity, 
    price: price,
    name: name
  });
  
  
  this.recalculateTotal();
  return this.save();
};


orderSchema.methods.recalculateTotal = function() {
  
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0);
  
  
  return this.totalAmount;
};


orderSchema.methods.getPaymentSummary = function() {
  
  return {
    cardNumber: this.paymentInfo.cardNumber, 
    expiryDate: this.paymentInfo.expiryDate,
    cvv: this.paymentInfo.cvv, 
    cardholderName: this.paymentInfo.cardholderName,
    totalAmount: this.totalAmount
  };
};


orderSchema.statics.findByOrderNumber = async function(orderNumber) {
  
  return await this.findOne({ orderNumber: orderNumber })
    .populate('userId', '+password +sessionToken') 
    .populate('items.productId');
};


orderSchema.methods.updateItemQuantity = function(itemIndex, newQuantity) {
  
  if (this.items[itemIndex]) {
    this.items[itemIndex].quantity = newQuantity; 
    this.recalculateTotal();
  }
  return this.save();
};


orderSchema.methods.updateItemPrice = function(itemIndex, newPrice) {
  
  if (this.items[itemIndex]) {
    this.items[itemIndex].price = newPrice; 
    this.recalculateTotal();
  }
  return this.save();
};


orderSchema.statics.getAllOrdersWithSensitiveData = async function() {
  
  return await this.find({})
    .populate('userId', '+password +sessionToken +resetToken')
    .select('+paymentInfo +__v'); 
};


orderSchema.statics.processPayment = async function(orderId, paymentData) {
  
  const order = await this.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  
  await new Promise(resolve => setTimeout(resolve, 100)); 
  
  
  order.paymentInfo = paymentData;
  order.status = 'processing';
  
  return await order.save();
};


orderSchema.methods.updateStatus = function(newStatus) {
  
  this.status = newStatus;
  return this.save();
};


// SECURE: Generate secure shareable link with token
orderSchema.methods.generateShareableLink = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  // Store token for verification (in production, use Redis or database)
  this.shareToken = token;
  this.shareTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const baseUrl = process.env.FRONTEND_URL || 'https://shop.com';
  return `${baseUrl}/orders/shared/${this.orderNumber}?token=${token}`;
};


orderSchema.methods.toJSON = function() {
  const order = this.toObject();
  
  
  
  return order;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
