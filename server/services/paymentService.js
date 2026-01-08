const { stripe, logStripeActivity, handleStripeError } = require('../config/stripe');
const User = require('../models/User');
const Order = require('../models/Order');

class PaymentService {
  
  // Create and attach payment method to customer
  async createPaymentMethod(customerId, paymentMethodData) {
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: paymentMethodData.card,
        billing_details: paymentMethodData.billing_details
      });

      // Attach to customer
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId
      });

      logStripeActivity('PAYMENT METHOD CREATED', {
        paymentMethodId: paymentMethod.id,
        customerId,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand
      });

      return {
        success: true,
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          card: {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year
          }
        }
      };
    } catch (error) {
      logStripeActivity('PAYMENT METHOD CREATION FAILED', { error: error.message }, false);
      return handleStripeError(error);
    }
  }

  // Get customer's saved payment methods
  async getCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data.map(pm => ({
          id: pm.id,
          type: pm.type,
          card: {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year
          },
          created: pm.created
        }))
      };
    } catch (error) {
      return handleStripeError(error);
    }
  }

  // Process payment with saved payment method
  async processPaymentWithSavedMethod(paymentMethodId, amount, currency, orderId, customerId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
        customer: customerId,
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        metadata: {
          orderId: orderId,
          paymentType: 'saved_method'
        }
      });

      logStripeActivity('PAYMENT PROCESSED WITH SAVED METHOD', {
        paymentIntentId: paymentIntent.id,
        paymentMethodId,
        amount,
        status: paymentIntent.status
      });

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          requires_action: paymentIntent.status === 'requires_action',
          next_action: paymentIntent.next_action
        }
      };
    } catch (error) {
      return handleStripeError(error);
    }
  }

  // Create subscription for recurring payments
  async createSubscription(customerId, priceId, paymentMethodId) {
    try {
      // Set default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
        expand: ['latest_invoice.payment_intent']
      });

      logStripeActivity('SUBSCRIPTION CREATED', {
        subscriptionId: subscription.id,
        customerId,
        status: subscription.status
      });

      return {
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          latest_invoice: subscription.latest_invoice
        }
      };
    } catch (error) {
      return handleStripeError(error);
    }
  }

  // Calculate order total with tax
  async calculateOrderTotal(items, shippingAddress, couponCode = null) {
    try {
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;
      let shippingCost = 0;

      // Calculate subtotal
      for (const item of items) {
        subtotal += item.quantity * item.price;
      }

      // Apply coupon if provided
      if (couponCode) {
        const coupon = await stripe.coupons.retrieve(couponCode);
        if (coupon.valid) {
          if (coupon.percent_off) {
            discountAmount = Math.round(subtotal * (coupon.percent_off / 100));
          } else if (coupon.amount_off) {
            discountAmount = coupon.amount_off;
          }
        }
      }

      // Calculate tax (simplified - in production, use Stripe Tax or tax service)
      const taxRate = this.getTaxRate(shippingAddress?.state);
      taxAmount = Math.round((subtotal - discountAmount) * taxRate);

      // Calculate shipping (simplified)
      shippingCost = this.calculateShipping(items, shippingAddress);

      const total = subtotal - discountAmount + taxAmount + shippingCost;

      return {
        success: true,
        calculation: {
          subtotal,
          discountAmount,
          taxAmount,
          shippingCost,
          total,
          currency: 'usd'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Simple tax rate calculation (replace with real tax service)
  getTaxRate(state) {
    const taxRates = {
      'CA': 0.0875, // California
      'NY': 0.08,   // New York
      'TX': 0.0625, // Texas
      'FL': 0.06,   // Florida
      'WA': 0.065   // Washington
    };
    return taxRates[state] || 0.05; // Default 5%
  }

  // Simple shipping calculation (replace with real shipping service)
  calculateShipping(items, address) {
    const totalWeight = items.reduce((weight, item) => weight + (item.weight || 1) * item.quantity, 0);
    const baseShipping = 500; // $5.00 base
    const weightShipping = Math.round(totalWeight * 50); // $0.50 per lb
    
    // Free shipping over $50
    const subtotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
    if (subtotal >= 5000) return 0; // Free shipping over $50
    
    return baseShipping + weightShipping;
  }

  // Handle failed payment retry
  async retryFailedPayment(paymentIntentId, newPaymentMethodId = null) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'requires_payment_method') {
        throw new Error('Payment cannot be retried in current status');
      }

      const updateData = {};
      if (newPaymentMethodId) {
        updateData.payment_method = newPaymentMethodId;
      }

      const updatedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, updateData);

      logStripeActivity('PAYMENT RETRY ATTEMPTED', {
        paymentIntentId,
        newStatus: updatedPaymentIntent.status
      });

      return {
        success: true,
        paymentIntent: {
          id: updatedPaymentIntent.id,
          status: updatedPaymentIntent.status,
          requires_action: updatedPaymentIntent.status === 'requires_action',
          next_action: updatedPaymentIntent.next_action
        }
      };
    } catch (error) {
      return handleStripeError(error);
    }
  }

  // Validate webhook event
  async validateWebhookEvent(eventId) {
    try {
      const event = await stripe.events.retrieve(eventId);
      return {
        success: true,
        event: {
          id: event.id,
          type: event.type,
          created: event.created,
          data: event.data
        }
      };
    } catch (error) {
      return handleStripeError(error);
    }
  }
}

module.exports = new PaymentService();