const express = require('express');
const { 
  stripe, 
  logStripeActivity, 
  verifyWebhookSignature,
  handleStripeError,
  paymentTracker, 
  createIdempotencyKey,
  DEMO_CONFIG,
  STRIPE_CURRENCY 
} = require('../config/stripe');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// Create Payment Intent with enhanced security
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = STRIPE_CURRENCY, orderId, customerInfo, paymentMethodTypes = ['card'] } = req.body;
    
    // Validate amount
    if (!amount || amount < DEMO_CONFIG.MIN_AMOUNT || amount > DEMO_CONFIG.MAX_AMOUNT) {
      return res.status(400).json({
        success: false,
        error: `Amount must be between $${DEMO_CONFIG.MIN_AMOUNT / 100} and $${DEMO_CONFIG.MAX_AMOUNT / 100}`
      });
    }

    // Create idempotency key to prevent duplicate charges
    const idempotencyKey = createIdempotencyKey(orderId, customerInfo?.userId, Date.now());
    
    logStripeActivity('PAYMENT INTENT CREATION STARTED', {
      amount,
      currency,
      orderId,
      customerInfo: { ...customerInfo, email: customerInfo?.email ? '***@***.com' : undefined }
    });
    
    // Create payment intent with enhanced options
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure integer
      currency: currency.toLowerCase(),
      payment_method_types: paymentMethodTypes,
      metadata: {
        orderId: orderId || 'no-order',
        customerEmail: customerInfo?.email || 'no-email',
        userId: customerInfo?.userId || 'no-user'
      },
      description: `Order ${orderId || 'DEMO'}`,
      receipt_email: customerInfo?.email,
      setup_future_usage: customerInfo?.savePaymentMethod ? 'off_session' : undefined,
    }, {
      idempotencyKey
    });
    
    // Track payment
    paymentTracker.trackPayment(paymentIntent.id, paymentIntent.status, amount, currency);
    paymentTracker.updatePaymentStep(paymentIntent.id, 'Payment Intent Created', true);
    
    logStripeActivity('PAYMENT INTENT CREATED SUCCESSFULLY', {
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
    
  } catch (error) {
    logStripeActivity('PAYMENT INTENT CREATION FAILED', { error: error.message }, false);
    const errorResponse = handleStripeError(error);
    res.status(500).json(errorResponse);
  }
});

// Get Payment Status
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const trackedPayment = paymentTracker.getPayment(paymentIntentId);
    
    res.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
        metadata: paymentIntent.metadata
      },
      tracking: trackedPayment
    });
    
  } catch (error) {
    const errorResponse = handleStripeError(error);
    res.status(500).json(errorResponse);
  }
});

// Enhanced Webhook Handler with signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    // Verify webhook signature
    const event = verifyWebhookSignature(req.body, sig);
    
    logStripeActivity('WEBHOOK RECEIVED', {
      eventType: event.type,
      eventId: event.id
    });
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'payment_intent.requires_action':
        await handlePaymentRequiresAction(event.data.object);
        break;
      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
    
  } catch (error) {
    logStripeActivity('WEBHOOK VERIFICATION FAILED', { error: error.message }, false);
    res.status(400).json({ error: error.message });
  }
});

// Webhook event handlers
async function handlePaymentSucceeded(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  if (orderId && orderId !== 'no-order') {
    // Update order status if needed
    console.log(`Payment succeeded for order: ${orderId}`);
  }
  paymentTracker.updatePaymentStep(paymentIntent.id, 'Payment Succeeded', true);
}

async function handlePaymentFailed(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  if (orderId && orderId !== 'no-order') {
    console.log(`Payment failed for order: ${orderId}`);
  }
  paymentTracker.updatePaymentStep(paymentIntent.id, 'Payment Failed', false);
}

async function handlePaymentRequiresAction(paymentIntent) {
  paymentTracker.updatePaymentStep(paymentIntent.id, 'Payment Requires Action', true);
}

async function handleChargeDispute(charge) {
  logStripeActivity('CHARGE DISPUTE CREATED', {
    chargeId: charge.id,
    amount: charge.amount,
    reason: charge.reason
  });
}

// Get all demo payments (for testing)
router.get('/demo-payments', (req, res) => {
  const payments = paymentTracker.getAllPayments();
  res.json({
    success: true,
    payments,
    testCards: DEMO_CONFIG.TEST_CARDS
  });
});

module.exports = router;