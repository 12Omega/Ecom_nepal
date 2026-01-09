import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../App';

// Real product data with actual images and variety
const featuredProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    category: 'Electronics',
    rating: 4.8,
    reviews: 1247,
    badge: 'Best Seller'
  },
  {
    id: '2', 
    name: 'Organic Cotton T-Shirt',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    description: 'Soft, sustainable organic cotton t-shirt in multiple colors',
    category: 'Fashion',
    rating: 4.6,
    reviews: 892,
    badge: 'Eco-Friendly'
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Advanced fitness tracking with heart rate monitor and GPS',
    category: 'Electronics',
    rating: 4.9,
    reviews: 2156,
    badge: 'New Arrival'
  },
  {
    id: '4',
    name: 'Artisan Coffee Beans',
    price: 18.99,
    originalPrice: 22.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    description: 'Single-origin Ethiopian coffee beans, freshly roasted',
    category: 'Food & Beverage',
    rating: 4.7,
    reviews: 634,
    badge: 'Limited Edition'
  },
  {
    id: '5',
    name: 'Minimalist Desk Lamp',
    price: 45.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    description: 'Modern LED desk lamp with adjustable brightness and USB charging',
    category: 'Home & Office',
    rating: 4.5,
    reviews: 423,
    badge: 'Editor\'s Choice'
  },
  {
    id: '6',
    name: 'Leather Crossbody Bag',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    description: 'Handcrafted genuine leather bag with multiple compartments',
    category: 'Fashion',
    rating: 4.8,
    reviews: 756,
    badge: 'Handmade'
  }
];

const categories = [
  { name: 'Electronics', icon: '📱', color: '#667eea' },
  { name: 'Fashion', icon: '👕', color: '#f093fb' },
  { name: 'Home & Office', icon: '🏠', color: '#4facfe' },
  { name: 'Food & Beverage', icon: '☕', color: '#43e97b' },
  { name: 'Sports & Fitness', icon: '🏃‍♂️', color: '#fa709a' },
  { name: 'Books & Media', icon: '📚', color: '#ffecd2' }
];

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: 'Summer Sale 2024',
      subtitle: 'Up to 50% off on selected items',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop'
    },
    {
      title: 'New Electronics Collection',
      subtitle: 'Latest tech gadgets and accessories',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop'
    },
    {
      title: 'Sustainable Fashion',
      subtitle: 'Eco-friendly clothing for conscious consumers',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* Hero Carousel */}
      <section style={{ 
        position: 'relative',
        height: '70vh',
        overflow: 'hidden',
        borderRadius: '0 0 30px 30px'
      }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: slide.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 5%',
              opacity: currentSlide === index ? 1 : 0,
              transform: `translateX(${currentSlide === index ? 0 : 100}px)`,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'white'
            }}
          >
            <div style={{ 
              flex: 1, 
              maxWidth: '500px',
              transform: `translateY(${isVisible ? 0 : 50}px)`,
              opacity: isVisible ? 1 : 0,
              transition: 'all 1s ease-out'
            }}>
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                margin: '0 0 20px 0',
                fontWeight: '700',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h1>
              <p style={{ 
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
                margin: '0 0 40px 0',
                opacity: 0.95,
                lineHeight: '1.5'
              }}>
                {slide.subtitle}
              </p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <Link 
                  to="/products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '18px 35px',
                    background: 'rgba(255,255,255,0.95)',
                    color: '#1a202c',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                  }}
                >
                  🛍️ Shop Now
                </Link>
                <button
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '18px 35px',
                    background: 'transparent',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.8)',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                  }}
                >
                  📖 Learn More
                </button>
              </div>
            </div>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={slide.image}
                alt={slide.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  transform: `scale(${isVisible ? 1 : 0.8})`,
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 1.2s ease-out'
                }}
              />
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px'
        }}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Categories Section */}
        <section style={{ 
          padding: '80px 0 60px 0',
          transform: `translateY(${isVisible ? 0 : 50}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease-out 0.3s'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              margin: '0 0 15px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700'
            }}>
              Shop by Category
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover our curated collection across multiple categories
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '25px',
            marginBottom: '40px'
          }}>
            {categories.map((category, index) => (
              <div 
                key={category.name}
                style={{ 
                  background: 'white',
                  padding: '40px 20px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transform: `translateY(${isVisible ? 0 : 30}px)`,
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '15px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}>
                  {category.icon}
                </div>
                <h3 style={{ 
                  margin: '0',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c'
                }}>
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section style={{ 
          padding: '60px 0',
          transform: `translateY(${isVisible ? 0 : 50}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease-out 0.6s'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              margin: '0 0 15px 0',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700'
            }}>
              Featured Products
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Handpicked items just for you
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '30px',
            marginBottom: '50px'
          }}>
            {featuredProducts.map((product, index) => (
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
                  transform: `translateY(${isVisible ? 0 : 30}px)`,
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${index * 0.1}s`
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    zIndex: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    {product.badge}
                  </div>
                )}
                
                {/* Product Image */}
                <div style={{ 
                  position: 'relative',
                  height: '280px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={product.image}
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
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                    e.currentTarget.style.color = 'inherit';
                  }}
                  >
                    ❤️
                  </div>
                </div>
                
                {/* Product Info */}
                <div style={{ padding: '25px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                    lineHeight: '1.5'
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
                    <div style={{ color: '#fbbf24' }}>
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  
                  {/* Price and Add to Cart */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
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
                      onClick={() => addToCart(product)}
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

          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 8px 25px rgba(79, 172, 254, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(79, 172, 254, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.4)';
              }}
            >
              View All Products →
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ 
          padding: '80px 0',
          background: 'white',
          borderRadius: '30px',
          margin: '40px 0',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
        }}>
          <div style={{ padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                margin: '0 0 15px 0',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '700'
              }}>
                Why Choose Us?
              </h2>
              <p style={{ 
                fontSize: '1.2rem', 
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                We're committed to providing the best shopping experience
              </p>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '40px' 
            }}>
              {[
                {
                  icon: '🔒',
                  title: 'Secure Payments',
                  description: 'Your transactions are protected with bank-level security and SSL encryption',
                  color: '#667eea'
                },
                {
                  icon: '🚚',
                  title: 'Fast Delivery',
                  description: 'Free shipping on orders over $50 with tracking and insurance included',
                  color: '#f093fb'
                },
                {
                  icon: '🎯',
                  title: 'Quality Guarantee',
                  description: '30-day money-back guarantee on all products with hassle-free returns',
                  color: '#4facfe'
                },
                {
                  icon: '💬',
                  title: '24/7 Support',
                  description: 'Our customer service team is always ready to help you with any questions',
                  color: '#43e97b'
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  style={{ 
                    textAlign: 'center',
                    padding: '40px 20px',
                    borderRadius: '20px',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    transform: `translateY(${isVisible ? 0 : 30}px)`,
                    opacity: isVisible ? 1 : 0,
                    transitionDelay: `${index * 0.2}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${feature.color}15, ${feature.color}25)`;
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    fontSize: '4rem', 
                    marginBottom: '20px',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: '0 0 15px 0',
                    color: '#1a202c'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    color: '#64748b',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section style={{ 
          padding: '80px 40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '30px',
          textAlign: 'center',
          color: 'white',
          margin: '40px 0'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            margin: '0 0 15px 0',
            fontWeight: '700'
          }}>
            Stay Updated
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            margin: '0 0 40px 0',
            opacity: 0.9,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Subscribe to our newsletter and be the first to know about new products and exclusive offers
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            maxWidth: '500px', 
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '18px 25px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button
              style={{
                padding: '18px 35px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              Subscribe 📧
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;