import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrderHistory.css';

interface OrderSummary {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  placedAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  items: Array<{
    productName: string;
    productImage: string;
    quantity: number;
  }>;
}

interface FilterOptions {
  status: string;
  dateRange: string;
  sortBy: string;
  searchTerm: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    dateRange: 'all',
    sortBy: 'newest',
    searchTerm: ''
  });

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders/history');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'last_week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last_month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'last_3_months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'last_year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(order => new Date(order.placedAt) >= filterDate);
      }
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.productName.toLowerCase().includes(searchLower))
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime();
        case 'oldest':
          return new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime();
        case 'amount_high':
          return b.totalAmount - a.totalAmount;
        case 'amount_low':
          return a.totalAmount - b.totalAmount;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusDisplayName = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const reorderItems = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Items added to cart successfully!');
      } else {
        alert('Failed to reorder items');
      }
    } catch (error) {
      console.error('Error reordering items:', error);
      alert('Error reordering items');
    }
  };

  const trackOrder = (trackingNumber: string) => {
    if (trackingNumber) {
      window.open(`https://tracking.example.com/${trackingNumber}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="order-history">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="container">
        <div className="page-header">
          <h1>Order History</h1>
          <p>Track and manage all your orders</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Search Orders:</label>
              <input
                type="text"
                placeholder="Order number or product name..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range:</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="last_year">Last Year</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Highest Amount</option>
                <option value="amount_low">Lowest Amount</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            <span>{filteredOrders.length} orders found</span>
            {filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm ? (
              <button 
                onClick={() => setFilters({status: 'all', dateRange: 'all', sortBy: 'newest', searchTerm: ''})}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h3>No orders found</h3>
              <p>
                {filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm
                  ? 'Try adjusting your filters to see more orders.'
                  : "You haven't placed any orders yet."
                }
              </p>
              {!filters.status && !filters.dateRange && !filters.searchTerm && (
                <Link to="/products" className="btn btn-primary">
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>
                      <Link to={`/order/${order._id}`}>
                        Order #{order.orderNumber}
                      </Link>
                    </h3>
                    <div className="order-meta">
                      <span className="order-date">
                        Placed on {formatDate(order.placedAt)}
                      </span>
                      <span 
                        className="order-status"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusDisplayName(order.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    <div className="items-preview">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="item-preview">
                          <img 
                            src={item.productImage || '/api/placeholder/60/60'} 
                            alt={item.productName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/api/placeholder/60/60';
                            }}
                          />
                          <div className="item-info">
                            <span className="item-name">{item.productName}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="more-items">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="detail-item">
                      <span className="detail-label">Items:</span>
                      <span className="detail-value">{order.itemCount}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="detail-item">
                        <span className="detail-label">Est. Delivery:</span>
                        <span className="detail-value">{formatDate(order.estimatedDelivery)}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="detail-item">
                        <span className="detail-label">Tracking:</span>
                        <span className="detail-value tracking-number">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-actions">
                  <Link to={`/order/${order._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                  
                  {order.trackingNumber && (
                    <button 
                      onClick={() => trackOrder(order.trackingNumber)}
                      className="btn btn-secondary"
                    >
                      Track Package
                    </button>
                  )}
                  
                  <button 
                    onClick={() => reorderItems(order._id)}
                    className="btn btn-outline"
                  >
                    Reorder
                  </button>

                  {order.status === 'delivered' && (
                    <Link to={`/order/${order._id}/review`} className="btn btn-outline">
                      Write Review
                    </Link>
                  )}

                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button className="btn btn-danger-outline">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 10 && (
          <div className="pagination">
            <button className="pagination-btn">← Previous</button>
            <div className="pagination-info">Page 1 of 1</div>
            <button className="pagination-btn">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;/ /   O r d e r   h i s t o r y  
 