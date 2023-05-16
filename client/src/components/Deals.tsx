import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Deals.css';

interface Deal {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  imageUrl: string;
  category: string;
  discount: number;
  validUntil: string;
  stock: number;
  featured: boolean;
}

const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdowns();
    }, 1000);

    return () => clearInterval(timer);
  }, [deals]);

  const fetchDeals = async () => {
    try {
      // For now, we'll create mock deals data since the backend might not have a deals endpoint
      const mockDeals: Deal[] = [
        {
          _id: '1',
          name: 'Traditional Dhaka Topi (ढाका टोपी)',
          description: 'Authentic handwoven Dhaka topi from Palpa district. Limited time offer!',
          originalPrice: 850,
          salePrice: 680,
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
          category: 'clothing',
          discount: 20,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          stock: 15,
          featured: true
        },
        {
          _id: '2',
          name: 'Singing Bowl (गायन कचौरा)',
          description: 'Handcrafted Tibetan singing bowl made from seven sacred metals.',
          originalPrice: 2800,
          salePrice: 2240,
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
          category: 'handicrafts',
          discount: 20,
          validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          stock: 8,
          featured: true
        },
        {
          _id: '3',
          name: 'Himalayan Black Tea (हिमालयन कालो चिया)',
          description: 'Premium black tea grown in the high altitudes of Ilam district.',
          originalPrice: 1200,
          salePrice: 900,
          imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
          category: 'food',
          discount: 25,
          validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          stock: 25,
          featured: false
        },
        {
          _id: '4',
          name: 'Rudraksha Mala (रुद्राक्ष माला)',
          description: '108 bead rudraksha mala from sacred trees of Nepal.',
          originalPrice: 1500,
          salePrice: 1125,
          imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
          category: 'jewelry',
          discount: 25,
          validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          stock: 12,
          featured: false
        },
        {
          _id: '5',
          name: 'Pashmina Shawl (पश्मिना)',
          description: 'Luxurious cashmere pashmina shawl from the Himalayas.',
          originalPrice: 4500,
          salePrice: 3150,
          imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
          category: 'clothing',
          discount: 30,
          validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          stock: 6,
          featured: true
        },
        {
          _id: '6',
          name: 'Himalayan Honey (हिमालयन मह)',
          description: 'Pure wild honey collected from cliff-hanging hives in the Himalayas.',
          originalPrice: 2800,
          salePrice: 2100,
          imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
          category: 'food',
          discount: 25,
          validUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
          stock: 18,
          featured: false
        }
      ];

      setDeals(mockDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCountdowns = () => {
    const newTimeLeft: { [key: string]: string } = {};
    
    deals.forEach(deal => {
      const now = new Date().getTime();
      const endTime = new Date(deal.validUntil).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        newTimeLeft[deal._id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else {
        newTimeLeft[deal._id] = 'Expired';
      }
    });

    setTimeLeft(newTimeLeft);
  };

  const addToCart = async (dealId: string) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: dealId, quantity: 1 }),
      });

      if (response.ok) {
        alert('Deal added to cart!');
      } else {
        alert('Failed to add deal to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }
  };

  if (loading) {
    return (
      <div className="deals-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading deals...</p>
        </div>
      </div>
    );
  }

  const featuredDeals = deals.filter(deal => deal.featured);
  const regularDeals = deals.filter(deal => !deal.featured);

  return (
    <div className="deals-page">
      <div className="container">
        <div className="deals-header">
          <h1>🔥 Special Deals & Offers</h1>
          <p>Limited time offers on authentic Nepalese products. Don't miss out!</p>
        </div>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="featured-deals">
            <h2>⭐ Featured Deals</h2>
            <div className="deals-grid featured">
              {featuredDeals.map((deal) => (
                <div key={deal._id} className="deal-card featured-deal">
                  <div className="deal-badge">
                    <span className="discount">-{deal.discount}%</span>
                    <span className="featured-label">Featured</span>
                  </div>
                  
                  <div className="deal-image">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                  
                  <div className="deal-content">
                    <h3>{deal.name}</h3>
                    <p className="deal-description">{deal.description}</p>
                    
                    <div className="price-section">
                      <span className="original-price">${deal.originalPrice}</span>
                      <span className="sale-price">${deal.salePrice}</span>
                      <span className="savings">Save ${deal.originalPrice - deal.salePrice}</span>
                    </div>
                    
                    <div className="countdown">
                      <span className="countdown-label">⏰ Ends in:</span>
                      <span className="countdown-time">{timeLeft[deal._id] || 'Loading...'}</span>
                    </div>
                    
                    <div className="stock-info">
                      <span className="stock-count">Only {deal.stock} left!</span>
                    </div>
                    
                    <div className="deal-actions">
                      <button 
                        onClick={() => addToCart(deal._id)}
                        className="btn btn-primary"
                        disabled={deal.stock === 0}
                      >
                        {deal.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                      </button>
                      <Link to={`/product/${deal._id}`} className="btn btn-secondary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Deals */}
        {regularDeals.length > 0 && (
          <section className="regular-deals">
            <h2>💰 More Great Deals</h2>
            <div className="deals-grid">
              {regularDeals.map((deal) => (
                <div key={deal._id} className="deal-card">
                  <div className="deal-badge">
                    <span className="discount">-{deal.discount}%</span>
                  </div>
                  
                  <div className="deal-image">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                  
                  <div className="deal-content">
                    <h3>{deal.name}</h3>
                    <p className="deal-description">{deal.description}</p>
                    
                    <div className="price-section">
                      <span className="original-price">${deal.originalPrice}</span>
                      <span className="sale-price">${deal.salePrice}</span>
                    </div>
                    
                    <div className="countdown">
                      <span className="countdown-time">{timeLeft[deal._id] || 'Loading...'}</span>
                    </div>
                    
                    <div className="deal-actions">
                      <button 
                        onClick={() => addToCart(deal._id)}
                        className="btn btn-primary"
                        disabled={deal.stock === 0}
                      >
                        {deal.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                      </button>
                      <Link to={`/product/${deal._id}`} className="btn btn-secondary">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <section className="deals-newsletter">
          <div className="newsletter-content">
            <h2>🔔 Never Miss a Deal!</h2>
            <p>Subscribe to get notified about exclusive deals and flash sales</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe for Deals
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Deals;/ /   D e a l s   p a g e  
 