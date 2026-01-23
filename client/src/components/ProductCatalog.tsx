import React, { useState, useEffect } from 'react';
import { useCart } from '../App';
import axios from 'axios';

// Diverse product catalog with real images from Unsplash
const allProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear sound quality.',
    category: 'Electronics',
    rating: 4.8,
    reviews: 1247,
    badge: 'Best Seller',
    inStock: true
  },
  {
    id: '2', 
    name: 'Organic Cotton T-Shirt',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    description: 'Soft, sustainable organic cotton t-shirt available in multiple colors. Perfect for everyday wear.',
    category: 'Fashion',
    rating: 4.6,
    reviews: 892,
    badge: 'Eco-Friendly',
    inStock: true
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life.',
    category: 'Electronics',
    rating: 4.9,
    reviews: 2156,
    badge: 'New Arrival',
    inStock: true
  },
  {
    id: '4',
    name: 'Artisan Coffee Beans',
    price: 18.99,
    originalPrice: 22.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    description: 'Single-origin Ethiopian coffee beans, freshly roasted with notes of chocolate and citrus.',
    category: 'Food & Beverage',
    rating: 4.7,
    reviews: 634,
    badge: 'Limited Edition',
    inStock: true
  },
  {
    id: '5',
    name: 'Minimalist Desk Lamp',
    price: 45.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    description: 'Modern LED desk lamp with adjustable brightness, USB charging port, and sleek design.',
    category: 'Home & Office',
    rating: 4.5,
    reviews: 423,
    badge: 'Editor\'s Choice',
    inStock: true
  },
  {
    id: '6',
    name: 'Leather Crossbody Bag',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    description: 'Handcrafted genuine leather bag with multiple compartments and adjustable strap.',
    category: 'Fashion',
    rating: 4.8,
    reviews: 756,
    badge: 'Handmade',
    inStock: true
  },
  {
    id: '7',
    name: 'Yoga Mat Premium',
    price: 39.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    description: 'Non-slip premium yoga mat with alignment lines and carrying strap included.',
    category: 'Sports & Fitness',
    rating: 4.6,
    reviews: 1089,
    badge: 'Popular',
    inStock: true
  },
  {
    id: '8',
    name: 'Ceramic Plant Pot Set',
    price: 32.99,
    originalPrice: 42.99,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
    description: 'Set of 3 modern ceramic plant pots with drainage holes and saucers.',
    category: 'Home & Office',
    rating: 4.4,
    reviews: 567,
    badge: 'Set of 3',
    inStock: true
  },
  {
    id: '9',
    name: 'Wireless Phone Charger',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'Electronics',
    rating: 4.3,
    reviews: 892,
    badge: 'Fast Charging',
    inStock: true
  },
  {
    id: '10',
    name: 'Scented Candle Collection',
    price: 34.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1602874801006-e26d3d17d0a5?w=400&h=300&fit=crop',
    description: 'Set of 4 luxury scented candles with natural soy wax and essential oils.',
    category: 'Home & Office',
    rating: 4.7,
    reviews: 445,
    badge: 'Luxury Set',
    inStock: true
  },
  {
    id: '11',
    name: 'Running Shoes',
    price: 89.99,
    originalPrice: 109.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
    category: 'Sports & Fitness',
    rating: 4.5,
    reviews: 1234,
    badge: 'Athletic',
    inStock: true
  },
  {
    id: '12',
    name: 'Stainless Steel Water Bottle',
    price: 22.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24h or hot for 12h.',
    category: 'Sports & Fitness',
    rating: 4.8,
    reviews: 2341,
    badge: 'Insulated',
    inStock: true
  }
];

const categories = [
  { name: 'All', icon: '🌟', count: allProducts.length },
  { name: 'Electronics', icon: '📱', count: allProducts.filter(p => p.category === 'Electronics').length },
  { name: 'Fashion', icon: '👕', count: allProducts.filter(p => p.category === 'Fashion').length },
  { name: 'Home & Office', icon: '🏠', count: allProducts.filter(p => p.category === 'Home & Office').length },
  { name: 'Food & Beverage', icon: '☕', count: allProducts.filter(p => p.category === 'Food & Beverage').length },
  { name: 'Sports & Fitness', icon: '🏃‍♂️', count: allProducts.filter(p => p.category === 'Sports & Fitness').length }
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' }
];

