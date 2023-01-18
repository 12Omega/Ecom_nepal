import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface HeaderProps {
  user: User | null;
  cartItemCount: number;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, cartItemCount, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="header-contact">
              <span>📞 1-800-VULNSHOP</span>
              <span>📧 support@vulnshop.com</span>
            </div>
            <div className="header-links">
              <Link to="/help">Help</Link>
              <Link to="/track-order">Track Order</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="admin-link">Admin Panel</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>🇳🇵 NepalShop</h1>
              <span>Authentic Himalayan Products</span>
            </Link>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </form>

            <div className="header-actions">
              {user ? (
                <div className="user-menu">
                  <button 
                    className="user-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    👤 {user.username}
                  </button>
                  {isMenuOpen && (
                    <div className="user-dropdown">
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                        My Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                        Wishlist
                      </Link>
                      <button onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="btn btn-secondary">Login</Link>
                  <Link to="/register" className="btn btn-primary">Sign Up</Link>
                </div>
              )}

              <Link to="/cart" className="cart-link">
                🛒 Cart
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="header-nav">
        <div className="container">
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/category/clothing">Traditional Clothing</Link></li>
            <li><Link to="/category/handicrafts">Handicrafts</Link></li>
            <li><Link to="/category/food">Food & Spices</Link></li>
            <li><Link to="/category/jewelry">Jewelry</Link></li>
            <li><Link to="/category/art">Art & Culture</Link></li>
            <li><Link to="/deals">Deals</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;