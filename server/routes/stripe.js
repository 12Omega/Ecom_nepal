const express = require('express');
const { stripe, logStripeActivity, simulateWebhookEvent, paymentTracker, DEMO_CONFIG } = require('../config/stripe');
const Order = require('../models/Order');
const router = express.Router();

// DEMO: Create Payment Intent with extensive logging
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId, customerInfo } = req.body;
    
    // Demo logging - START
    logStripeActivity('PAYMENT INTENT CREATION STARTED', {
      amount: amount,
      currency: currency,
      orderId: orderId,
      customerInfo: customerInfo
    });
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      metadata: {
        orderId: orderId || 'demo-order',
        customerEmail: customerInfo?.email || 'demo@example.com',
        demoMode: 'true'
      },
      description: `Demo Payment for Order ${orderId || 'DEMO'}`,
    });
    
    // Track payment in our demo system
    paymentTracker.trackPayment(paymentIntent.id, paymentIntent.status, amount, currency);
    paymentTracker.updatePaymentStep(paymentIntent.id, 'Payment Intent Created', true);
    
    // Demo logging - SUCCESS
    logStripeActivity('PAYMENT INTENT CREATED SUCCESSFULLY', {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: currency,
      status: paymentIntent.status
    });
    
    // Simulate webhook event
    simulateWebhookEvent('payment_intent.created', {
      id: paymentIntent.id,
      amount: amount,
      currency: currency,
      status: paymentIntent.status
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency,
      demoInfo: {
        message: '🎪 STRIPE DEMO MODE ACTIVE',
        testCards: DEMO_CONFIG.TEST_CARDS,
        instructions: 'Use test card numbers above for different scenarios'
      }
    });
    
  } catch (error) {
    logStripeActivity('PAYMENT INTENT CREATION FAILED', {
      error: error.message,
      stack: error.stack
    }, false);
    
    res.status(500).json({
      success: false,
      error: error.message,
      demoInfo: {
        message: '❌ Payment Intent Creation Failed',
        error: error.message
      }
    });
  }
});

// DEMO: Confirm Payment with detailed tracking
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;
    
    logStripeActivity('PAYMENT CONFIRMATION STARTED', {
      paymentIntentId: paymentIntentId,
      paymentMethodId: paymentMethodId
    });
    
    paymentTracker.updatePaymentStep(paymentIntentId, 'Payment Confirmation Started', true);
    
    // Confirm the payment intent
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
    
    paymentTracker.updatePaymentStep(paymentIntentId, 'Payment Method Attached', true);
    paymentTracker.updatePaymentStep(paymentIntentId, `Payment Status: ${paymentIntent.status}`, true);
    
    logStripeActivity('PAYMENT CONFIRMATION COMPLETED', {
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
    
    // Simulate different webhook events based on status
    if (paymentIntent.status === 'succeeded') {
      simulateWebhookEvent('payment_intent.succeeded', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      });
      paymentTracker.updatePaymentStep(paymentIntentId, '🎉 Payment Succeeded!', true);
    } else if (paymentIntent.status === 'requires_action') {
      simulateWebhookEvent('payment_intent.requires_action', {
        id: paymentIntent.id,
        next_action: paymentIntent.next_action
      });
      paymentTracker.updatePaymentStep(paymentIntentId, '🔐 Additional Authentication Required', true);
    }
    
    res.json({
      success: true,
      paymentIntent: paymentIntent,
      demoInfo: {
        message: `🎪 Payment Status: ${paymentIntent.status.toUpperCase()}`,
        nextSteps: paymentIntent.status === 'requires_action' ? 
          'Complete 3D Secure authentication' : 
          'Payment processing complete'
      }
    });
    
  } catch (error) {
    logStripeActivity('PAYMENT CONFIRMATION FAILED', {
      paymentIntentId: req.body.paymentIntentId,
      error: error.message
    }, false);
    
    paymentTracker.updatePaymentStep(req.body.paymentIntentId, `❌ Payment Failed: ${error.message}`, false);
    
    res.status(400).json({
      success: false,
      error: error.message,
      demoInfo: {
        message: '❌ Payment Confirmation Failed',
        error: error.message,
        suggestion: 'Try using a different test card number'
      }
    });
  }
});

