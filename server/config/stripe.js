const stripe = require('stripe');

// Enhanced Stripe Configuration for Production
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || 'usd';

// Check if we're in demo mode (invalid or incomplete Stripe key)
const isDemoMode = !STRIPE_SECRET_KEY || 
                   STRIPE_SECRET_KEY.includes('COMPLETE_YOUR_SECRET_KEY') || 
                   STRIPE_SECRET_KEY.length < 20;

if (isDemoMode) {
  console.log('\n⚠️  DEMO MODE: Stripe keys not configured properly');
  console.log('💡 To use real Stripe payments:');
  console.log('   1. Sign up at https://dashboard.stripe.com/register');
  console.log('   2. Get your test API keys');
  console.log('   3. Update STRIPE_SECRET_KEY in .env file\n');
}

// Initialize Stripe with API version (or create mock if in demo mode)
const stripeInstance = isDemoMode ? null : stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Enhanced logging function
const logStripeActivity = (action, data, success = true) => {
  const timestamp = new Date().toISOString();
  const status = success ? '✅ SUCCESS' : '❌ FAILED';
  const color = success ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  
  console.log('\n' + '='.repeat(80));
  console.log(`${color}🔥 STRIPE ACTIVITY ${status}${reset}`);
  console.log('='.repeat(80));
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`🎯 Action: ${action}`);
  console.log(`📊 Data:`, JSON.stringify(data, null, 2));
  console.log('='.repeat(80) + '\n');
};

// Webhook signature verification
const verifyWebhookSignature = (payload, signature) => {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.log('⚠️ STRIPE_WEBHOOK_SECRET not configured - skipping verification');
    return JSON.parse(payload);
  }
  
  try {
    return stripeInstance.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
};

// Enhanced payment status tracker
class PaymentStatusTracker {
  constructor() {
    this.payments = new Map();
  }
  
  trackPayment(paymentIntentId, status, amount, currency = STRIPE_CURRENCY) {
    const payment = {
      id: paymentIntentId,
      status,
      amount,
      currency,
      timestamp: new Date().toISOString(),
      steps: []
    };
    
    this.payments.set(paymentIntentId, payment);
    this.logPaymentStatus(payment);
  }
  
  updatePaymentStep(paymentIntentId, step, success = true) {
    const payment = this.payments.get(paymentIntentId);
    if (payment) {
      payment.steps.push({
        step,
        success,
        timestamp: new Date().toISOString()
      });
      this.logPaymentStatus(payment);
    }
  }
  
  logPaymentStatus(payment) {
    console.log(`\n💳 Payment ${payment.id}: ${payment.status} - $${(payment.amount / 100).toFixed(2)} ${payment.currency.toUpperCase()}`);
    payment.steps.forEach(step => {
      const icon = step.success ? '✅' : '❌';
      console.log(`  ${icon} ${step.step} (${step.timestamp})`);
    });
  }
  
  getPayment(paymentIntentId) {
    return this.payments.get(paymentIntentId);
  }
  
  getAllPayments() {
    return Array.from(this.payments.values());
  }
}

// Payment error handler
const handleStripeError = (error) => {
  const errorResponse = {
    success: false,
    error: error.message,
    type: error.type || 'unknown_error'
  };

  switch (error.type) {
    case 'card_error':
      errorResponse.userMessage = 'Your card was declined. Please try a different payment method.';
      break;
    case 'rate_limit_error':
      errorResponse.userMessage = 'Too many requests. Please try again in a moment.';
      break;
    case 'invalid_request_error':
      errorResponse.userMessage = 'Invalid payment information. Please check your details.';
      break;
    case 'authentication_error':
      errorResponse.userMessage = 'Authentication failed. Please contact support.';
      break;
    case 'api_connection_error':
      errorResponse.userMessage = 'Network error. Please check your connection and try again.';
      break;
    case 'api_error':
      errorResponse.userMessage = 'Payment processing error. Please try again.';
      break;
    default:
      errorResponse.userMessage = 'An unexpected error occurred. Please try again.';
  }

  return errorResponse;
};

// Test card configurations
const DEMO_CONFIG = {
  TEST_CARDS: {
    SUCCESS: '4242424242424242',
    DECLINED: '4000000000000002',
    INSUFFICIENT_FUNDS: '4000000000009995',
    EXPIRED: '4000000000000069',
    PROCESSING_ERROR: '4000000000000119',
    REQUIRES_3DS: '4000002500003155'
  },
  CURRENCIES: ['usd', 'eur', 'gbp', 'cad', 'aud'],
  MIN_AMOUNT: 50, // $0.50 minimum
  MAX_AMOUNT: 99999999 // $999,999.99 maximum
};

// Create idempotency key
const createIdempotencyKey = (orderId, userId, timestamp) => {
  return `${orderId}_${userId}_${timestamp}`;
};

// Mock Stripe for demo mode
const createMockStripe = () => ({
  paymentIntents: {
    create: async (params) => {
      console.log('🎭 DEMO MODE: Creating mock payment intent');
      return {
        id: `pi_demo_${Date.now()}`,
        client_secret: `pi_demo_${Date.now()}_secret_demo`,
        status: 'requires_payment_method',
        amount: params.amount,
        currency: params.currency,
        metadata: params.metadata,
        created: Math.floor(Date.now() / 1000)
      };
    },
    retrieve: async (id) => {
      console.log('🎭 DEMO MODE: Retrieving mock payment intent');
      return {
        id,
        status: 'succeeded',
        amount: 10000,
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        metadata: {}
      };
    }
  },
  webhooks: {
    constructEvent: (payload, signature, secret) => {
      return JSON.parse(payload);
    }
  }
});

// Use mock Stripe if in demo mode
const finalStripeInstance = isDemoMode ? createMockStripe() : stripeInstance;

const paymentTracker = new PaymentStatusTracker();

module.exports = {
  stripe: finalStripeInstance,
  logStripeActivity,
  verifyWebhookSignature,
  handleStripeError,
  paymentTracker,
  createIdempotencyKey,
  DEMO_CONFIG,
  STRIPE_CURRENCY,
  STRIPE_PUBLISHABLE_KEY,
  isDemoMode
};