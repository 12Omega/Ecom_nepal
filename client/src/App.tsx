import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import PaymentDemo from './components/PaymentDemo';
import StripeCheckout from './components/StripeCheckout';
import Auth from './components/Auth';
import './App.css';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  rating?: number;
  reviews?: number;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Navigation Component with animations
const Navigation: React.FC<{ 
  user: User | null, 
  onAuthClick: () => void, 
  onLogout: () => void,
  getTotalItems: () => number,
  getTotalPrice: () => number,
  onCheckout: () => void,
  cartItems: CartItem[]
}> = ({ user, onAuthClick, onLogout, getTotalItems, getTotalPrice, onCheckout, cartItems }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/cart', label: 'Cart', icon: '🛒' },
    { path: '/payment-demo', label: 'Payment Demo', icon: '💳' }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isScrolled 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: isScrolled ? '#1a202c' : 'white',
            fontSize: '1.5rem',
            fontWeight: '700',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ fontSize: '2rem' }}>🛍️</span>
          ModernShop
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '30px',
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }}>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isScrolled ? '#64748b' : 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                position: 'relative',
                background: location.pathname === item.path 
                  ? (isScrolled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255,255,255,0.2)')
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = isScrolled 
                    ? 'rgba(102, 126, 234, 0.05)' 
                    : 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.path === '/cart' && getTotalItems() > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  marginLeft: '5px',
                  animation: 'pulse 2s infinite'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px' 
        }}>
          {cartItems.length > 0 && (
            <button
              onClick={onCheckout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(67, 233, 123, 0.4)';
              }}
            >
              💳 Checkout ${getTotalPrice().toFixed(2)}
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                color: isScrolled ? '#64748b' : 'rgba(255,255,255,0.9)',
                fontSize: '0.9rem'
              }}>
                👋 {user.username}
              </span>
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  color: isScrolled ? '#64748b' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${isScrolled ? '#e2e8f0' : 'rgba(255,255,255,0.3)'}`,
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isScrolled 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              style={{
                background: isScrolled 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: isScrolled ? 'none' : '1px solid rgba(255,255,255,0.3)',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                boxShadow: isScrolled ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                if (isScrolled) {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                if (isScrolled) {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
              🔐 Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: isScrolled ? '#64748b' : 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              '@media (max-width: 768px)': {
                display: 'block'
              }
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '0 0 20px 20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '500',
                padding: '12px 16px',
                borderRadius: '12px',
                background: location.pathname === item.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing auth token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token with backend
      fetch('/api/auth/validate-session', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setUser(data.user);
        } else {
          localStorage.removeItem('authToken');
        }
      })
      .catch(() => {
        localStorage.removeItem('authToken');
      });
    }
  }, []);

  // Listen for checkout events from cart
  useEffect(() => {
    const handleCheckout = () => setShowCheckout(true);
    window.addEventListener('checkout', handleCheckout);
    return () => window.removeEventListener('checkout', handleCheckout);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Show success animation
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(67, 233, 123, 0.4);
      z-index: 10000;
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = `✅ ${product.name} added to cart!`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const handleCheckoutSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    clearCart();
    setShowCheckout(false);
    
    // Success animation
    const successModal = document.createElement('div');
    successModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    `;
    
    successModal.innerHTML = `
      <div style="
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        animation: scaleIn 0.3s ease-out;
      ">
        <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
        <h2 style="margin: 0 0 10px 0; color: #1a202c;">Payment Successful!</h2>
        <p style="color: #64748b; margin: 0 0 20px 0;">Your order has been confirmed and will be processed shortly.</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
        ">Continue Shopping</button>
      </div>
    `;
    
    document.body.appendChild(successModal);
  };

  const handleCheckoutError = (error: string) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error}`);
  };

  const cartContextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      body {
        margin: 0;
        padding-top: 80px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      
      * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  if (showCheckout && cartItems.length > 0) {
    return (
      <CartContext.Provider value={cartContextValue}>
        <div style={{ 
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '40px 20px'
        }}>
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '30px'
            }}>
              <h1 style={{ 
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.5rem',
                fontWeight: '700'
              }}>
                🛍️ Secure Checkout
              </h1>
              <button 
                onClick={() => setShowCheckout(false)}
                style={{
                  background: 'rgba(100, 116, 139, 0.1)',
                  color: '#64748b',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 116, 139, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 116, 139, 0.1)';
                }}
              >
                ← Back to Cart
              </button>
            </div>
            
            <StripeCheckout
              amount={getTotalPrice()}
              currency="usd"
              orderId={`order_${Date.now()}`}
              customerInfo={{
                email: user?.email || 'customer@example.com',
                name: user?.username || 'Customer Name',
                userId: user?.id || 'guest'
              }}
              onSuccess={handleCheckoutSuccess}
              onError={handleCheckoutError}
            />
          </div>
        </div>
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={cartContextValue}>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <Navigation
            user={user}
            onAuthClick={() => setShowAuth(true)}
            onLogout={handleLogout}
            getTotalItems={getTotalItems}
            getTotalPrice={getTotalPrice}
            onCheckout={() => setShowCheckout(true)}
            cartItems={cartItems}
          />
          
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductCatalog />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/payment-demo" element={<PaymentDemo />} />
            </Routes>
          </main>

          {/* Auth Modal */}
          {showAuth && (
            <Auth
              onAuthSuccess={handleAuthSuccess}
              onClose={() => setShowAuth(false)}
            />
          )}
        </div>
      </Router>
    </CartContext.Provider>
  );
}

export default App;