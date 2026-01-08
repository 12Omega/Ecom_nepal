#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Stripe Setup Configuration');
console.log('================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please copy .env.example to .env first.');
  process.exit(1);
}

// Read current .env file
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('✅ Found .env file');
console.log('✅ Stripe publishable key configured');

// Check if secret key is complete
if (envContent.includes('COMPLETE_YOUR_SECRET_KEY_HERE')) {
  console.log('\n⚠️  ACTION REQUIRED:');
  console.log('Your Stripe secret key appears to be incomplete.');
  console.log('Please complete your secret key in the .env file:');
  console.log('STRIPE_SECRET_KEY=sk_test_51Sh7qFC8f9H2D4biIvq[COMPLETE_THE_REST]');
  console.log('\nYou can find your complete secret key in your Stripe Dashboard:');
  console.log('https://dashboard.stripe.com/test/apikeys');
} else {
  console.log('✅ Stripe secret key configured');
}

// Check webhook secret
if (envContent.includes('whsec_your_webhook_secret_from_stripe_dashboard')) {
  console.log('\n⚠️  WEBHOOK SETUP REQUIRED:');
  console.log('1. Go to https://dashboard.stripe.com/test/webhooks');
  console.log('2. Create a new webhook endpoint: http://localhost:5000/api/stripe/webhook');
  console.log('3. Select these events:');
  console.log('   - payment_intent.succeeded');
  console.log('   - payment_intent.payment_failed');
  console.log('   - payment_intent.requires_action');
  console.log('   - charge.dispute.created');
  console.log('4. Copy the webhook signing secret and update STRIPE_WEBHOOK_SECRET in .env');
} else {
  console.log('✅ Stripe webhook secret configured');
}

console.log('\n🧪 TEST CARDS:');
console.log('Success: 4242424242424242');
console.log('Declined: 4000000000000002');
console.log('3D Secure: 4000002500003155');
console.log('Insufficient Funds: 4000000000009995');

console.log('\n🚀 NEXT STEPS:');
console.log('1. Complete your Stripe secret key in .env');
console.log('2. Set up webhook endpoint (optional for testing)');
console.log('3. Run: npm run dev');
console.log('4. Navigate to: http://localhost:3000/payment-demo');

console.log('\n📚 Documentation: docs/STRIPE_SETUP.md');
console.log('✨ Setup complete! Happy coding!');