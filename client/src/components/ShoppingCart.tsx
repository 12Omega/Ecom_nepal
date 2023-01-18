import React, { useState, useEffect } from 'react';
import './ShoppingCart.css';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartProps {
  onCartUpdate: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onCartUpdate }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems(items =>
          items.map(item =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        onCartUpdate();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setCartItems(items => items.filter(item => item._id !== productId));
        onCartUpdate();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const applyCoupon = async () => {
    try {
      const response = await fetch('/api/cart/coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscount(data.discount || 0);
      } else {
        alert('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert('Error applying coupon');
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Navigate to checkout (you can implement this with react-router)
    window.location.href = '/checkout';
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  if (loading) {
    return (
      <div className="shopping-cart">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <a href="/products" className="btn btn-primary">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || '/api/placeholder/100/100'} 
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/100/100';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price}</p>
                </div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeItem(item._id)}
                  className="remove-btn"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="coupon-section">
                <h4>Coupon Code</h4>
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button onClick={applyCoupon} className="btn btn-secondary">
                    Apply
                  </button>
                </div>
              </div>

              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-line discount">
                  <span>Discount ({discount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-line shipping">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="summary-line total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button 
                onClick={proceedToCheckout}
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>
              
              <a href="/products" className="continue-shopping">
                ← Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;