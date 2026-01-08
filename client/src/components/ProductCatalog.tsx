import React, { useState } from 'react';
import { useCart } from '../App';

// Extended product catalog for Nepal-themed e-commerce
const allProducts = [
  {
    id: '1',
    name: 'Traditional Nepali Khukuri',
    price: 89.99,
    image: '/api/placeholder/300/200',
    description: 'Authentic handcrafted Khukuri knife from Nepal. Perfect for collectors and outdoor enthusiasts.',
    category: 'Traditional'
  },
  {
    id: '2', 
    name: 'Himalayan Singing Bowl',
    price: 45.99,
    image: '/api/placeholder/300/200',
    description: 'Handmade singing bowl for meditation and sound therapy. Creates beautiful resonant tones.',
    category: 'Spiritual'
  },
  {
    id: '3',
    name: 'Pashmina Shawl',
    price: 129.99,
    image: '/api/placeholder/300/200',
    description: 'Luxurious cashmere pashmina from Nepal. Soft, warm, and elegantly crafted.',
    category: 'Fashion'
  },
  {
    id: '4',
    name: 'Prayer Flags Set',
    price: 24.99,
    image: '/api/placeholder/300/200',
    description: 'Colorful Tibetan prayer flags with traditional mantras. Bring peace and positive energy.',
    category: 'Spiritual'
  },
  {
    id: '5',
    name: 'Nepali Tea Collection',
    price: 34.99,
    image: '/api/placeholder/300/200',
    description: 'Premium tea collection from the hills of Nepal. Includes black, green, and herbal varieties.',
    category: 'Food'
  },
  {
    id: '6',
    name: 'Handwoven Dhaka Topi',
    price: 19.99,
    image: '/api/placeholder/300/200',
    description: 'Traditional Nepali cap made from handwoven Dhaka fabric. Cultural heritage wear.',
    category: 'Fashion'
  },
  {
    id: '7',
    name: 'Brass Buddha Statue',
    price: 67.99,
    image: '/api/placeholder/300/200',
    description: 'Beautiful brass Buddha statue for meditation and home decoration. Handcrafted in Nepal.',
    category: 'Spiritual'
  },
  {
    id: '8',
    name: 'Yak Wool Blanket',
    price: 156.99,
    image: '/api/placeholder/300/200',
    description: 'Warm and durable yak wool blanket from the Himalayas. Perfect for cold weather.',
    category: 'Home'
  },
  {
    id: '9',
    name: 'Nepali Spice Set',
    price: 28.99,
    image: '/api/placeholder/300/200',
    description: 'Authentic Nepali spices including timur, jimbu, and other traditional seasonings.',
    category: 'Food'
  }
];

const categories = ['All', 'Traditional', 'Spiritual', 'Fashion', 'Food', 'Home'];

const ProductCatalog: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>🛍️ Product Catalog</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Discover authentic Nepali products with secure Stripe checkout
        </p>
      </div>

      {/* Search and Filter */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        marginBottom: '30px',
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                background: selectedCategory === category ? '#0570de' : '#f0f0f0',
                color: selectedCategory === category ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ 
            background: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
          }}
          >
            <div style={{ 
              height: '200px', 
              background: `linear-gradient(45deg, #f0f0f0, #e0e0e0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              position: 'relative'
            }}>
              🇳🇵
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#0570de',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {product.category}
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>
                {product.name}
              </h3>
              <p style={{ 
                color: '#666', 
                margin: '0 0 15px 0', 
                fontSize: '14px',
                lineHeight: '1.4',
                height: '40px',
                overflow: 'hidden'
              }}>
                {product.description}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: '#0570de' 
                }}>
                  ${product.price}
                </span>
                <button
                  onClick={() => {
                    addToCart(product);
                    // Visual feedback
                    const button = document.activeElement as HTMLButtonElement;
                    if (button) {
                      const originalText = button.textContent;
                      button.textContent = '✅ Added!';
                      button.style.background = '#28a745';
                      setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = 'linear-gradient(135deg, #0570de 0%, #1a88ff 100%)';
                      }, 1000);
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #0570de 0%, #1a88ff 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
          <h3>No products found</h3>
          <p style={{ color: '#666' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Stripe Integration Notice */}
      <div style={{ 
        marginTop: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h3>💳 Secure Checkout Ready</h3>
        <p style={{ margin: '10px 0', opacity: 0.9 }}>
          Add items to your cart and checkout securely with Stripe payment processing
        </p>
      </div>
    </div>
  );
};

export default ProductCatalog;