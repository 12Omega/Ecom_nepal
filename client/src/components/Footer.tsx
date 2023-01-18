import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>NepalShop</h3>
              <p>Your trusted source for authentic Nepalese products from the heart of the Himalayas. Supporting local artisans and preserving cultural heritage.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="LinkedIn">💼</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/deals">Deals</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Categories</h4>
              <ul>
                <li><Link to="/products?category=clothing">Traditional Clothing</Link></li>
                <li><Link to="/products?category=handicrafts">Handicrafts</Link></li>
                <li><Link to="/products?category=food">Food & Spices</Link></li>
                <li><Link to="/products?category=jewelry">Jewelry</Link></li>
                <li><Link to="/products?category=art">Art & Culture</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/track-order">Track Your Order</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/size-guide">Size Guide</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Account</h4>
              <ul>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Create Account</Link></li>
                <li><Link to="/profile">My Account</Link></li>
                <li><Link to="/orders">Order History</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Newsletter</h4>
              <p>Subscribe to get updates on new products and exclusive deals!</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
              <div className="payment-methods">
                <span>We Accept:</span>
                <div className="payment-icons">
                  <span>💳</span>
                  <span>🏦</span>
                  <span>💰</span>
                  <span>📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; 2024 NepalShop. All rights reserved. Made with ❤️ in Nepal 🇳🇵</p>
            </div>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
              <Link to="/security">Security</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;