import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';
import ShoppingCart from './components/ShoppingCart';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import AdminPanel from './components/AdminPanel';
import AdminDashboard from './components/AdminDashboard';
import OrderDetail from './components/OrderDetail';
import OrderHistory from './components/OrderHistory';
import StripeDemoDashboard from './components/StripeDemoDashboard';
import Deals from './components/Deals';
import About from './components/About';
import Contact from './components/Contact';
import './App.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    updateCartCount();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = async () => {
    try {
      const response = await fetch('/api/cart/count');
      if (response.ok) {
        const data = await response.json();
        setCartItemCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    updateCartCount();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCartItemCount(0);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading VulnShop...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header 
          user={user} 
          cartItemCount={cartItemCount} 
          onLogout={handleLogout}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<ShoppingCart onCartUpdate={updateCartCount} />} />
            <Route 
              path="/orders" 
              element={
                user ? <OrderHistory /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/order/:orderId" 
              element={
                user ? <OrderDetail /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" /> : <Auth mode="login" onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/" /> : <Auth mode="register" onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/profile" 
              element={
                user ? <UserProfile /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/admin" 
              element={
                user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
              } 
            />
            <Route 
              path="/admin-old" 
              element={
                user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
              } 
            />
            <Route 
              path="/stripe-demo" 
              element={<StripeDemoDashboard />} 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<div className="not-found"><h2>Page Not Found</h2><p>The page you're looking for doesn't exist.</p></div>} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

// Simple placeholder components for additional pages
const AboutPage = () => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>About VulnShop</h1>
    <p>VulnShop is a modern ecommerce platform designed for security training and education.</p>
  </div>
);

const ContactPage = () => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Contact Us</h1>
    <p>Get in touch with our customer support team.</p>
    <p>📧 support@vulnshop.com | 📞 1-800-VULNSHOP</p>
  </div>
);

const HelpPage = () => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Help Center</h1>
    <p>Find answers to frequently asked questions and get support.</p>
  </div>
);

const DealsPage = () => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Special Deals</h1>
    <p>Check out our latest deals and discounts!</p>
  </div>
);

const TrackOrderPage = () => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Track Your Order</h1>
    <p>Enter your order number to track your shipment.</p>
  </div>
);

const OrdersPage = ({ user }: { user: User | null }) => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>My Orders</h1>
    {user ? (
      <p>View your order history and track current orders.</p>
    ) : (
      <p>Please log in to view your orders.</p>
    )}
  </div>
);

const WishlistPage = ({ user }: { user: User | null }) => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>My Wishlist</h1>
    {user ? (
      <p>Save your favorite items for later.</p>
    ) : (
      <p>Please log in to view your wishlist.</p>
    )}
  </div>
);

const NotFoundPage = () => (
  <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

export default App;