const express = require('express');
const paymentService = require('../services/paymentService');
const { logStripeActivity } = require('../config/stripe');
const router = express.Router();

// Middleware to verify user authentication (add your auth middleware here)
const authenticateUser = (req, res, next) => {
  // Add your authentication logic here
  // For now, we'll assume user is authenticated
  req.user = { id: req.headers['user-id'] || 'demo-user' };
  next();
};

// Create payment method for customer
router.post('/payment-methods', authenticateUser, async (req, res) => {
  try {
    const { customerId, paymentMethodData } = req.body;
    
    if (!customerId || !paymentMethodData) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID and payment method data are required'
      });
    }

    const result = await paymentService.createPaymentMethod(customerId, paymentMethodData);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get customer's saved payment methods
router.get('/payment-methods/:customerId', authenticateUser, async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await paymentService.getCustomerPaymentMethods(customerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Process payment with saved payment method
router.post('/process-saved-payment', authenticateUser, async (req, res) => {
  try {
    const { paymentMethodId, amount, currency, orderId, customerId } = req.body;
    
    if (!paymentMethodId || !amount || !customerId) {
      return res.status(400).json({
        success: false,
        error: 'Payment method ID, amount, and customer ID are required'
      });
    }

    const result = await paymentService.processPaymentWithSavedMethod(
      paymentMethodId, 
      amount, 
      currency || 'usd', 
      orderId, 
      customerId
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create subscription
router.post('/subscriptions', authenticateUser, async (req, res) => {
  try {
    const { customerId, priceId, paymentMethodId } = req.body;
    
    if (!customerId || !priceId || !paymentMethodId) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID, price ID, and payment method ID are required'
      });
    }

    const result = await paymentService.createSubscription(customerId, priceId, paymentMethodId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Calculate order total
router.post('/calculate-total', async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required'
      });
    }

    const result = await paymentService.calculateOrderTotal(items, shippingAddress, couponCode);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Retry failed payment
router.post('/retry-payment', authenticateUser, async (req, res) => {
  try {
    const { paymentIntentId, newPaymentMethodId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment Intent ID is required'
      });
    }

    const result = await paymentService.retryFailedPayment(paymentIntentId, newPaymentMethodId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Validate webhook event
router.get('/validate-webhook/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await paymentService.validateWebhookEvent(eventId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;