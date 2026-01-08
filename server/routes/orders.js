const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();




router.get('/history', async (req, res) => {
  try {
    const { userId, status, dateRange, sortBy = 'newest', page = 1, limit = 10 } = req.query;
    
    
    let query = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'last_week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last_month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'last_3_months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'last_year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (dateRange !== 'all') {
        query.placedAt = { $gte: filterDate };
      }
    }
    
    
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { placedAt: -1 };
        break;
      case 'oldest':
        sortOptions = { placedAt: 1 };
        break;
      case 'amount_high':
        sortOptions = { totalAmount: -1 };
        break;
      case 'amount_low':
        sortOptions = { totalAmount: 1 };
        break;
      case 'status':
        sortOptions = { status: 1 };
        break;
      default:
        sortOptions = { placedAt: -1 };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email')
      .select('orderNumber status totalAmount placedAt estimatedDelivery trackingNumber items')
      .exec();
    
    
    const orderSummaries = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      itemCount: order.items.length,
      placedAt: order.placedAt,
      estimatedDelivery: order.shipping?.estimatedDelivery,
      trackingNumber: order.shipping?.trackingNumber,
      items: order.items.slice(0, 3).map(item => ({
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity
      }))
    }));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders: orderSummaries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      },
      filters: {
        status,
        dateRange,
        sortBy
      }
    });
    
  } catch (error) {
    console.error('Order history error:', error);
    res.status(500).json({
      error: 'Failed to fetch order history',
      message: error.message,
      stack: error.stack 
    });
  }
});


router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        error: 'Invalid order ID format'
      });
    }
    
    const order = await Order.findById(orderId)
      .populate('userId', 'username email profile')
      .populate('items.productId', 'name imageUrl category brand')
      .populate('statusHistory.updatedBy', 'username')
      .exec();
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        orderId: orderId,
        timestamp: new Date().toISOString()
      });
    }
    
    
    res.json({
      success: true,
      order: order,
      metadata: {
        requestedAt: new Date().toISOString(),
        requestedBy: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch order details',
      message: error.message,
      stack: error.stack,
      orderId: req.params.orderId
    });
  }
});


router.get('/:orderId/tracking', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId).select('shipping statusHistory');
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    
    const mockTrackingEvents = [
      {
        date: new Date('2024-01-20T10:00:00Z'),
        status: 'Order Placed',
        location: 'Online',
        description: 'Your order has been placed successfully'
      },
      {
        date: new Date('2024-01-20T14:30:00Z'),
        status: 'Processing',
        location: 'Warehouse',
        description: 'Order is being prepared for shipment'
      },
      {
        date: new Date('2024-01-21T09:15:00Z'),
        status: 'Shipped',
        location: 'Distribution Center',
        description: 'Package has been shipped'
      },
      {
        date: new Date('2024-01-22T16:45:00Z'),
        status: 'In Transit',
        location: 'Local Facility',
        description: 'Package is on the way to destination'
      }
    ];
    
    res.json({
      success: true,
      tracking: {
        trackingNumber: order.shipping.trackingNumber,
        carrier: order.shipping.carrier,
        status: order.status,
        estimatedDelivery: order.shipping.estimatedDelivery,
        events: mockTrackingEvents
      }
    });
    
  } catch (error) {
    console.error('Tracking fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch tracking information',
      message: error.message
    });
  }
});


router.post('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    
    if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
      return res.status(400).json({
        error: 'Order cannot be cancelled',
        currentStatus: order.status
      });
    }
    
    
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason || 'Cancelled by customer',
      updatedBy: null 
    });
    
    await order.save();
    
    
    console.log('Order cancelled:', {
      orderId: orderId,
      userId: order.userId,
      totalAmount: order.totalAmount,
      reason: reason,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        cancelledAt: order.cancelledAt
      }
    });
    
  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({
      error: 'Failed to cancel order',
      message: error.message,
      stack: error.stack
    });
  }
});


router.post('/:orderId/return', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, reason } = req.body;
    
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    
    if (order.status !== 'delivered') {
      return res.status(400).json({
        error: 'Order must be delivered to request return',
        currentStatus: order.status
      });
    }
    
    
    const item = order.items.find(item => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({
        error: 'Item not found in order'
      });
    }
    
    
    order.returns.push({
      items: [{
        productId: item.productId,
        quantity: item.quantity,
        reason: reason
      }],
      status: 'requested',
      reason: reason,
      requestDate: new Date(),
      notes: ''
    });
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Return request submitted successfully',
      returnRequest: {
        orderId: orderId,
        itemId: itemId,
        reason: reason,
        status: 'requested',
        requestDate: new Date()
      }
    });
    
  } catch (error) {
    console.error('Return request error:', error);
    res.status(500).json({
      error: 'Failed to submit return request',
      message: error.message
    });
  }
});


router.post('/:orderId/reorder', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    
    const order = await Order.findById(orderId).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    
    const availableItems = [];
    const unavailableItems = [];
    
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      
      if (product && product.isActive && product.stock >= item.quantity) {
        availableItems.push({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: product.price 
        });
      } else {
        unavailableItems.push({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          reason: !product ? 'Product no longer available' : 
                  !product.isActive ? 'Product discontinued' : 
                  'Insufficient stock'
        });
      }
    }
    
    
    console.log('Reorder request:', {
      orderId: orderId,
      userId: order.userId,
      availableItems: availableItems.length,
      unavailableItems: unavailableItems.length,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: 'Reorder processed',
      results: {
        availableItems: availableItems,
        unavailableItems: unavailableItems,
        totalAvailable: availableItems.length,
        totalUnavailable: unavailableItems.length
      }
    });
    
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({
      error: 'Failed to process reorder',
      message: error.message
    });
  }
});


router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    const validStatuses = [
      'pending', 'confirmed', 'processing', 'packed', 
      'shipped', 'out_for_delivery', 'delivered', 
      'cancelled', 'returned', 'refunded'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses: validStatuses
      });
    }
    
    
    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();
    
    
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      note: note || `Status changed from ${previousStatus} to ${status}`,
      updatedBy: null 
    });
    
    
    switch (status) {
      case 'confirmed':
        order.confirmedAt = new Date();
        break;
      case 'shipped':
        order.shippedAt = new Date();
        break;
      case 'delivered':
        order.deliveredAt = new Date();
        break;
      case 'cancelled':
        order.cancelledAt = new Date();
        break;
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        previousStatus: previousStatus,
        newStatus: status,
        updatedAt: order.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      error: 'Failed to update order status',
      message: error.message
    });
  }
});


router.get('/stats/summary', async (req, res) => {
  try {
    const { userId, dateRange } = req.query;
    
    
    let matchQuery = {};
    
    if (userId) {
      matchQuery.userId = mongoose.Types.ObjectId(userId);
    }
    
    
    if (dateRange) {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'last_week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'last_month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'last_3_months':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'last_year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setFullYear(2020); 
      }
      
      matchQuery.placedAt = { $gte: startDate };
    }
    
    const stats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          statusBreakdown: {
            $push: '$status'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: 1,
          statusBreakdown: 1
        }
      }
    ]);
    
    
    const statusCounts = {};
    if (stats.length > 0 && stats[0].statusBreakdown) {
      stats[0].statusBreakdown.forEach(status => {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
    }
    
    const result = stats.length > 0 ? {
      ...stats[0],
      statusBreakdown: statusCounts
    } : {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      statusBreakdown: {}
    };
    
    res.json({
      success: true,
      stats: result,
      filters: {
        userId,
        dateRange
      },
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch order statistics',
      message: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
