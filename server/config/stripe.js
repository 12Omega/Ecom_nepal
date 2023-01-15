const stripe = require('stripe');

// DEMO STRIPE CONFIGURATION
// Using Stripe test keys for demonstration purposes
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdefghijklmnopqrstuvwxyz'; // Demo key
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz'; // Demo key

// Initialize Stripe with demo configuration
const stripeInstance = stripe(STRIPE_SECRET_KEY);

// Demo logging function with colorful terminal output
const logStripeActivity = (action, data, success = true) => {
  const timestamp = new Date().toISOString();
  const status = success ? '✅ SUCCESS' : '❌ FAILED';
  const color = success ? '\x1b[32m' : '\x1b[31m'; // Green for success, red for failure
  const reset = '\x1b[0m';
  
  console.log('\n' + '='.repeat(80));
  console.log(`${color}🔥 STRIPE DEMO ACTIVITY ${status}${reset}`);
  console.log('='.repeat(80));
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`🎯 Action: ${action}`);
  console.log(`📊 Data:`, JSON.stringify(data, null, 2));
  console.log('='.repeat(80) + '\n');
};

// Demo webhook event simulator
const simulateWebhookEvent = (eventType, data) => {
  console.log('\n' + '🌟'.repeat(40));
  console.log(`\x1b[35m🎪 STRIPE WEBHOOK SIMULATION\x1b[0m`);
  console.log('🌟'.repeat(40));
  console.log(`📡 Event Type: ${eventType}`);
  console.log(`📦 Event Data:`, JSON.stringify(data, null, 2));
  console.log('🌟'.repeat(40) + '\n');
};

// Demo payment status tracker
class PaymentStatusTracker {
  constructor() {
    this.payments = new Map();
  }
  
  trackPayment(paymentIntentId, status, amount, currency = 'usd') {
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
      this.logPaymentStep(payment, step, success);
    }
  }
  
  logPaymentStatus(payment) {
    console.log('\n' + '💳'.repeat(30));
    console.log(`\x1b[36m💰 PAYMENT TRACKING STARTED\x1b[0m`);
    console.log('💳'.repeat(30));
    console.log(`🆔 Payment ID: ${payment.id}`);
    console.log(`💵 Amount: $${(payment.amount / 100).toFixed(2)} ${payment.currency.toUpperCase()}`);
    console.log(`📊 Status: ${payment.status}`);
    console.log(`⏰ Started: ${payment.timestamp}`);
    console.log('💳'.repeat(30) + '\n');
  }
  
  logPaymentStep(payment, step, success) {
    const status = success ? '✅' : '❌';
    const color = success ? '\x1b[32m' : '\x1b[31m';
    console.log(`${color}${status} Payment Step: ${step}\x1b[0m`);
    console.log(`   └─ Payment ID: ${payment.id}`);
    console.log(`   └─ Timestamp: ${new Date().toISOString()}\n`);
  }
  
  getPayment(paymentIntentId) {
    return this.payments.get(paymentIntentId);
  }
  
  getAllPayments() {
    return Array.from(this.payments.values());
  }
}

const paymentTracker = new PaymentStatusTracker();

module.exports = {
  stripe: stripeInstance,
  STRIPE_PUBLISHABLE_KEY,
  logStripeActivity,
  simulateWebhookEvent,
  paymentTracker,
  
  // Demo configuration
  DEMO_CONFIG: {
    TEST_CARDS: {
      SUCCESS: '4242424242424242',
      DECLINED: '4000000000000002',
      INSUFFICIENT_FUNDS: '4000000000009995',
      EXPIRED: '4000000000000069',
      PROCESSING_ERROR: '4000000000000119'
    },
    DEMO_AMOUNTS: {
      SMALL: 999, // $9.99
      MEDIUM: 2999, // $29.99
      LARGE: 9999, // $99.99
      ENTERPRISE: 19999 // $199.99
    }
  }
};