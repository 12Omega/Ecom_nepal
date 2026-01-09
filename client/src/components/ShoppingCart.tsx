import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../App';

const ShoppingCart: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems 
  } = useCart();

  const [isVisible, setIsVisible] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemoveItem = (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price;
      return total + ((originalPrice - item.price) * item.quantity);
    }, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ 
        minHeight: '80vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '80px 60px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          transform: `translateY(${isVisible ? 0 : 30}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s ease-out'
        }}>
          <div style={{ 
            fontSize: '6rem', 
            marginBottom: '30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>
            🛒
          </div>
          <h2 style={{ 
            margin: '0 0 15px 0',
            fontSize: '2.2rem',
            color: '#1a202c',
            fontWeight: '700'
          }}>
            Your Cart is Empty
          </h2>
          <p style={{ 
            color: '#64748b', 
            marginBottom: '40px',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Looks like you haven't added any items to your cart yet. 
            Discover our amazing products and start shopping!
          </p>
          <Link 
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 35px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
          >
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      paddingTop: '40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '40px',
          transform: `translateY(${isVisible ? 0 : 30}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s ease-out'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            🛒 Shopping Cart
          </h1>
          <p style={{ 
            color: '#64748b',
            fontSize: '1.2rem',
            margin: 0
          }}>
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', 
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Cart Items */}
          <div style={{
            transform: `translateY(${isVisible ? 0 : 30}px)`,
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s ease-out 0.2s'
          }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              {cartItems.map((item, index) => (
                <div 
                  key={item.id}
                  style={{
                    opacity: removingItems.has(item.id) ? 0 : 1,
                    transform: removingItems.has(item.id) ? 'translateX(-100%)' : 'translateX(0)',
                    transition: 'all 0.3s ease-out'
                  }}
                >
                  <div style={{ 
                    padding: '25px',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    {/* Product Image */}
                    <div style={{ 
                      width: '120px',
                      height: '120px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      {item.badge && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {item.badge}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {item.category}
                        </span>
                      </div>
                      <h3 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        color: '#1a202c',
                        lineHeight: '1.3'
                      }}>
                        {item.name}
                      </h3>
                      <p style={{ 
                        color: '#64748b', 
                        margin: '0 0 12px 0', 
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.description}
                      </p>
                      
                      {/* Rating */}
                      {item.rating && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ color: '#fbbf24', fontSize: '14px' }}>
                            {'★'.repeat(Math.floor(item.rating))}
                            {'☆'.repeat(5 - Math.floor(item.rating))}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {item.rating} ({item.reviews} reviews)
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontSize: '1.4rem', 
                          fontWeight: '700', 
                          color: '#1a202c'
                        }}>
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span style={{ 
                            fontSize: '1rem', 
                            color: '#94a3b8',
                            textDecoration: 'line-through'
                          }}>
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span style={{ 
                          fontSize: '0.8rem', 
                          color: '#64748b' 
                        }}>
                          each
                        </span>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'flex-end',
                      gap: '15px'
                    }}>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '8px',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ef4444';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title="Remove item"
                      >
                        🗑️
                      </button>

                      {/* Quantity Controls */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        background: '#f8fafc',
                        padding: '8px 12px',
                        borderRadius: '25px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: 'none',
                            background: 'white',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#64748b',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#667eea';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          −
                        </button>
                        <span style={{ 
                          minWidth: '30px', 
                          textAlign: 'center',
                          fontWeight: '600',
                          fontSize: '1.1rem',
                          color: '#1a202c'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: 'none',
                            background: 'white',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#64748b',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#667eea';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '1.3rem', 
                          fontWeight: '700', 
                          color: '#667eea'
                        }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < cartItems.length - 1 && (
                    <div style={{ 
                      height: '1px', 
                      background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)', 
                      margin: '0 25px' 
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* Cart Actions */}
            <div style={{ 
              marginTop: '30px',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '15px 25px',
                  background: 'white',
                  color: '#64748b',
                  textDecoration: 'none',
                  borderRadius: '25px',
                  fontWeight: '600',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '15px 25px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '2px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🗑️ Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            transform: `translateY(${isVisible ? 0 : 30}px)`,
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s ease-out 0.4s'
          }}>
            <div style={{ 
              background: 'white', 
              padding: '35px', 
              borderRadius: '20px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: '100px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ 
                margin: '0 0 25px 0',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Order Summary
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '12px',
                  fontSize: '1rem'
                }}>
                  <span>Subtotal ({getTotalItems()} items):</span>
                  <span style={{ fontWeight: '600' }}>
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                
                {calculateSavings() > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '12px',
                    color: '#059669',
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}>
                    <span>You save:</span>
                    <span>-${calculateSavings().toFixed(2)}</span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '12px',
                  color: '#64748b',
                  fontSize: '0.95rem'
                }}>
                  <span>Shipping:</span>
                  <span style={{ color: '#059669', fontWeight: '600' }}>
                    Free 🚚
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '12px',
                  color: '#64748b',
                  fontSize: '0.95rem'
                }}>
                  <span>Tax:</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div style={{ 
                borderTop: '2px solid #f1f5f9', 
                paddingTop: '20px',
                marginBottom: '25px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '1.3rem',
                  fontWeight: '700'
                }}>
                  <span>Total:</span>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('checkout'));
                }}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  boxShadow: '0 8px 25px rgba(67, 233, 123, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(67, 233, 123, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.4)';
                }}
              >
                💳 Proceed to Checkout
              </button>

              <div style={{ 
                textAlign: 'center',
                fontSize: '0.85rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}>
                🔒 Secure checkout powered by Stripe
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '20px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              marginTop: '20px',
              textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '1.1rem',
                color: '#1a202c',
                fontWeight: '600'
              }}>
                We Accept
              </h4>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
                marginBottom: '15px'
              }}>
                {['💳', '💰', '🏦', '📱'].map((icon, index) => (
                  <div 
                    key={index}
                    style={{
                      background: '#f8fafc',
                      padding: '15px',
                      borderRadius: '12px',
                      fontSize: '2rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#667eea';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '0.85rem', 
                color: '#64748b' 
              }}>
                Visa, Mastercard, American Express, PayPal, and more
              </p>
            </div>

            {/* Trust Badges */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '25px', 
              borderRadius: '20px', 
              marginTop: '20px',
              textAlign: 'center',
              color: 'white'
            }}>
              <h4 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Shop with Confidence
              </h4>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: '0.8rem'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔒</div>
                  <div>Secure</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🚚</div>
                  <div>Fast Ship</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>↩️</div>
                  <div>Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;