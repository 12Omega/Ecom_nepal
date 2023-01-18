import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryPage.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  featured: boolean;
  tags: string[];
  origin: string;
  rating?: number;
  reviews?: number;
}

interface CategoryInfo {
  name: string;
  description: string;
  heroImage: string;
  features: string[];
  story: string;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  const categoryInfo: { [key: string]: CategoryInfo } = {
    clothing: {
      name: 'Traditional Clothing',
      description: 'Authentic Nepalese garments crafted with traditional techniques and premium materials',
      heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      features: [
        'Handwoven fabrics using traditional looms',
        'Natural dyes and eco-friendly materials',
        'Designs passed down through generations',
        'Perfect for festivals and special occasions'
      ],
      story: 'Nepal\'s traditional clothing reflects the rich cultural diversity of its many ethnic groups. From the iconic Dhaka Topi worn by men to the elegant Gunyu Cholo of Newari women, each garment tells a story of heritage, craftsmanship, and cultural identity.'
    },
    handicrafts: {
      name: 'Handicrafts',
      description: 'Exquisite handcrafted items made by skilled artisans using time-honored techniques',
      heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      features: [
        'Made by master craftsmen with decades of experience',
        'Traditional tools and techniques preserved',
        'Each piece is unique and one-of-a-kind',
        'Supports local artisan communities'
      ],
      story: 'Nepal\'s handicraft tradition spans centuries, with techniques passed down through generations. From the meditative art of creating singing bowls to the precise craftsmanship of khukuri knives, each piece represents the soul of Nepalese artistry.'
    },
    food: {
      name: 'Food & Spices',
      description: 'Premium organic foods and spices from the pristine mountains and valleys of Nepal',
      heroImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=400&fit=crop',
      features: [
        'Grown in pristine mountain environments',
        '100% organic and naturally processed',
        'Rich in nutrients and authentic flavors',
        'Directly sourced from local farmers'
      ],
      story: 'Nepal\'s diverse geography creates unique microclimates perfect for growing exceptional teas, spices, and specialty foods. From the high-altitude tea gardens of Ilam to the honey hunters of the Himalayas, each product captures the essence of Nepal\'s natural bounty.'
    },
    jewelry: {
      name: 'Jewelry & Accessories',
      description: 'Beautiful handcrafted jewelry and accessories with spiritual and cultural significance',
      heroImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop',
      features: [
        'Handcrafted by skilled Newari artisans',
        'Traditional designs with spiritual meaning',
        'Premium materials including silver and sacred beads',
        'Perfect for meditation and daily wear'
      ],
      story: 'Nepalese jewelry combines artistic beauty with spiritual significance. From intricate silver filigree work of the Newars to sacred rudraksha malas, each piece serves both as adornment and as a connection to Nepal\'s rich spiritual traditions.'
    },
    art: {
      name: 'Art & Culture',
      description: 'Sacred art and cultural artifacts that embody Nepal\'s spiritual and artistic heritage',
      heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      features: [
        'Hand-painted by master artists',
        'Traditional Buddhist and Hindu themes',
        'Blessed by monks and spiritual teachers',
        'Museum-quality craftsmanship'
      ],
      story: 'Nepal\'s artistic tradition is deeply rooted in spirituality and devotion. Thangka paintings, created with meticulous attention to detail and spiritual intention, serve as windows into the divine and tools for meditation and contemplation.'
    }
  };

  useEffect(() => {
    if (category) {
      fetchCategoryProducts();
    }
  }, [category, sortBy]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?category=${category}&sort=${sortBy}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data || []);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
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

  if (!category || !categoryInfo[category]) {
    return (
      <div className="category-page">
        <div className="error-message">
          <h2>Category not found</h2>
          <Link to="/products" className="btn btn-primary">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const info = categoryInfo[category];

  return (
    <div className="category-page">
      {/* Hero Section */}
      <section className="category-hero">
        <div className="hero-image">
          <img src={info.heroImage} alt={info.name} />
          <div className="hero-overlay">
            <div className="hero-content">
              <nav className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/products">Products</Link>
                <span>/</span>
                <span>{info.name}</span>
              </nav>
              <h1>{info.name}</h1>
              <p>{info.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Category Info */}
        <section className="category-info">
          <div className="info-content">
            <div className="info-text">
              <h2>About {info.name}</h2>
              <p>{info.story}</p>
              
              <h3>Key Features</h3>
              <ul className="features-list">
                {info.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="info-stats">
              <div className="stat-item">
                <div className="stat-number">{products.length}</div>
                <div className="stat-label">Products Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Authentic</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Artisans</div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="category-products">
          <div className="products-header">
            <h2>Our {info.name} Collection</h2>
            <div className="products-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="-name">Name (Z-A)</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-featured">Featured First</option>
                <option value="-createdAt">Newest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading {info.name.toLowerCase()}...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <h3>No products found in this category</h3>
              <p>Check back soon for new additions to our {info.name.toLowerCase()} collection.</p>
              <Link to="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'} 
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop';
                      }}
                    />
                    {product.featured && (
                      <div className="featured-badge">Featured</div>
                    )}
                    {product.stock === 0 && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3>
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-meta">
                      <span className="product-origin">📍 {product.origin}</span>
                      {product.tags && product.tags.length > 0 && (
                        <div className="product-tags">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="product-rating">
                      <div className="stars">
                        {'★'.repeat(Math.floor(product.rating || 4))}
                        {'☆'.repeat(5 - Math.floor(product.rating || 4))}
                      </div>
                      <span className="reviews">({product.reviews || 0} reviews)</span>
                    </div>
                    
                    <div className="product-footer">
                      <div className="product-price">
                        <span className="price">${product.price}</span>
                      </div>
                      <div className="product-actions">
                        <button 
                          onClick={() => addToCart(product._id)}
                          className="btn btn-primary"
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <Link to={`/product/${product._id}`} className="btn btn-secondary">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Categories */}
        <section className="related-categories">
          <h2>Explore More Categories</h2>
          <div className="categories-grid">
            {Object.entries(categoryInfo)
              .filter(([key]) => key !== category)
              .slice(0, 4)
              .map(([key, info]) => (
                <Link key={key} to={`/category/${key}`} className="category-card">
                  <div className="category-image">
                    <img src={info.heroImage} alt={info.name} />
                  </div>
                  <div className="category-overlay">
                    <h3>{info.name}</h3>
                    <p>{info.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;