// DEMO: Get Payment Status with visual feedback
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    logStripeActivity('PAYMENT STATUS CHECK', {
      paymentIntentId: paymentIntentId
    });
    
    // Get from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Get from our tracking system
    const trackedPayment = paymentTracker.getPayment(paymentIntentId);
    
    logStripeActivity('PAYMENT STATUS RETRIEVED', {
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      trackingSteps: trackedPayment?.steps?.length || 0
    });
    
    res.json({
      success: true,
      paymentIntent: paymentIntent,
      trackingInfo: trackedPayment,
      demoInfo: {
        message: `💳 Payment Status: ${paymentIntent.status.toUpperCase()}`,
        visualStatus: getVisualStatus(paymentIntent.status),
        amount: `$${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`
      }
    });
    
  } catch (error) {
    logStripeActivity('PAYMENT STATUS CHECK FAILED', {
      paymentIntentId: req.params.paymentIntentId,
      error: error.message
    }, false);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DEMO: Create Customer with detailed logging
router.post('/create-customer', async (req, res) => {
  try {
    const { email, name, phone, address } = req.body;
    
    logStripeActivity('CUSTOMER CREATION STARTED', {
      email: email,
      name: name,
      phone: phone
    });
    
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      phone: phone,
      address: address,
      metadata: {
        demoMode: 'true',
        createdAt: new Date().toISOString()
      }
    });
    
    logStripeActivity('CUSTOMER CREATED SUCCESSFULLY', {
      customerId: customer.id,
      email: customer.email,
      name: customer.name
    });
    
    simulateWebhookEvent('customer.created', {
      id: customer.id,
      email: customer.email,
      name: customer.name
    });
    
    res.json({
      success: true,
      customer: customer,
      demoInfo: {
        message: '👤 Customer Created Successfully',
        customerId: customer.id
      }
    });
    
  } catch (error) {
    logStripeActivity('CUSTOMER CREATION FAILED', {
      error: error.message
    }, false);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DEMO: Process Refund with extensive logging
router.post('/create-refund', async (req, res) => {
  try {
    const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;
    
    logStripeActivity('REFUND PROCESSING STARTED', {
      paymentIntentId: paymentIntentId,
      amount: amount,
      reason: reason
    });
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
      reason: reason,
      metadata: {
        demoMode: 'true',
        processedAt: new Date().toISOString()
      }
    });
    
    paymentTracker.updatePaymentStep(paymentIntentId, `💰 Refund Created: $${(amount / 100).toFixed(2)}`, true);
    
    logStripeActivity('REFUND PROCESSED SUCCESSFULLY', {
      refundId: refund.id,
      paymentIntentId: paymentIntentId,
      amount: refund.amount,
      status: refund.status
    });
    
    simulateWebhookEvent('charge.refunded', {
      refund_id: refund.id,
      payment_intent: paymentIntentId,
      amount: refund.amount,
      status: refund.status
    });
    
    res.json({
      success: true,
      refund: refund,
      demoInfo: {
        message: '💰 Refund Processed Successfully',
        refundId: refund.id,
        amount: `$${(refund.amount / 100).toFixed(2)}`
      }
    });
    
  } catch (error) {
    logStripeActivity('REFUND PROCESSING FAILED', {
      paymentIntentId: req.body.paymentIntentId,
      error: error.message
    }, false);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DEMO: Get all demo payments for dashboard
router.get('/demo-payments', (req, res) => {
  const allPayments = paymentTracker.getAllPayments();
  
  logStripeActivity('DEMO PAYMENTS DASHBOARD ACCESS', {
    totalPayments: allPayments.length,
    timestamp: new Date().toISOString()
  });
  
  res.json({
    success: true,
    payments: allPayments,
    summary: {
      totalPayments: allPayments.length,
      totalAmount: allPayments.reduce((sum, p) => sum + p.amount, 0),
      lastPayment: allPayments.length > 0 ? allPayments[allPayments.length - 1] : null
    },
    demoInfo: {
      message: '📊 Demo Payments Dashboard',
      note: 'All payments are in demo mode using Stripe test environment'
    }
  });
});

// DEMO: Webhook endpoint with extensive logging
router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    // In production, you would verify the webhook signature
    // event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    // For demo purposes, we'll parse the body directly
    event = JSON.parse(req.body);
    
    console.log('\n' + '🎣'.repeat(40));
    console.log('\x1b[33m🎣 STRIPE WEBHOOK RECEIVED\x1b[0m');
    console.log('🎣'.repeat(40));
    console.log(`📡 Event Type: ${event.type}`);
    console.log(`🆔 Event ID: ${event.id || 'demo-event'}`);
    console.log(`📦 Event Data:`, JSON.stringify(event.data || event, null, 2));
    console.log('🎣'.repeat(40) + '\n');
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('\x1b[32m🎉 Payment succeeded!\x1b[0m');
        break;
      case 'payment_intent.payment_failed':
        console.log('\x1b[31m❌ Payment failed!\x1b[0m');
        break;
      case 'customer.created':
        console.log('\x1b[36m👤 New customer created!\x1b[0m');
        break;
      case 'charge.refunded':
        console.log('\x1b[35m💰 Refund processed!\x1b[0m');
        break;
      default:
        console.log(`\x1b[37m📋 Unhandled event type: ${event.type}\x1b[0m`);
    }
    
    res.json({received: true});
    
  } catch (err) {
    console.log('\x1b[31m❌ Webhook signature verification failed.\x1b[0m', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Helper function for visual status
function getVisualStatus(status) {
  const statusMap = {
    'requires_payment_method': '🔄 Awaiting Payment Method',
    'requires_confirmation': '⏳ Awaiting Confirmation',
    'requires_action': '🔐 Requires Authentication',
    'processing': '⚡ Processing Payment',
    'requires_capture': '📋 Awaiting Capture',
    'canceled': '❌ Canceled',
    'succeeded': '✅ Payment Successful'
  };
  
  return statusMap[status] || `❓ ${status}`;
}

module.exports = router;