const ProductCatalog: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [apiSearchResults, setApiSearchResults] = useState<any[]>([]);
  const [useApiSearch, setUseApiSearch] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // API Search function - calls backend directly
  const handleApiSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setUseApiSearch(true);

    try {
      // Direct API call to backend - will be captured by Burp Suite!
      const response = await axios.get(`http://localhost:5000/api/products/search?q=${searchTerm}`);
      setApiSearchResults(response.data.products || []);
      setIsLoading(false);
    } catch (error) {
      console.error('API Search error:', error);
      alert('Search failed. Please try again.');
      setIsLoading(false);
      setUseApiSearch(false);
    }
  };

  // Clear API search and return to normal view
  const clearApiSearch = () => {
    setUseApiSearch(false);
    setApiSearchResults([]);
    setSearchTerm('');
  };

  const filteredAndSortedProducts = () => {
    // If using API search, return API results
    if (useApiSearch) {
      return apiSearchResults;
    }

    // Otherwise, use client-side filtering
    let filtered = allProducts.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  };

  const products = filteredAndSortedProducts();

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <h2 style={{ color: '#64748b', margin: 0 }}>Loading Products...</h2>
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            margin: '0 0 15px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            🛍️ Product Catalog
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Discover amazing products with secure checkout and fast delivery
          </p>
        </div>

        {/* Filters and Search */}
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleApiSearch();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '25px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleApiSearch}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                Search
              </button>
              {useApiSearch && (
                <button
                  onClick={clearApiSearch}
                  style={{
                    padding: '15px 25px',
                    background: '#f44',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
            {useApiSearch && (
              <div style={{
                textAlign: 'center',
                marginTop: '15px',
                padding: '10px',
                background: '#f0fdf4',
                borderRadius: '10px',
                color: '#166534',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ✅ Showing results for "{searchTerm}"
              </div>
            )}
          </div>

          {/* Category Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '25px'
          }}>
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '25px',
                  background: selectedCategory === category.name 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f1f5f9',
                  color: selectedCategory === category.name ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === category.name 
                    ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.name) {
                    e.currentTarget.style.background = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.name) {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span>{category.icon}</span>
                {category.name}
                <span style={{
                  background: selectedCategory === category.name 
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(100, 116, 139, 0.2)',
                  color: selectedCategory === category.name ? 'white' : '#64748b',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ color: '#64748b', fontWeight: '500' }}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#64748b', fontWeight: '500' }}>
                {products.length} products found
              </span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'grid' ? '#667eea' : '#f1f5f9',
                    color: viewMode === 'grid' ? 'white' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'list' ? '#667eea' : '#f1f5f9',
                    color: viewMode === 'list' ? 'white' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: viewMode === 'grid' 
            ? 'repeat(auto-fill, minmax(350px, 1fr))' 
            : '1fr',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {products.map((product, index) => (
            <div 
              key={product.id} 
              style={{ 
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                display: viewMode === 'list' ? 'flex' : 'block',
                opacity: 0,
                transform: 'translateY(30px)',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
              }}
            >
              {/* Product Badge */}
              {product.badge && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  zIndex: 2,
                  boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)'
                }}>
                  {product.badge}
                </div>
              )}
              
              {/* Product Image */}
              <div style={{ 
                position: 'relative',
                height: viewMode === 'list' ? '200px' : '280px',
                width: viewMode === 'list' ? '300px' : '100%',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img 
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                
                {/* Quick Actions */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <button style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    fontSize: '18px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = '#ff6b6b';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                    e.currentTarget.style.color = 'inherit';
                  }}
                  >
                    ❤️
                  </button>
                  <button style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    fontSize: '18px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = '#4facfe';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                    e.currentTarget.style.color = 'inherit';
                  }}
                  >
                    👁️
                  </button>
                </div>
              </div>
              
              {/* Product Info */}
              <div style={{ 
                padding: '25px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {product.category}
                  </span>
                </div>
                
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  lineHeight: '1.3'
                }}>
                  {product.name}
                </h3>
                
                <p style={{ 
                  color: '#64748b', 
                  margin: '0 0 15px 0', 
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  flex: 1
                }}>
                  {product.description}
                </p>
                
                {/* Rating */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '15px'
                }}>
                  <div style={{ color: '#fbbf24', fontSize: '16px' }}>
                    {'★'.repeat(Math.floor(product.rating || 0))}
                    {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                
                {/* Price and Add to Cart */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: 'auto'
                }}>
                  <div>
                    <span style={{ 
                      fontSize: '1.6rem', 
                      fontWeight: '700', 
                      color: '#1a202c'
                    }}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span style={{ 
                        fontSize: '1rem', 
                        color: '#94a3b8',
                        textDecoration: 'line-through',
                        marginLeft: '8px'
                      }}>
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product);
                      // Visual feedback
                      const button = document.activeElement as HTMLButtonElement;
                      if (button) {
                        const originalText = button.innerHTML;
                        button.innerHTML = '✅ Added!';
                        button.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
                        setTimeout(() => {
                          button.innerHTML = originalText;
                          button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }, 1500);
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
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
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Found */}
        {products.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ 
              fontSize: '2rem',
              margin: '0 0 10px 0',
              color: '#1a202c'
            }}>
              No products found
            </h3>
            <p style={{ 
              color: '#64748b',
              fontSize: '1.1rem',
              marginBottom: '30px'
            }}>
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setPriceRange([0, 300]);
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Trust Badges */}
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          marginTop: '50px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 30px 0',
            fontSize: '1.8rem',
            color: '#1a202c'
          }}>
            Shop with Confidence
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted checkout' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help' }
            ].map((badge, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                  {badge.icon}
                </div>
                <h4 style={{ 
                  margin: '0 0 8px 0',
                  color: '#1a202c',
                  fontSize: '1.1rem'
                }}>
                  {badge.title}
                </h4>
                <p style={{ 
                  color: '#64748b',
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCatalog;