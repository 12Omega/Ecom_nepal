import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageUrl?: string;
  category: string;
  rating: number;
  reviews: number;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8');
      const data = await response.json();
      setFeaturedProducts(data.products || data || []); // Handle different response formats
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to NepalShop</h1>
            <p>Discover authentic Nepalese products from the heart of the Himalayas. Shop traditional handicrafts, organic foods, and cultural treasures with confidence.</p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-large">
                Shop Nepal Products
              </Link>
              <Link to="/deals" className="btn btn-secondary btn-large">
                View Deals
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" alt="Nepal Shopping" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Your payment information is safe with us</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy on all items</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Customer support available around the clock</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/category/clothing" className="category-card">
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" alt="Traditional Clothing" />
              <div className="category-overlay">
                <h3>Traditional Clothing</h3>
                <p>Dhaka Topi, Pashmina & More</p>
              </div>
            </Link>
            <Link to="/category/handicrafts" className="category-card">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Handicrafts" />
              <div className="category-overlay">
                <h3>Handicrafts</h3>
                <p>Singing Bowls & Artifacts</p>
              </div>
            </Link>
            <Link to="/category/food" className="category-card">
              <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop" alt="Nepalese Food" />
              <div className="category-overlay">
                <h3>Nepalese Food</h3>
                <p>Tea, Honey & Spices</p>
              </div>
            </Link>
            <Link to="/category/jewelry" className="category-card">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop" alt="Jewelry" />
              <div className="category-overlay">
                <h3>Jewelry & Accessories</h3>
                <p>Silver & Sacred Items</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all-link">View All Products →</Link>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=250&fit=crop'} 
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=250&fit=crop';
                      }}
                    />
                    <div className="product-overlay">
                      <Link to={`/product/${product._id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-rating">
                      <span className="stars">
                        {'★'.repeat(Math.floor(product.rating || 4))}
                        {'☆'.repeat(5 - Math.floor(product.rating || 4))}
                      </span>
                      <span className="reviews">({product.reviews || 0} reviews)</span>
                    </div>
                    <div className="product-price">
                      <span className="price">${product.price}</span>
                      <button className="add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter and get exclusive deals and updates!</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;