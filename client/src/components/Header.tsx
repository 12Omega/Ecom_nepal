import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      // This API call will be captured by Burp Suite!
      const response = await axios.get(`/api/products/search?q=${query}`);
      setSearchResults(response.data.products || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '30px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🛍️ VulnShop
        </Link>

        {/* Search Bar */}
        <div style={{ 
          flex: 1, 
          maxWidth: '600px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="🔍 Search products... (Try: phone, laptop, shirt)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          />

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '60px',
              left: 0,
              right: 0,
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {searchResults.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1a202c' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      ${product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          gap: '25px',
          alignItems: 'center'
        }}>
          <Link to="/products" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'opacity 0.2s'
          }}>
            Products
          </Link>
          <Link to="/cart" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'opacity 0.2s'
          }}>
            🛒 Cart
          </Link>
        </nav>
      </div>

      {/* Click outside to close results */}
      {showResults && (
        <div 
          onClick={() => setShowResults(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </header>
  );
};

export default Header;