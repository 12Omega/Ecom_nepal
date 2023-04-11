import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import './StripeCheckout.css';

// Demo Stripe publishable key
const stripePromise = loadStripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyz');

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  orderId?: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  currency = 'usd',
  orderId,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [demoLogs, setDemoLogs] = useState<string[]>([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [showTestCards, setShowTestCards] = useState(false);

  const testCards = {
    SUCCESS: '4242424242424242',
    DECLINED: '4000000000000002',
    INSUFFICIENT_FUNDS: '4000000000009995',
    EXPIRED: '4000000000000069',
    PROCESSING_ERROR: '4000000000000119'
  };

  useEffect(() => {
    createPaymentIntent();
  }, [amount]);

  const addDemoLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setDemoLogs(prev => [...prev.slice(-9), logEntry]); // Keep last 10 logs
    
    // Also log to console with colors
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warning: '\x1b[33m'
    };
    console.log(`${colors[type]}🎪 STRIPE DEMO: ${message}\x1b[0m`);
  };

  const createPaymentIntent = async () => {
    try {
      addDemoLog('🚀 Creating Payment Intent...', 'info');
      setAnimationStep(1);
      
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          orderId: orderId,
          customerInfo: {
            email: 'demo@example.com'
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClientSecret(data.clientSecret);
        addDemoLog(`✅ Payment Intent Created: ${data.paymentIntentId}`, 'success');
        addDemoLog(`💰 Amount: $${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`, 'info');
        setAnimationStep(2);
      } else {
        addDemoLog(`❌ Failed to create Payment Intent: ${data.error}`, 'error');
        onError(data.error);
      }
    } catch (error) {
      addDemoLog(`❌ Network Error: ${error}`, 'error');
      onError('Network error occurred');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      addDemoLog('⚠️ Stripe not loaded yet', 'warning');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      addDemoLog('❌ Card element not found', 'error');
      return;
    }

    setProcessing(true);
    setAnimationStep(3);
    addDemoLog('🔄 Processing payment...', 'info');

    try {
      // Create payment method
      addDemoLog('🔐 Creating payment method...', 'info');
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'Demo Customer',
          email: 'demo@example.com',
        },
      });

      if (methodError) {
        addDemoLog(`❌ Payment method error: ${methodError.message}`, 'error');
        onError(methodError.message);
        setProcessing(false);
        return;
      }

      addDemoLog(`✅ Payment method created: ${paymentMethod.id}`, 'success');
      setAnimationStep(4);

      // Confirm payment
      addDemoLog('💳 Confirming payment...', 'info');
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id
        }
      );

      if (confirmError) {
        addDemoLog(`❌ Payment confirmation error: ${confirmError.message}`, 'error');
        onError(confirmError.message);
        setAnimationStep(6); // Error animation
      } else {
        addDemoLog(`🎉 Payment ${paymentIntent.status}!`, 'success');
        addDemoLog(`💰 Amount charged: $${(paymentIntent.amount / 100).toFixed(2)}`, 'success');
        setPaymentStatus(paymentIntent.status);
        setAnimationStep(5); // Success animation
        onSuccess(paymentIntent);
      }
    } catch (error) {
      addDemoLog(`❌ Unexpected error: ${error}`, 'error');
      onError('An unexpected error occurred');
      setAnimationStep(6);
    }

    setProcessing(false);
  };

  const fillTestCard = (cardNumber: string, cardType: string) => {
    const cardElement = elements?.getElement(CardElement);
    if (cardElement) {
      // Clear the card element first
      cardElement.clear();
      addDemoLog(`🧪 Filled test card: ${cardType}`, 'info');
      addDemoLog(`💳 Card Number: ${cardNumber}`, 'info');
      addDemoLog(`📅 Use any future date for expiry`, 'info');
      addDemoLog(`🔒 Use any 3-digit CVC`, 'info');
    }
  };

  const getAnimationClass = () => {
    switch (animationStep) {
      case 1: return 'creating-intent';
      case 2: return 'intent-ready';
      case 3: return 'processing';
      case 4: return 'confirming';
      case 5: return 'success';
      case 6: return 'error';
      default: return '';
    }
  };

  const getStatusMessage = () => {
    switch (animationStep) {
      case 1: return '🚀 Creating Payment Intent...';
      case 2: return '💳 Ready for Payment';
      case 3: return '🔄 Processing Payment...';
      case 4: return '🔐 Confirming Payment...';
      case 5: return '🎉 Payment Successful!';
      case 6: return '❌ Payment Failed';
      default: return '💳 Enter Payment Details';
    }
  };

  return (
    <div className={`stripe-checkout ${getAnimationClass()}`}>
      <div className="checkout-header">
        <h2>🎪 Stripe Demo Checkout</h2>
        <div className="amount-display">
          <span className="currency">{currency.toUpperCase()}</span>
          <span className="amount">${(amount / 100).toFixed(2)}</span>
        </div>
      </div>

      <div className="status-indicator">
        <div className="status-message">{getStatusMessage()}</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(animationStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="demo-controls">
        <button 
          type="button"
          onClick={() => setShowTestCards(!showTestCards)}
          className="test-cards-toggle"
        >
          🧪 {showTestCards ? 'Hide' : 'Show'} Test Cards
        </button>
        
        {showTestCards && (
          <div className="test-cards-panel">
            <h3>🧪 Test Card Numbers</h3>
            <div className="test-cards-grid">
              {Object.entries(testCards).map(([type, number]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => fillTestCard(number, type)}
                  className="test-card-btn"
                  disabled={processing}
                >
                  <div className="card-type">{type.replace('_', ' ')}</div>
                  <div className="card-number">{number}</div>
                </button>
              ))}
            </div>
            <div className="test-info">
              <p>💡 Use any future expiry date and any 3-digit CVC</p>
              <p>🎯 Each card simulates different payment scenarios</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container">
          <label>💳 Card Details</label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          className={`pay-button ${processing ? 'processing' : ''}`}
        >
          {processing ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              💳 Pay ${(amount / 100).toFixed(2)}
            </>
          )}
        </button>
      </form>

      <div className="demo-logs">
        <h3>📋 Live Demo Logs</h3>
        <div className="logs-container">
          {demoLogs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
          {demoLogs.length === 0 && (
            <div className="log-entry placeholder">
              Waiting for payment activity...
            </div>
          )}
        </div>
      </div>

      <div className="demo-info">
        <h3>🎪 Demo Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Mode:</strong> Test Environment
          </div>
          <div className="info-item">
            <strong>Currency:</strong> {currency.toUpperCase()}
          </div>
          <div className="info-item">
            <strong>Amount:</strong> ${(amount / 100).toFixed(2)}
          </div>
          <div className="info-item">
            <strong>Order ID:</strong> {orderId || 'Demo Order'}
          </div>
        </div>
        <p className="demo-note">
          🔒 This is a secure demo using Stripe's test environment. 
          No real payments will be processed.
        </p>
      </div>
    </div>
  );
};

interface StripeCheckoutProps {
  amount: number;
  currency?: string;
  orderId?: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout;/ /   C h e c k o u t   p r o c e s s  
 