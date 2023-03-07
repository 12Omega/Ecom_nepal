import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ProductCatalog.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageUrl?: string;
  category: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  originalPrice?: number;
}

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Get initial values from URL params
    const search = searchParams.get('search') || '';
    const cat = searchParams.get('category') || '';
    setSearchTerm(search);
    setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/api/products';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      if (sortBy) params.append('sort', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'clothing', label: 'Traditional Clothing' },
    { value: 'handicrafts', label: 'Handicrafts' },
    { value: 'food', label: 'Food & Spices' },
    { value: 'jewelry', label: 'Jewelry & Accessories' },
    { value: 'art', label: 'Art & Culture' },
    { value: 'home', label: 'Home & Decor' },
    { value: 'books', label: 'Books & Literature' },
    { value: 'instruments', label: 'Musical Instruments' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'beverages', label: 'Beverages' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: '-name', label: 'Name Z-A' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating', label: 'Highest Rated' },
    { value: '-createdAt', label: 'Newest First' },
  ];

  if (loading) {
    return (
      <div className="product-catalog">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h1>Product Catalog</h1>
        <p>Discover our amazing collection of products</p>
      </div>

      <div className="catalog-controls">
        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>

          <div className="filter-controls">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-info">
          <p>{products.length} products found</p>
        </div>
      </div>

      <div className="catalog-content">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'} 
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop';
                  }}
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="discount-badge">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
                {!product.inStock && (
                  <div className="out-of-stock-badge">Out of Stock</div>
                )}
              </div>
              
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">
                  <Link to={`/product/${product._id}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-rating">
                  <span className="stars">
                    {'★'.repeat(Math.floor(product.rating || 4))}
                    {'☆'.repeat(5 - Math.floor(product.rating || 4))}
                  </span>
                  <span className="rating-text">
                    ({product.rating || 4.0}) • {product.reviews || 0} reviews
                  </span>
                </div>

                <div className="product-price">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="original-price">${product.originalPrice}</span>
                  )}
                  <span className="current-price">${product.price}</span>
                </div>

                <div className="product-actions">
                  <button 
                    onClick={() => addToCart(product._id)}
                    className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                  </button>
                  <Link to={`/product/${product._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No products found</h3>
            <p>Try adjusting your search criteria or browse different categories.</p>
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;/ /   P r o d u c t   c a t a l o g   U I  
 