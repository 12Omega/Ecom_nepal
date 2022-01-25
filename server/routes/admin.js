const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const { ActivityLogger } = require('../services/activityLogger');

// SECURE: All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// Admin panel root
router.get('/', (req, res) => {
  res.json({
    message: 'Admin Panel',
    endpoints: [
      '/api/admin/dashboard',
      '/api/admin/users',
      '/api/admin/products',
      '/api/admin/orders'
    ],
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// SECURE: Admin dashboard with proper authentication
router.get('/dashboard', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    // Get recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: yesterday } });
    const recentOrders = await Order.countDocuments({ createdAt: { $gte: yesterday } });
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ADMIN_DASHBOARD_VIEW',
      details: { timestamp: new Date() },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'SYSTEM',
      severity: 'LOW'
    });
    
    res.json({
      message: 'Admin Dashboard',
      statistics: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: totalRevenue,
        recentUsers: recentUsers,
        recentOrders: recentOrders
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({
      error: 'Failed to load dashboard',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Get all users (admin only)
router.get('/users', requirePermission('admin:users:read'), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('-password -sessionToken -resetToken -emailVerificationToken -twoFactorSecret')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ADMIN_USERS_LIST',
      details: { page, limit, total },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'DATA_ACCESS',
      severity: 'MEDIUM'
    });
    
    res.json({
      users: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch users',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Get specific user (admin only)
router.get('/users/:userId', requirePermission('admin:users:read'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -sessionToken -resetToken -emailVerificationToken -twoFactorSecret');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ADMIN_USER_VIEW',
      details: { viewedUserId: user._id, viewedUsername: user.username },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'DATA_ACCESS',
      severity: 'MEDIUM'
    });
    
    res.json({ user });
  } catch (error) {
    console.error('User fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch user',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Update user role (admin only)
router.put('/users/:userId/role', requirePermission('admin:users:update'), async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!['user', 'admin', 'moderator', 'vendor'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Must be one of: user, admin, moderator, vendor'
      });
    }
    
    // Prevent self-demotion
    if (req.params.userId === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        error: 'Cannot change your own admin role'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password -sessionToken -resetToken -emailVerificationToken -twoFactorSecret');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ROLE_CHANGE',
      details: { 
        targetUserId: user._id,
        targetUsername: user.username,
        newRole: role
      },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'AUTHORIZATION',
      severity: 'HIGH'
    });
    
    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Role update error:', error.message);
    res.status(500).json({
      error: 'Failed to update user role',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Delete user (admin only)
router.delete('/users/:userId', requirePermission('admin:users:delete'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent self-deletion
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot delete your own account'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Soft delete by deactivating account
    user.accountStatus = 'inactive';
    await user.save();
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ADMIN_USER_DELETE',
      details: { 
        deletedUserId: user._id,
        deletedUsername: user.username
      },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'DATA_ACCESS',
      severity: 'HIGH'
    });
    
    res.json({
      message: 'User account deactivated successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('User deletion error:', error.message);
    res.status(500).json({
      error: 'Failed to delete user',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Create product (admin only)
router.post('/products', requirePermission('admin:products:manage'), async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        error: 'Missing required fields: name, description, price, category'
      });
    }
    
    const product = new Product({
      name,
      description,
      price,
      category,
      imageUrl: imageUrl || '',
      stock: stock || 0,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    });
    
    await product.save();
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ADMIN_PRODUCT_CREATE',
      details: { 
        productId: product._id,
        productName: product.name
      },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'DATA_ACCESS',
      severity: 'MEDIUM'
    });
    
    res.status(201).json({
      message: 'Product created successfully',
      product: product.toPublicJSON()
    });
  } catch (error) {
    console.error('Product creation error:', error.message);
    res.status(500).json({
      error: 'Failed to create product',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Update product (admin only)
router.put('/products/:productId', requirePermission('admin:products:manage'), async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData.__v;
    
    // Add last modified info
    updateData.lastModifiedBy = req.user._id;
    updateData.updatedAt = new Date();
    
    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ADMIN_PRODUCT_UPDATE',
      details: { 
        productId: product._id,
        productName: product.name,
        updatedFields: Object.keys(updateData)
      },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'DATA_ACCESS',
      severity: 'MEDIUM'
    });
    
    res.json({
      message: 'Product updated successfully',
      product: product.toPublicJSON()
    });
  } catch (error) {
    console.error('Product update error:', error.message);
    res.status(500).json({
      error: 'Failed to update product',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Get all orders (admin only)
router.get('/orders', requirePermission('admin:orders:read'), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({})
      .populate('userId', 'username email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments();
    
    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Orders fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch orders',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Update order status (admin only)
router.put('/orders/:orderId/status', requirePermission('admin:orders:update'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'username email');
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ADMIN_ORDER_UPDATE',
      details: { 
        orderId: order._id,
        orderNumber: order.orderNumber,
        newStatus: status
      },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'TRANSACTION',
      severity: 'MEDIUM'
    });
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Order update error:', error.message);
    res.status(500).json({
      error: 'Failed to update order',
      timestamp: new Date().toISOString()
    });
  }
});

// SECURE: Get security events (admin only)
router.get('/security/events', requirePermission('admin:security:read'), async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const severity = req.query.severity || null;
    
    const events = await ActivityLogger.getSecurityEvents(limit, severity);
    
    res.json({
      events,
      count: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Security events fetch error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch security events',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
