import React, { useState } from 'react';
import StripeCheckout from './StripeCheckout';

const PaymentDemo: React.FC = () => {
  const [amount, setAmount] = useState(29.99);
  const [currency, setCurrency] = useState('usd');
  const [orderId] = useState(`order_${Date.now()}`);
  const [customerInfo] = useState({
    email: 'demo@example.com',
    name: 'Demo Customer',
    userId: 'demo_user_123'
  });
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentResult(paymentIntent);
    setPaymentError('');
    setShowCheckout(false);
    console.log('Payment successful:', paymentIntent);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentResult(null);
    console.error('Payment failed:', error);
  };

  const startPayment = () => {
    setPaymentResult(null);
    setPaymentError('');
    setShowCheckout(true);
  };

  const resetDemo = () => {
    setPaymentResult(null);
    setPaymentError('');
    setShowCheckout(false);
  };

  if (paymentResult) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#f8fff8', padding: '30px', borderRadius: '8px', border: '1px solid #d4edda' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#155724', margin: '0 0 15px 0' }}>Payment Successful!</h2>
          <p style={{ color: '#155724', marginBottom: '20px' }}>Your payment has been processed successfully.</p>
          
          <div style={{ background: '#e2f3e2', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#155724' }}>Payment Details</h4>
            <p><strong>Payment ID:</strong> {paymentResult.id}</p>
            <p><strong>Amount:</strong> ${(paymentResult.amount / 100).toFixed(2)} {paymentResult.currency.toUpperCase()}</p>
            <p><strong>Status:</strong> {paymentResult.status}</p>
            <p><strong>Order ID:</strong> {orderId}</p>
          </div>

          <button 
            onClick={resetDemo}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Try Another Payment
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2>Complete Your Payment</h2>
          <button 
            onClick={resetDemo}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Setup
          </button>
        </div>
        
        <StripeCheckout
          amount={amount}
          currency={currency}
          orderId={orderId}
          customerInfo={customerInfo}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>🚀 Enhanced Stripe Payment Integration</h1>
        <p>Complete payment solution with 3D Secure, error handling, and webhook support</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Configure Payment</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.50"
              max="999999.99"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="usd">USD - US Dollar</option>
              <option value="eur">EUR - Euro</option>
              <option value="gbp">GBP - British Pound</option>
            </select>
          </div>

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Order Summary</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Order ID:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Amount:</span>
              <span style={{ fontWeight: '600', color: '#0570de' }}>${amount.toFixed(2)} {currency.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Customer:</span>
              <span>{customerInfo.name}</span>
            </div>
          </div>

          <button
            onClick={startPayment}
            disabled={amount < 0.50}
            style={{
              width: '100%',
              background: amount >= 0.50 ? 'linear-gradient(135deg, #0570de 0%, #1a88ff 100%)' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: amount >= 0.50 ? 'pointer' : 'not-allowed'
            }}
          >
            Start Payment Process
          </button>
        </div>

        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>✨ Integration Features</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>✅ Secure Payment Intent API</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>✅ 3D Secure (SCA) Authentication</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>✅ Real-time Error Handling</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>✅ Webhook Event Processing</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>✅ Payment Method Storage</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>✅ Test Card Integration</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>✅ Mobile-Responsive Design</li>
            <li style={{ padding: '8px 0' }}>✅ Production-Ready Security</li>
          </ul>
        </div>
      </div>

      {paymentError && (
        <div style={{ 
          background: '#fff5f5', 
          border: '1px solid #fed7d7', 
          padding: '20px', 
          borderRadius: '6px', 
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
          <h3 style={{ color: '#c53030', margin: '0 0 10px 0' }}>Payment Failed</h3>
          <p style={{ color: '#c53030', margin: '0' }}>{paymentError}</p>
          <button 
            onClick={() => setPaymentError('')}
            style={{
              background: '#c53030',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '6px', 
        textAlign: 'center',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <strong>Note:</strong> This is a demo integration. Use test card numbers in development mode.
        Your Stripe keys are configured and ready for testing!
      </div>
    </div>
  );
};

export default PaymentDemo;