import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  orderId?: string;
  customerInfo?: {
    email?: string;
    name?: string;
    userId?: string;
  };
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  currency = 'usd',
  orderId,
  customerInfo,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [succeeded, setSucceeded] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: customerInfo?.name || '',
    email: customerInfo?.email || '',
    address: {
      postal_code: ''
    }
  });

  const testCards = {
    SUCCESS: '4242424242424242',
    DECLINED: '4000000000000002',
    INSUFFICIENT_FUNDS: '4000000000009995',
    REQUIRES_3DS: '4000002500003155'
  };

  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, orderId]);

  const createPaymentIntent = async () => {
    try {
      setError('');
      setPaymentStatus('Creating payment intent...');
      
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency,
          orderId: orderId,
          customerInfo: customerInfo
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClientSecret(data.clientSecret);
        setPaymentStatus('Ready for payment');
      } else {
        throw new Error(data.error || 'Failed to create payment intent');
      }
    } catch (err: any) {
      setError(err.message);
      onError(err.message);
      setPaymentStatus('Error creating payment intent');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setProcessing(true);
    setError('');
    
    try {
      setPaymentStatus('Processing payment...');

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: billingDetails,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setPaymentStatus('Payment succeeded!');
        onSuccess(paymentIntent);
      }

    } catch (err: any) {
      setError(err.message);
      onError(err.message);
      setPaymentStatus('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'postal_code') {
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          postal_code: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (succeeded) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h3>Payment Successful!</h3>
        <p>Your payment has been processed successfully.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3>Payment Details</h3>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#0570de' }}>
              ${amount.toFixed(2)} {currency.toUpperCase()}
            </div>
            {orderId && <div style={{ fontSize: '14px', color: '#666' }}>Order: {orderId}</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Cardholder Name
            </label>
            <input
              type="text"
              value={billingDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Full name on card"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Card Number
            </label>
            <div style={{ 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              background: 'white'
            }}>
              <CardNumberElement
                options={cardElementOptions}
                onChange={(event) => {
                  if (event.error) {
                    setError(event.error.message);
                  } else {
                    setError('');
                  }
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                MM/YY
              </label>
              <div style={{ 
                padding: '12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                background: 'white'
              }}>
                <CardExpiryElement
                  options={cardElementOptions}
                  onChange={(event) => {
                    if (event.error) {
                      setError(event.error.message);
                    } else {
                      setError('');
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                CVC
              </label>
              <div style={{ 
                padding: '12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                background: 'white'
              }}>
                <CardCvcElement
                  options={cardElementOptions}
                  onChange={(event) => {
                    if (event.error) {
                      setError(event.error.message);
                    } else {
                      setError('');
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                ZIP Code
              </label>
              <input
                type="text"
                value={billingDetails.address.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="12345"
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ 
              background: '#fdf2f2', 
              border: '1px solid #f5c6cb', 
              padding: '12px', 
              borderRadius: '4px', 
              color: '#721c24',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', color: processing ? '#0570de' : '#666' }}>
              {paymentStatus}
            </span>
          </div>

          <button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            style={{
              width: '100%',
              background: (!stripe || processing || !clientSecret) ? '#ccc' : 'linear-gradient(135deg, #0570de 0%, #1a88ff 100%)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (!stripe || processing || !clientSecret) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {processing ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </form>

        <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧪 Test Cards (Development Mode)
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px' }}>
            {Object.entries(testCards).map(([type, number]) => (
              <div key={type} style={{ 
                background: 'white', 
                border: '1px solid #ddd', 
                padding: '12px', 
                borderRadius: '4px', 
                fontSize: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                  {type.replace('_', ' ')}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                  {number}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            background: 'white', 
            border: '1px solid #ddd', 
            padding: '15px', 
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
              Use with any test card:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px' }}>
              <div>
                <strong>MM/YY:</strong> Any future date<br/>
                <span style={{ color: '#666', fontSize: '11px' }}>e.g., 12/25, 01/26</span>
              </div>
              <div>
                <strong>CVC:</strong> Any 3 digits<br/>
                <span style={{ color: '#666', fontSize: '11px' }}>e.g., 123, 456</span>
              </div>
              <div>
                <strong>ZIP:</strong> Any 5 digits<br/>
                <span style={{ color: '#666', fontSize: '11px' }}>e.g., 12345, 90210</span>
              </div>
            </div>
          </div>
          
          <p style={{ fontSize: '11px', color: '#666', margin: '0', textAlign: 'center' }}>
            💡 <strong>Quick Test:</strong> Use card 4242424242424242, expiry 12/25, CVC 123, ZIP 12345
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Main Stripe Checkout Component
interface StripeCheckoutProps {
  amount: number;
  currency?: string;
  orderId?: string;
  customerInfo?: {
    email?: string;
    name?: string;
    userId?: string;
  };
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements 
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0570de',
          }
        }
      }}
    >
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout;