import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  imageUrl: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  category: string;
  subcategory: string;
  brand: string;
  manufacturer: string;
  model: string;
  sku: string;
  barcode: string;
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  isActive: boolean;
  tags: string[];
  origin: string;
  countryOfOrigin: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  color: string;
  size: string;
  material: string;
  features: string[];
  specifications: Array<{
    name: string;
    value: string;
  }>;
  warranty: {
    duration: number;
    unit: string;
    description: string;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost: number;
    processingTime: number;
    estimatedDelivery: string;
  };
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  totalSales: number;
  totalRevenue: number;
  viewCount: number;
  relatedProducts: string[];
  crossSellProducts: string[];
  reorderLevel: number;
  maxOrderQuantity: number;
  minOrderQuantity: number;
  priceHistory: Array<{
    price: number;
    date: string;
    reason: string;
  }>;
  status: string;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
  images: string[];
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  averageRating: number;
  totalReviews: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [crossSellProducts, setCrossSellProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [priceAlert, setPriceAlert] = useState(false);
  const [stockAlert, setStockAlert] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
      incrementViewCount();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
      fetchCrossSellProducts();
      checkWishlistStatus();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        // Set initial image
        if (data.images && data.images.length > 0) {
          const primaryIndex = data.images.findIndex((img: any) => img.isPrimary);
          setSelectedImage(primaryIndex >= 0 ? primaryIndex : 0);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products/${id}/related`);
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const fetchCrossSellProducts = async () => {
    try {
      const response = await fetch(`/api/products/${id}/cross-sell`);
      if (response.ok) {
        const data = await response.json();
        setCrossSellProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching cross-sell products:', error);
    }
  };

  const incrementViewCount = async () => {
    try {
      await fetch(`/api/products/${id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check/${id}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product?._id, 
          quantity: quantity 
        }),
      });

      if (response.ok) {
        alert(`Added ${quantity} ${product?.name} to cart!`);
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }
  };

  const toggleWishlist = async () => {
    try {
      const method = isInWishlist ? 'DELETE' : 'POST';
      const response = await fetch(`/api/wishlist/${id}`, { method });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        alert(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
        fetchProduct(); // Refresh to update rating
        alert('Review submitted successfully!');
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const setupPriceAlert = async () => {
    try {
      const targetPrice = prompt('Enter your target price:');
      if (!targetPrice) return;

      const response = await fetch(`/api/products/${id}/price-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetPrice: parseFloat(targetPrice) }),
      });

      if (response.ok) {
        setPriceAlert(true);
        alert('Price alert set successfully!');
      }
    } catch (error) {
      console.error('Error setting price alert:', error);
    }
  };

  const setupStockAlert = async () => {
    try {
      const response = await fetch(`/api/products/${id}/stock-alert`, {
        method: 'POST',
      });

      if (response.ok) {
        setStockAlert(true);
        alert('Stock alert set successfully!');
      }
    } catch (error) {
      console.error('Error setting stock alert:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStockStatus = () => {
    if (!product) return '';
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= product.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  };

  const getStockMessage = () => {
    if (!product) return '';
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= product.lowStockThreshold) return `Only ${product.stock} left!`;
    return `${product.stock} in stock`;
  };

  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === 'all') return true;
    return review.rating === parseInt(reviewFilter);
  });

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="error">
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: product.imageUrl, alt: product.name, isPrimary: true }].filter(img => img.url);

  const discountAmount = product.originalPrice > 0 ? product.originalPrice - product.price : 0;
  const savings = discountAmount > 0 ? ((discountAmount / product.originalPrice) * 100).toFixed(0) : 0;

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          {product.subcategory && (
            <>
              <span>/</span>
              <Link to={`/products?category=${product.category}&subcategory=${product.subcategory}`}>
                {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
              </Link>
            </>
          )}
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={productImages[selectedImage]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop'} 
                alt={productImages[selectedImage]?.alt || product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop';
                }}
              />
              {discountAmount > 0 && (
                <div className="discount-badge">
                  -{savings}% OFF
                </div>
              )}
              {product.featured && (
                <div className="featured-badge">
                  ⭐ Featured
                </div>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="image-thumbnails">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              {product.brand && (
                <div className="product-brand">
                  <Link to={`/products?brand=${product.brand}`}>
                    {product.brand}
                  </Link>
                </div>
              )}
              <h1>{product.name}</h1>
              {product.model && (
                <div className="product-model">Model: {product.model}</div>
              )}
            </div>
            
            {/* Rating and Reviews */}
            <div className="product-rating">
              <div className="stars">
                {'★'.repeat(Math.floor(product.averageRating))}
                {'☆'.repeat(5 - Math.floor(product.averageRating))}
              </div>
              <span className="rating-text">
                {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
              </span>
              <span className="view-count">{product.viewCount} views</span>
            </div>

            {/* Pricing */}
            <div className="product-pricing">
              <div className="price-main">
                <span className="current-price">{formatCurrency(product.price)}</span>
                {product.originalPrice > 0 && product.originalPrice > product.price && (
                  <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>
              {discountAmount > 0 && (
                <div className="savings">
                  You save {formatCurrency(discountAmount)} ({savings}%)
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className={`stock-status ${getStockStatus()}`}>
              <span className="stock-indicator"></span>
              {getStockMessage()}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="short-description">
                <p>{product.shortDescription}</p>
              </div>
            )}

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="key-features">
                <h3>Key Features:</h3>
                <ul>
                  {product.features.slice(0, 5).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Variants */}
            <div className="product-variants">
              {product.color && (
                <div className="variant-group">
                  <label>Color:</label>
                  <span className="variant-value">{product.color}</span>
                </div>
              )}
              {product.size && (
                <div className="variant-group">
                  <label>Size:</label>
                  <span className="variant-value">{product.size}</span>
                </div>
              )}
              {product.material && (
                <div className="variant-group">
                  <label>Material:</label>
                  <span className="variant-value">{product.material}</span>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - 1))}
                    disabled={quantity <= product.minOrderQuantity}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(Math.min(product.stock, product.maxOrderQuantity), quantity + 1))}
                    disabled={quantity >= Math.min(product.stock, product.maxOrderQuantity)}
                  >
                    +
                  </button>
                </div>
                <div className="quantity-limits">
                  Min: {product.minOrderQuantity}, Max: {Math.min(product.stock, product.maxOrderQuantity)}
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={addToCart}
                  className="btn btn-primary btn-large"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : `Add to Cart - ${formatCurrency(product.price * quantity)}`}
                </button>
                
                <button className="btn btn-secondary btn-large">
                  Buy Now
                </button>
                
                <button 
                  onClick={toggleWishlist}
                  className={`btn btn-outline ${isInWishlist ? 'active' : ''}`}
                >
                  {isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
              </div>

              <div className="additional-actions">
                <button onClick={setupPriceAlert} className="alert-btn">
                  🔔 Price Alert
                </button>
                {product.stock === 0 && (
                  <button onClick={setupStockAlert} className="alert-btn">
                    📧 Notify When Available
                  </button>
                )}
                <button className="share-btn">
                  📤 Share Product
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info">
              <h3>Shipping Information</h3>
              <div className="shipping-details">
                {product.shipping.freeShipping ? (
                  <div className="shipping-item">
                    <span className="shipping-icon">🚚</span>
                    <span>Free Shipping</span>
                  </div>
                ) : (
                  <div className="shipping-item">
                    <span className="shipping-icon">🚚</span>
                    <span>Shipping: {formatCurrency(product.shipping.shippingCost)}</span>
                  </div>
                )}
                <div className="shipping-item">
                  <span className="shipping-icon">⏱️</span>
                  <span>Processing: {product.shipping.processingTime} business days</span>
                </div>
                <div className="shipping-item">
                  <span className="shipping-icon">📦</span>
                  <span>Delivery: {product.shipping.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Warranty */}
            {product.warranty.duration > 0 && (
              <div className="warranty-info">
                <h3>Warranty</h3>
                <p>
                  {product.warranty.duration} {product.warranty.unit} warranty
                  {product.warranty.description && ` - ${product.warranty.description}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="product-card">
                  <Link to={`/product/${relatedProduct._id}`}>
                    <div className="product-image">
                      <img 
                        src={relatedProduct.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=250&fit=crop'} 
                        alt={relatedProduct.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=250&fit=crop';
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{relatedProduct.name}</h3>
                      <div className="product-price">
                        <span className="price">${relatedProduct.price}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
        {/* Detailed Information Tabs */}
        <div className="product-tabs">
          <div className="tab-nav">
            <button 
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              📋 Overview
            </button>
            <button 
              className={activeTab === 'specifications' ? 'active' : ''}
              onClick={() => setActiveTab('specifications')}
            >
              📊 Specifications
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              ⭐ Reviews ({product.totalReviews})
            </button>
            <button 
              className={activeTab === 'shipping' ? 'active' : ''}
              onClick={() => setActiveTab('shipping')}
            >
              🚚 Shipping & Returns
            </button>
            {product.priceHistory.length > 0 && (
              <button 
                className={activeTab === 'price-history' ? 'active' : ''}
                onClick={() => setActiveTab('price-history')}
              >
                📈 Price History
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="description-section">
                  <h3>Product Description</h3>
                  <div className={`description-content ${showFullDescription ? 'expanded' : ''}`}>
                    <p>{product.description}</p>
                  </div>
                  {product.description.length > 300 && (
                    <button 
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="toggle-description"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="features-section">
                    <h3>Features & Benefits</h3>
                    <ul className="features-list">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="product-meta">
                  <div className="meta-grid">
                    <div className="meta-item">
                      <strong>SKU:</strong> {product.sku || 'N/A'}
                    </div>
                    <div className="meta-item">
                      <strong>Barcode:</strong> {product.barcode || 'N/A'}
                    </div>
                    <div className="meta-item">
                      <strong>Origin:</strong> {product.countryOfOrigin || product.origin}
                    </div>
                    <div className="meta-item">
                      <strong>Manufacturer:</strong> {product.manufacturer || 'N/A'}
                    </div>
                    <div className="meta-item">
                      <strong>Total Sales:</strong> {product.totalSales} units
                    </div>
                    <div className="meta-item">
                      <strong>Added:</strong> {formatDate(product.createdAt)}
                    </div>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="tags-section">
                    <h3>Tags</h3>
                    <div className="tags">
                      {product.tags.map((tag, index) => (
                        <Link 
                          key={index} 
                          to={`/products?tag=${tag}`}
                          className="tag"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="specifications-tab">
                <div className="specs-grid">
                  {/* Physical Specifications */}
                  {(product.dimensions.length > 0 || product.weight.value > 0) && (
                    <div className="spec-category">
                      <h3>Physical Specifications</h3>
                      <div className="spec-list">
                        {product.dimensions.length > 0 && (
                          <div className="spec-item">
                            <span className="spec-label">Dimensions:</span>
                            <span className="spec-value">
                              {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                            </span>
                          </div>
                        )}
                        {product.weight.value > 0 && (
                          <div className="spec-item">
                            <span className="spec-label">Weight:</span>
                            <span className="spec-value">{product.weight.value} {product.weight.unit}</span>
                          </div>
                        )}
                        {product.color && (
                          <div className="spec-item">
                            <span className="spec-label">Color:</span>
                            <span className="spec-value">{product.color}</span>
                          </div>
                        )}
                        {product.material && (
                          <div className="spec-item">
                            <span className="spec-label">Material:</span>
                            <span className="spec-value">{product.material}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Custom Specifications */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="spec-category">
                      <h3>Technical Specifications</h3>
                      <div className="spec-list">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="spec-item">
                            <span className="spec-label">{spec.name}:</span>
                            <span className="spec-value">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Information */}
                  <div className="spec-category">
                    <h3>Product Information</h3>
                    <div className="spec-list">
                      <div className="spec-item">
                        <span className="spec-label">Brand:</span>
                        <span className="spec-value">{product.brand || 'N/A'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Model:</span>
                        <span className="spec-value">{product.model || 'N/A'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Category:</span>
                        <span className="spec-value">{product.category}</span>
                      </div>
                      {product.subcategory && (
                        <div className="spec-item">
                          <span className="spec-label">Subcategory:</span>
                          <span className="spec-value">{product.subcategory}</span>
                        </div>
                      )}
                      <div className="spec-item">
                        <span className="spec-label">Status:</span>
                        <span className="spec-value">{product.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Information */}
                  <div className="spec-category">
                    <h3>Inventory Information</h3>
                    <div className="spec-list">
                      <div className="spec-item">
                        <span className="spec-label">Stock Level:</span>
                        <span className="spec-value">{product.stock} units</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Low Stock Alert:</span>
                        <span className="spec-value">{product.lowStockThreshold} units</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Min Order Qty:</span>
                        <span className="spec-value">{product.minOrderQuantity}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Max Order Qty:</span>
                        <span className="spec-value">{product.maxOrderQuantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                {/* Rating Summary */}
                <div className="rating-summary">
                  <div className="overall-rating">
                    <div className="rating-score">{product.averageRating.toFixed(1)}</div>
                    <div className="rating-stars">
                      {'★'.repeat(Math.floor(product.averageRating))}
                      {'☆'.repeat(5 - Math.floor(product.averageRating))}
                    </div>
                    <div className="rating-count">Based on {product.totalReviews} reviews</div>
                  </div>
                  
                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="rating-bar">
                        <span className="rating-label">{rating} ★</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ 
                              width: `${product.totalReviews > 0 ? (product.ratingDistribution[rating as keyof typeof product.ratingDistribution] / product.totalReviews) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="rating-count">
                          {product.ratingDistribution[rating as keyof typeof product.ratingDistribution]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Filters */}
                <div className="review-filters">
                  <label>Filter by rating:</label>
                  <select 
                    value={reviewFilter} 
                    onChange={(e) => setReviewFilter(e.target.value)}
                  >
                    <option value="all">All Reviews</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                {/* Write Review Form */}
                <div className="review-form">
                  <h3>Write a Review</h3>
                  <form onSubmit={submitReview}>
                    <div className="rating-input">
                      <label>Rating:</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className={star <= newReview.rating ? 'active' : ''}
                            onClick={() => setNewReview({...newReview, rating: star})}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="comment-input">
                      <label>Review:</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Share your experience with this product..."
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="reviews-list">
                  {filteredReviews.length === 0 ? (
                    <p>No reviews found for the selected filter.</p>
                  ) : (
                    filteredReviews.map((review) => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-name">{review.userName}</div>
                            {review.verified && (
                              <span className="verified-badge">✓ Verified Purchase</span>
                            )}
                          </div>
                          <div className="review-rating">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                          <div className="review-date">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                        <div className="review-comment">
                          {review.comment}
                        </div>
                        {review.images && review.images.length > 0 && (
                          <div className="review-images">
                            {review.images.map((image, index) => (
                              <img key={index} src={image} alt={`Review ${index + 1}`} />
                            ))}
                          </div>
                        )}
                        <div className="review-actions">
                          <button className="helpful-btn">
                            👍 Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="shipping-tab">
                <div className="shipping-policies">
                  <div className="policy-section">
                    <h3>🚚 Shipping Information</h3>
                    <div className="policy-content">
                      <div className="shipping-option">
                        <strong>Standard Shipping:</strong>
                        <span>{product.shipping.freeShipping ? 'Free' : formatCurrency(product.shipping.shippingCost)}</span>
                        <span>Delivery: {product.shipping.estimatedDelivery}</span>
                      </div>
                      <div className="shipping-option">
                        <strong>Processing Time:</strong>
                        <span>{product.shipping.processingTime} business days</span>
                      </div>
                      <div className="shipping-details">
                        <strong>Package Dimensions:</strong>
                        <span>
                          {product.shipping.dimensions.length} × {product.shipping.dimensions.width} × {product.shipping.dimensions.height} cm
                        </span>
                      </div>
                      <div className="shipping-details">
                        <strong>Package Weight:</strong>
                        <span>{product.shipping.weight} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>🔄 Return Policy</h3>
                    <div className="policy-content">
                      <ul>
                        <li>30-day return window from delivery date</li>
                        <li>Items must be in original condition and packaging</li>
                        <li>Free returns for defective or damaged items</li>
                        <li>Customer pays return shipping for change of mind</li>
                        <li>Refunds processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>

                  {product.warranty.duration > 0 && (
                    <div className="policy-section">
                      <h3>🛡️ Warranty Information</h3>
                      <div className="policy-content">
                        <p>
                          <strong>Duration:</strong> {product.warranty.duration} {product.warranty.unit}
                        </p>
                        {product.warranty.description && (
                          <p><strong>Coverage:</strong> {product.warranty.description}</p>
                        )}
                        <ul>
                          <li>Covers manufacturing defects</li>
                          <li>Does not cover normal wear and tear</li>
                          <li>Warranty void if product is modified</li>
                          <li>Contact customer service for warranty claims</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'price-history' && product.priceHistory.length > 0 && (
              <div className="price-history-tab">
                <h3>Price History</h3>
                <div className="price-chart">
                  <div className="chart-container">
                    {product.priceHistory.map((entry, index) => (
                      <div key={index} className="price-entry">
                        <div className="price-date">{formatDate(entry.date)}</div>
                        <div className="price-amount">{formatCurrency(entry.price)}</div>
                        <div className="price-reason">{entry.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="price-stats">
                  <div className="stat-item">
                    <strong>Lowest Price:</strong>
                    <span>{formatCurrency(Math.min(...product.priceHistory.map(p => p.price)))}</span>
                  </div>
                  <div className="stat-item">
                    <strong>Highest Price:</strong>
                    <span>{formatCurrency(Math.max(...product.priceHistory.map(p => p.price)))}</span>
                  </div>
                  <div className="stat-item">
                    <strong>Current Price:</strong>
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="product-card">
                  <Link to={`/product/${relatedProduct._id}`}>
                    <img 
                      src={relatedProduct.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'} 
                      alt={relatedProduct.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop';
                      }}
                    />
                    <h3>{relatedProduct.name}</h3>
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(relatedProduct.averageRating))}
                      {'☆'.repeat(5 - Math.floor(relatedProduct.averageRating))}
                      <span>({relatedProduct.totalReviews})</span>
                    </div>
                    <div className="product-price">{formatCurrency(relatedProduct.price)}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-sell Products */}
        {crossSellProducts.length > 0 && (
          <div className="cross-sell-products">
            <h2>Frequently Bought Together</h2>
            <div className="products-grid">
              {crossSellProducts.map((crossSellProduct) => (
                <div key={crossSellProduct._id} className="product-card">
                  <Link to={`/product/${crossSellProduct._id}`}>
                    <img 
                      src={crossSellProduct.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'} 
                      alt={crossSellProduct.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop';
                      }}
                    />
                    <h3>{crossSellProduct.name}</h3>
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(crossSellProduct.averageRating))}
                      {'☆'.repeat(5 - Math.floor(crossSellProduct.averageRating))}
                      <span>({crossSellProduct.totalReviews})</span>
                    </div>
                    <div className="product-price">{formatCurrency(crossSellProduct.price)}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;/ /   P r o d u c t   d e t a i l s  
 