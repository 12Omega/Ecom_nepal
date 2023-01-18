import React, { useState, useEffect } from 'react';
import StripeCheckout from './StripeCheckout';
import './StripeDemoDashboard.css';

interface Payment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  timestamp: string;
  steps: Array<{
    step: string;
    success: boolean;
    timestamp: string;
  }>;
}

interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  lastPayment: Payment | null;
}

const StripeDemoDashboard: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'checkout' | 'dashboard' | 'webhook'>('checkout');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalPayments: 0,
    totalAmount: 0,
    lastPayment: null
  });
  const [selectedAmount, setSelectedAmount] = useState(2999); // $29.99
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [animatingPayment, setAnimatingPayment] = useState<string | null>(null);

  const demoAmounts = [
    { label: 'Small Purchase', value: 999, description: '$9.99 - Coffee & Pastry' },
    { label: 'Medium Purchase', value: 2999, description: '$29.99 - Book or Game' },
    { label: 'Large Purchase', value: 9999, description: '$99.99 - Premium Product' },
    { label: 'Enterprise', value: 19999, description: '$199.99 - Professional Service' }
  ];

  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(fetchPayments, 2000);
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/stripe/demo-payments');
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.payments);
        setSummary(data.summary);
        
        // Add to webhook logs
        if (data.payments.length > payments.length) {
          const newPayments = data.payments.slice(payments.length);
          newPayments.forEach((payment: Payment) => {
            addWebhookLog(`💳 New payment tracked: ${payment.id} - $${(payment.amount / 100).toFixed(2)}`);
          });
        }
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const addWebhookLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setWebhookLogs(prev => [...prev.slice(-19), logEntry]); // Keep last 20 logs
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    setAnimatingPayment(paymentIntent.id);
    addWebhookLog(`🎉 Payment succeeded: ${paymentIntent.id} - $${(paymentIntent.amount / 100).toFixed(2)}`);
    
    // Simulate real-time updates
    setTimeout(() => {
      fetchPayments();
      setAnimatingPayment(null);
    }, 1000);
    
    // Show success notification
    showNotification('Payment Successful!', 'success');
  };

  const handlePaymentError = (error: string) => {
    addWebhookLog(`❌ Payment failed: ${error}`);
    showNotification(`Payment Failed: ${error}`, 'error');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const simulateWebhookEvent = async (eventType: string) => {
    try {
      const response = await fetch('/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: eventType,
          id: `evt_demo_${Date.now()}`,
          data: {
            object: {
              id: `pi_demo_${Date.now()}`,
              amount: selectedAmount,
              currency: 'usd',
              status: eventType.includes('succeeded') ? 'succeeded' : 'failed'
            }
          }
        }),
      });
      
      addWebhookLog(`🎣 Simulated webhook: ${eventType}`);
    } catch (error) {
      addWebhookLog(`❌ Webhook simulation failed: ${error}`);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'succeeded': '#28a745',
      'processing': '#ffc107',
      'requires_action': '#17a2b8',
      'requires_payment_method': '#6c757d',
      'canceled': '#dc3545',
      'failed': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      'succeeded': '✅',
      'processing': '⏳',
      'requires_action': '🔐',
      'requires_payment_method': '💳',
      'canceled': '❌',
      'failed': '❌'
    };
    return icons[status] || '❓';
  };

  return (
    <div className="stripe-demo-dashboard">
      <div className="dashboard-header">
        <h1>🎪 Stripe Integration Demo</h1>
        <p>Complete payment processing demonstration with live feedback</p>
        
        <div className="live-mode-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isLiveMode}
              onChange={(e) => setIsLiveMode(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            {isLiveMode ? '🔴 Live Mode' : '⚪ Static Mode'}
          </span>
        </div>
      </div>

      <div className="demo-nav">
        <button 
          className={activeDemo === 'checkout' ? 'active' : ''}
          onClick={() => setActiveDemo('checkout')}
        >
          💳 Checkout Demo
        </button>
        <button 
          className={activeDemo === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveDemo('dashboard')}
        >
          📊 Payments Dashboard
        </button>
        <button 
          className={activeDemo === 'webhook' ? 'active' : ''}
          onClick={() => setActiveDemo('webhook')}
        >
          🎣 Webhook Simulator
        </button>
      </div>

      <div className="demo-content">
        {activeDemo === 'checkout' && (
          <div className="checkout-demo">
            <div className="amount-selector">
              <h2>💰 Select Demo Amount</h2>
              <div className="amount-grid">
                {demoAmounts.map((amount) => (
                  <button
                    key={amount.value}
                    className={`amount-btn ${selectedAmount === amount.value ? 'selected' : ''}`}
                    onClick={() => setSelectedAmount(amount.value)}
                  >
                    <div className="amount-label">{amount.label}</div>
                    <div className="amount-value">${(amount.value / 100).toFixed(2)}</div>
                    <div className="amount-description">{amount.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="checkout-container">
              <StripeCheckout
                amount={selectedAmount}
                currency="usd"
                orderId={`demo-${Date.now()}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        )}

        {activeDemo === 'dashboard' && (
          <div className="payments-dashboard">
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">💳</div>
                <div className="stat-info">
                  <div className="stat-value">{summary.totalPayments}</div>
                  <div className="stat-label">Total Payments</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${(summary.totalAmount / 100).toFixed(2)}</div>
                  <div className="stat-label">Total Amount</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <div className="stat-value">
                    {summary.totalPayments > 0 ? `$${(summary.totalAmount / summary.totalPayments / 100).toFixed(2)}` : '$0.00'}
                  </div>
                  <div className="stat-label">Average Payment</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <div className="stat-value">
                    {summary.lastPayment ? new Date(summary.lastPayment.timestamp).toLocaleTimeString() : 'N/A'}
                  </div>
                  <div className="stat-label">Last Payment</div>
                </div>
              </div>
            </div>

            <div className="payments-list">
              <h2>💳 Recent Payments</h2>
              {payments.length === 0 ? (
                <div className="no-payments">
                  <div className="no-payments-icon">💳</div>
                  <h3>No payments yet</h3>
                  <p>Process a payment in the Checkout Demo to see it here!</p>
                </div>
              ) : (
                <div className="payments-grid">
                  {payments.slice().reverse().map((payment) => (
                    <div 
                      key={payment.id} 
                      className={`payment-card ${animatingPayment === payment.id ? 'animating' : ''}`}
                    >
                      <div className="payment-header">
                        <div className="payment-id">
                          {getStatusIcon(payment.status)} {payment.id}
                        </div>
                        <div 
                          className="payment-status"
                          style={{ color: getStatusColor(payment.status) }}
                        >
                          {payment.status.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="payment-amount">
                        ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                      </div>
                      
                      <div className="payment-time">
                        {new Date(payment.timestamp).toLocaleString()}
                      </div>
                      
                      {payment.steps && payment.steps.length > 0 && (
                        <div className="payment-steps">
                          <h4>Processing Steps:</h4>
                          {payment.steps.map((step, index) => (
                            <div key={index} className={`step ${step.success ? 'success' : 'error'}`}>
                              {step.success ? '✅' : '❌'} {step.step}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeDemo === 'webhook' && (
          <div className="webhook-simulator">
            <div className="webhook-controls">
              <h2>🎣 Webhook Event Simulator</h2>
              <p>Simulate different Stripe webhook events to see how they're processed</p>
              
              <div className="webhook-buttons">
                <button 
                  onClick={() => simulateWebhookEvent('payment_intent.succeeded')}
                  className="webhook-btn success"
                >
                  🎉 Payment Succeeded
                </button>
                <button 
                  onClick={() => simulateWebhookEvent('payment_intent.payment_failed')}
                  className="webhook-btn error"
                >
                  ❌ Payment Failed
                </button>
                <button 
                  onClick={() => simulateWebhookEvent('customer.created')}
                  className="webhook-btn info"
                >
                  👤 Customer Created
                </button>
                <button 
                  onClick={() => simulateWebhookEvent('charge.refunded')}
                  className="webhook-btn warning"
                >
                  💰 Charge Refunded
                </button>
                <button 
                  onClick={() => simulateWebhookEvent('invoice.payment_succeeded')}
                  className="webhook-btn success"
                >
                  📄 Invoice Paid
                </button>
                <button 
                  onClick={() => simulateWebhookEvent('subscription.created')}
                  className="webhook-btn info"
                >
                  🔄 Subscription Created
                </button>
              </div>
            </div>

            <div className="webhook-logs">
              <h3>📋 Webhook Activity Log</h3>
              <div className="logs-container">
                {webhookLogs.length === 0 ? (
                  <div className="no-logs">
                    <p>No webhook activity yet. Click the buttons above to simulate events!</p>
                  </div>
                ) : (
                  webhookLogs.map((log, index) => (
                    <div key={index} className="webhook-log-entry">
                      {log}
                    </div>
                  ))
                )}
              </div>
              
              <div className="logs-actions">
                <button 
                  onClick={() => setWebhookLogs([])}
                  className="clear-logs-btn"
                >
                  🗑️ Clear Logs
                </button>
                <button 
                  onClick={fetchPayments}
                  className="refresh-btn"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="demo-footer">
        <div className="demo-info-panel">
          <h3>🎪 Demo Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Environment:</strong> Stripe Test Mode
            </div>
            <div className="info-item">
              <strong>Webhook URL:</strong> /api/stripe/webhook
            </div>
            <div className="info-item">
              <strong>Currency:</strong> USD
            </div>
            <div className="info-item">
              <strong>Live Updates:</strong> {isLiveMode ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div className="demo-note">
            🔒 This demo uses Stripe's test environment. No real money is processed.
            All transactions are simulated for demonstration purposes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeDemoDashboard;