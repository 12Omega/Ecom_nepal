import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './OrderDetail.css';

interface OrderItem {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  tax: number;
  productDetails: {
    category: string;
    brand: string;
    model: string;
    color: string;
    size: string;
    weight: number;
  };
}

interface PaymentInfo {
  method: string;
  status: string;
  transactionId: string;
  paymentDate: string;
  cardNumber: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface ShippingInfo {
  method: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  actualDelivery: string;
  shippedDate: string;
  deliveryAttempts: Array<{
    date: string;
    status: string;
    note: string;
  }>;
}

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note: string;
  updatedBy: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  statusHistory: StatusHistoryItem[];
  paymentInfo: PaymentInfo;
  shippingAddress: {
    recipientName: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    instructions: string;
  };
  shipping: ShippingInfo;
  customer: {
    name: string;
    email: string;
    phone: string;
    isGuest: boolean;
  };
  notes: {
    customer: string;
    internal: string;
    admin: string;
  };
  coupons: Array<{
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    appliedAmount: number;
  }>;
  returns: Array<{
    items: Array<{
      productId: string;
      quantity: number;
      reason: string;
    }>;
    status: string;
    reason: string;
    requestDate: string;
    processedDate: string;
    refundAmount: number;
    notes: string;
  }>;
  source: string;
  channel: string;
  priority: string;
  isGift: boolean;
  giftMessage: string;
  isRush: boolean;
  placedAt: string;
  confirmedAt: string;
  shippedAt: string;
  deliveredAt: string;
  cancelledAt: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [trackingInfo, setTrackingInfo] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchTrackingInfo();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        console.error('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`);
      if (response.ok) {
        const data = await response.json();
        setTrackingInfo(data.tracking);
      }
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: '#ffa500',
      confirmed: '#4169e1',
      processing: '#32cd32',
      packed: '#9370db',
      shipped: '#1e90ff',
      out_for_delivery: '#ff6347',
      delivered: '#228b22',
      cancelled: '#dc143c',
      returned: '#ff4500',
      refunded: '#8b4513'
    };
    return statusColors[status] || '#666';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const cancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Order cancelled successfully');
        fetchOrderDetails();
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    }
  };

  const requestReturn = async (itemId: string) => {
    const reason = prompt('Please provide a reason for the return:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          reason
        }),
      });

      if (response.ok) {
        alert('Return request submitted successfully');
        fetchOrderDetails();
      } else {
        alert('Failed to submit return request');
      }
    } catch (error) {
      console.error('Error requesting return:', error);
      alert('Error requesting return');
    }
  };

  if (loading) {
    return (
      <div className="order-detail">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail">
        <div className="error">
          <h2>Order not found</h2>
          <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <div className="container">
        {/* Header */}
        <div className="order-header">
          <div className="order-title">
            <h1>Order #{order.orderNumber}</h1>
            <div className="order-meta">
              <span className="order-date">Placed on {formatDate(order.placedAt)}</span>
              <span 
                className="order-status" 
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
              {order.priority !== 'normal' && (
                <span className={`priority-badge priority-${order.priority}`}>
                  {order.priority.toUpperCase()} PRIORITY
                </span>
              )}
              {order.isRush && (
                <span className="rush-badge">RUSH ORDER</span>
              )}
              {order.isGift && (
                <span className="gift-badge">🎁 GIFT</span>
              )}
            </div>
          </div>
          
          <div className="order-actions">
            {order.status === 'pending' && (
              <button onClick={cancelOrder} className="btn btn-danger">
                Cancel Order
              </button>
            )}
            {order.shipping.trackingNumber && (
              <a 
                href={order.shipping.trackingUrl || `#tracking-${order.shipping.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Track Package
              </a>
            )}
            <button className="btn btn-primary">
              Reorder Items
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="order-nav">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📋 Overview
          </button>
          <button 
            className={activeTab === 'items' ? 'active' : ''}
            onClick={() => setActiveTab('items')}
          >
            📦 Items ({order.items.length})
          </button>
          <button 
            className={activeTab === 'shipping' ? 'active' : ''}
            onClick={() => setActiveTab('shipping')}
          >
            🚚 Shipping & Tracking
          </button>
          <button 
            className={activeTab === 'payment' ? 'active' : ''}
            onClick={() => setActiveTab('payment')}
          >
            💳 Payment
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            📈 Status History
          </button>
          {order.returns.length > 0 && (
            <button 
              className={activeTab === 'returns' ? 'active' : ''}
              onClick={() => setActiveTab('returns')}
            >
              🔄 Returns & Refunds
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="order-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                {/* Order Summary */}
                <div className="summary-card">
                  <h3>Order Summary</h3>
                  <div className="summary-details">
                    <div className="summary-line">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="summary-line discount">
                        <span>Discount:</span>
                        <span>-{formatCurrency(order.discountAmount)}</span>
                      </div>
                    )}
                    <div className="summary-line">
                      <span>Tax:</span>
                      <span>{formatCurrency(order.taxAmount)}</span>
                    </div>
                    <div className="summary-line">
                      <span>Shipping:</span>
                      <span>{order.shippingCost > 0 ? formatCurrency(order.shippingCost) : 'Free'}</span>
                    </div>
                    <div className="summary-line total">
                      <span>Total:</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                  
                  {order.coupons.length > 0 && (
                    <div className="coupons-applied">
                      <h4>Coupons Applied</h4>
                      {order.coupons.map((coupon, index) => (
                        <div key={index} className="coupon-item">
                          <span className="coupon-code">{coupon.code}</span>
                          <span className="coupon-description">{coupon.description}</span>
                          <span className="coupon-savings">
                            -{formatCurrency(coupon.appliedAmount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Information */}
                <div className="customer-card">
                  <h3>Customer Information</h3>
                  <div className="customer-details">
                    <p><strong>Name:</strong> {order.customer.name}</p>
                    <p><strong>Email:</strong> {order.customer.email}</p>
                    <p><strong>Phone:</strong> {order.customer.phone}</p>
                    <p><strong>Account Type:</strong> {order.customer.isGuest ? 'Guest' : 'Registered'}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="address-card">
                  <h3>Shipping Address</h3>
                  <div className="address-details">
                    <p><strong>{order.shippingAddress.recipientName}</strong></p>
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                    {order.shippingAddress.instructions && (
                      <div className="delivery-instructions">
                        <strong>Delivery Instructions:</strong>
                        <p>{order.shippingAddress.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Notes */}
                {(order.notes.customer || order.giftMessage) && (
                  <div className="notes-card">
                    <h3>Order Notes</h3>
                    {order.notes.customer && (
                      <div className="note-item">
                        <strong>Customer Note:</strong>
                        <p>{order.notes.customer}</p>
                      </div>
                    )}
                    {order.giftMessage && (
                      <div className="note-item gift-message">
                        <strong>Gift Message:</strong>
                        <p>{order.giftMessage}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="items-tab">
              <div className="items-list">
                {order.items.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="item-image">
                      <img 
                        src={item.productImage || '/api/placeholder/100/100'} 
                        alt={item.productName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/api/placeholder/100/100';
                        }}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h4>
                        <Link to={`/product/${item.productId}`}>
                          {item.productName}
                        </Link>
                      </h4>
                      {item.productSku && (
                        <p className="item-sku">SKU: {item.productSku}</p>
                      )}
                      
                      <div className="item-specs">
                        {item.productDetails.brand && (
                          <span className="spec">Brand: {item.productDetails.brand}</span>
                        )}
                        {item.productDetails.color && (
                          <span className="spec">Color: {item.productDetails.color}</span>
                        )}
                        {item.productDetails.size && (
                          <span className="spec">Size: {item.productDetails.size}</span>
                        )}
                        {item.productDetails.model && (
                          <span className="spec">Model: {item.productDetails.model}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="item-pricing">
                      <div className="quantity">Qty: {item.quantity}</div>
                      <div className="unit-price">
                        Unit Price: {formatCurrency(item.unitPrice)}
                      </div>
                      {item.discount > 0 && (
                        <div className="item-discount">
                          Discount: -{formatCurrency(item.discount)}
                        </div>
                      )}
                      {item.tax > 0 && (
                        <div className="item-tax">
                          Tax: {formatCurrency(item.tax)}
                        </div>
                      )}
                      <div className="total-price">
                        Total: {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      {order.status === 'delivered' && (
                        <button 
                          onClick={() => requestReturn(item._id)}
                          className="btn btn-sm btn-secondary"
                        >
                          Request Return
                        </button>
                      )}
                      <Link 
                        to={`/product/${item.productId}`}
                        className="btn btn-sm btn-primary"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="shipping-tab">
              <div className="shipping-grid">
                <div className="shipping-info-card">
                  <h3>Shipping Information</h3>
                  <div className="shipping-details">
                    <p><strong>Method:</strong> {order.shipping.method.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Carrier:</strong> {order.shipping.carrier || 'TBD'}</p>
                    {order.shipping.trackingNumber && (
                      <p><strong>Tracking Number:</strong> 
                        <span className="tracking-number">{order.shipping.trackingNumber}</span>
                      </p>
                    )}
                    <p><strong>Estimated Delivery:</strong> {formatDate(order.shipping.estimatedDelivery)}</p>
                    {order.shipping.actualDelivery && (
                      <p><strong>Actual Delivery:</strong> {formatDate(order.shipping.actualDelivery)}</p>
                    )}
                    {order.shipping.shippedDate && (
                      <p><strong>Shipped Date:</strong> {formatDate(order.shipping.shippedDate)}</p>
                    )}
                  </div>
                </div>

                {order.shipping.deliveryAttempts.length > 0 && (
                  <div className="delivery-attempts-card">
                    <h3>Delivery Attempts</h3>
                    <div className="attempts-list">
                      {order.shipping.deliveryAttempts.map((attempt, index) => (
                        <div key={index} className="attempt-item">
                          <div className="attempt-date">{formatDate(attempt.date)}</div>
                          <div className="attempt-status">{attempt.status}</div>
                          {attempt.note && <div className="attempt-note">{attempt.note}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trackingInfo && (
                  <div className="tracking-card">
                    <h3>Package Tracking</h3>
                    <div className="tracking-timeline">
                      {trackingInfo.events?.map((event: any, index: number) => (
                        <div key={index} className="tracking-event">
                          <div className="event-date">{formatDate(event.date)}</div>
                          <div className="event-status">{event.status}</div>
                          <div className="event-location">{event.location}</div>
                          {event.description && (
                            <div className="event-description">{event.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="payment-tab">
              <div className="payment-grid">
                <div className="payment-info-card">
                  <h3>Payment Information</h3>
                  <div className="payment-details">
                    <p><strong>Method:</strong> {order.paymentInfo.method.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Status:</strong> 
                      <span className={`payment-status status-${order.paymentInfo.status}`}>
                        {order.paymentInfo.status.toUpperCase()}
                      </span>
                    </p>
                    {order.paymentInfo.transactionId && (
                      <p><strong>Transaction ID:</strong> {order.paymentInfo.transactionId}</p>
                    )}
                    {order.paymentInfo.paymentDate && (
                      <p><strong>Payment Date:</strong> {formatDate(order.paymentInfo.paymentDate)}</p>
                    )}
                    {order.paymentInfo.cardNumber && (
                      <p><strong>Card:</strong> **** **** **** {order.paymentInfo.cardNumber.slice(-4)}</p>
                    )}
                    {order.paymentInfo.cardholderName && (
                      <p><strong>Cardholder:</strong> {order.paymentInfo.cardholderName}</p>
                    )}
                  </div>
                </div>

                <div className="billing-address-card">
                  <h3>Billing Address</h3>
                  <div className="address-details">
                    <p>{order.paymentInfo.billingAddress.street}</p>
                    {order.paymentInfo.billingAddress.street2 && (
                      <p>{order.paymentInfo.billingAddress.street2}</p>
                    )}
                    <p>
                      {order.paymentInfo.billingAddress.city}, {order.paymentInfo.billingAddress.state} {order.paymentInfo.billingAddress.zipCode}
                    </p>
                    <p>{order.paymentInfo.billingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <div className="status-timeline">
                <h3>Order Status History</h3>
                <div className="timeline">
                  {order.statusHistory.map((status, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker" style={{ backgroundColor: getStatusColor(status.status) }}></div>
                      <div className="timeline-content">
                        <div className="status-header">
                          <span className="status-name">{status.status.replace('_', ' ').toUpperCase()}</span>
                          <span className="status-date">{formatDate(status.timestamp)}</span>
                        </div>
                        {status.note && (
                          <div className="status-note">{status.note}</div>
                        )}
                        {status.updatedBy && (
                          <div className="status-updater">Updated by: {status.updatedBy}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'returns' && order.returns.length > 0 && (
            <div className="returns-tab">
              <h3>Returns & Refunds</h3>
              <div className="returns-list">
                {order.returns.map((returnItem, index) => (
                  <div key={index} className="return-item">
                    <div className="return-header">
                      <span className="return-status">{returnItem.status.toUpperCase()}</span>
                      <span className="return-date">Requested: {formatDate(returnItem.requestDate)}</span>
                    </div>
                    <div className="return-details">
                      <p><strong>Reason:</strong> {returnItem.reason}</p>
                      {returnItem.refundAmount && (
                        <p><strong>Refund Amount:</strong> {formatCurrency(returnItem.refundAmount)}</p>
                      )}
                      {returnItem.processedDate && (
                        <p><strong>Processed Date:</strong> {formatDate(returnItem.processedDate)}</p>
                      )}
                      {returnItem.notes && (
                        <p><strong>Notes:</strong> {returnItem.notes}</p>
                      )}
                    </div>
                    <div className="return-items">
                      <h4>Returned Items:</h4>
                      {returnItem.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="returned-item">
                          <span>Product ID: {item.productId}</span>
                          <span>Quantity: {item.quantity}</span>
                          <span>Reason: {item.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;/ /   O r d e r   d e t a i l s  
 