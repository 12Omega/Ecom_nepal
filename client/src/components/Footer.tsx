import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      color: 'white',
      padding: '60px 20px 20px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 1024 
            ? 'repeat(5, 1fr)' 
            : window.innerWidth > 768 
            ? 'repeat(3, 1fr)' 
            : '1fr',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Company Info */}
          <div style={{ gridColumn: window.innerWidth > 1024 ? 'span 2' : 'span 1' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '2rem' }}>🛍️</span>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                margin: 0
              }}>
                ModernShop
              </h3>
            </div>
            <p style={{
              color: '#a0aec0',
              lineHeight: '1.6',
              marginBottom: '25px',
              maxWidth: '300px'
            }}>
              Your trusted partner in bringing the finest products from Nepal and around the world to your doorstep. 
              Quality, authenticity, and customer satisfaction guaranteed.
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '25px'
            }}>
              {[
                { icon: '📘', name: 'Facebook', url: '#' },
                { icon: '📷', name: 'Instagram', url: '#' },
                { icon: '🐦', name: 'Twitter', url: '#' },
                { icon: '💼', name: 'LinkedIn', url: '#' },
                { icon: '📺', name: 'YouTube', url: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#a0aec0',
              fontSize: '0.9rem'
            }}>
              <span>🏆</span>
              <span>Trusted by 50,000+ customers worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#e2e8f0'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Locations', path: '/locations' },
                { name: 'FAQ', path: '/faq' }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    to={link.path}
                    style={{
                      color: '#a0aec0',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#a0aec0';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#e2e8f0'
            }}>
              Customer Service
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { name: 'Help Center', path: '/faq' },
                { name: 'Shipping Info', path: '/shipping' },
                { name: 'Returns & Exchanges', path: '/returns' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'Track Your Order', path: '/track-order' },
                { name: 'Gift Cards', path: '/gift-cards' }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    to={link.path}
                    style={{
                      color: '#a0aec0',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#a0aec0';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#e2e8f0'
            }}>
              Legal
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' },
                { name: 'Accessibility', path: '/accessibility' },
                { name: 'Security', path: '/security' },
                { name: 'Careers', path: '/careers' }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    to={link.path}
                    style={{
                      color: '#a0aec0',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#a0aec0';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#e2e8f0'
            }}>
              Get in Touch
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#a0aec0',
                fontSize: '0.95rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <span>Thamel, Kathmandu 44600, Nepal</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#a0aec0',
                fontSize: '0.95rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>📞</span>
                <span>+977-1-4441234</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#a0aec0',
                fontSize: '0.95rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>📧</span>
                <span>hello@modernshop.com</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#a0aec0',
                fontSize: '0.95rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🕒</span>
                <span>Mon-Fri: 9AM-6PM NST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#e2e8f0'
          }}>
            Stay Updated
          </h3>
          <p style={{
            color: '#a0aec0',
            marginBottom: '25px',
            maxWidth: '500px',
            margin: '0 auto 25px auto'
          }}>
            Subscribe to our newsletter for exclusive deals, new product launches, and insider updates.
          </p>
          <div style={{
            display: 'flex',
            maxWidth: '400px',
            margin: '0 auto',
            gap: '10px',
            flexDirection: window.innerWidth > 480 ? 'row' : 'column'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '25px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            />
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}>
              Subscribe
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          marginBottom: '40px',
          padding: '30px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px'
        }}>
          {[
            { icon: '🔒', text: 'SSL Secured' },
            { icon: '💳', text: 'PCI Compliant' },
            { icon: '🚚', text: 'Free Shipping' },
            { icon: '↩️', text: '30-Day Returns' },
            { icon: '🏆', text: 'Quality Guaranteed' },
            { icon: '🌍', text: 'Worldwide Shipping' }
          ].map((badge, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a0aec0',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            color: '#a0aec0',
            fontSize: '0.9rem'
          }}>
            © 2026 ModernShop. All rights reserved. Made with ❤️ in Nepal.
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{
                color: '#a0aec0',
                fontSize: '0.9rem'
              }}>
                We accept:
              </span>
              {['💳', '🏦', '📱', '💰'].map((payment, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '1.5rem',
                    opacity: 0.7,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                  }}
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;