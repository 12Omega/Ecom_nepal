import React, { useState } from 'react';

const Locations: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const locations = [
    {
      id: 1,
      name: 'ModernShop Thamel',
      type: 'Flagship Store',
      address: 'Thamel Marg, Kathmandu 44600',
      city: 'Kathmandu',
      country: 'Nepal',
      phone: '+977-1-4441234',
      email: 'thamel@modernshop.com',
      hours: {
        weekdays: '9:00 AM - 8:00 PM',
        weekends: '10:00 AM - 7:00 PM'
      },
      services: ['In-store Shopping', 'Click & Collect', 'Personal Shopping', 'Gift Wrapping'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop',
      coordinates: { lat: 27.7172, lng: 85.3240 }
    },
    {
      id: 2,
      name: 'ModernShop Durbar Marg',
      type: 'Premium Store',
      address: 'Durbar Marg, Kathmandu 44600',
      city: 'Kathmandu',
      country: 'Nepal',
      phone: '+977-1-4441235',
      email: 'durbar@modernshop.com',
      hours: {
        weekdays: '10:00 AM - 7:00 PM',
        weekends: '10:00 AM - 6:00 PM'
      },
      services: ['Luxury Items', 'VIP Shopping', 'Personal Consultation', 'Home Delivery'],
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop',
      coordinates: { lat: 27.7024, lng: 85.3182 }
    },
    {
      id: 3,
      name: 'ModernShop Pokhara',
      type: 'Regional Store',
      address: 'Lakeside, Pokhara 33700',
      city: 'Pokhara',
      country: 'Nepal',
      phone: '+977-61-461234',
      email: 'pokhara@modernshop.com',
      hours: {
        weekdays: '9:00 AM - 7:00 PM',
        weekends: '9:00 AM - 8:00 PM'
      },
      services: ['Tourist Specials', 'Trekking Gear', 'Local Crafts', 'Shipping Services'],
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
      coordinates: { lat: 28.2096, lng: 83.9856 }
    },
    {
      id: 4,
      name: 'ModernShop Warehouse',
      type: 'Distribution Center',
      address: 'Bhaktapur Industrial Area',
      city: 'Bhaktapur',
      country: 'Nepal',
      phone: '+977-1-6661234',
      email: 'warehouse@modernshop.com',
      hours: {
        weekdays: '8:00 AM - 6:00 PM',
        weekends: 'Closed'
      },
      services: ['Bulk Orders', 'B2B Sales', 'Wholesale', 'Logistics Hub'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=300&fit=crop',
      coordinates: { lat: 27.6710, lng: 85.4298 }
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Our Locations
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Visit our stores across Nepal for an exceptional shopping experience, or find our distribution centers for business inquiries.
          </p>
        </div>

        {/* Map Placeholder */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            padding: '60px 40px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🗺️</div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                Interactive Map Coming Soon
              </h3>
              <p style={{
                fontSize: '1.1rem',
                opacity: 0.9,
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                We're working on an interactive map to help you find the nearest ModernShop location. 
                For now, browse our store locations below.
              </p>
            </div>
          </div>
        </div>

        {/* Store Locations Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(2, 1fr)' : '1fr',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {locations.map((location) => (
            <div
              key={location.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: selectedLocation === location.id 
                  ? '0 25px 70px rgba(102, 126, 234, 0.3)' 
                  : '0 20px 60px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: selectedLocation === location.id ? 'translateY(-5px)' : 'translateY(0)',
                border: selectedLocation === location.id ? '2px solid #667eea' : '2px solid transparent'
              }}
              onClick={() => setSelectedLocation(selectedLocation === location.id ? null : location.id)}
              onMouseEnter={(e) => {
                if (selectedLocation !== location.id) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLocation !== location.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
                }
              }}
            >
              {/* Store Image */}
              <div style={{
                height: '200px',
                backgroundImage: `url(${location.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: location.type === 'Flagship Store' 
                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : location.type === 'Premium Store'
                    ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
                    : location.type === 'Regional Store'
                    ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  {location.type}
                </div>
              </div>

              {/* Store Info */}
              <div style={{ padding: '30px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a202c',
                    margin: 0
                  }}>
                    {location.name}
                  </h3>
                  <div style={{
                    fontSize: '1.5rem',
                    transform: selectedLocation === location.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    ⌄
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '15px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>📍</span>
                  <p style={{
                    color: '#64748b',
                    margin: 0,
                    fontSize: '1rem'
                  }}>
                    {location.address}, {location.city}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🕒</span>
                  <p style={{
                    color: '#64748b',
                    margin: 0,
                    fontSize: '0.95rem'
                  }}>
                    Mon-Fri: {location.hours.weekdays} | Weekends: {location.hours.weekends}
                  </p>
                </div>

                {/* Expanded Details */}
                {selectedLocation === location.id && (
                  <div style={{
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                          marginBottom: '10px'
                        }}>
                          Contact
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <span>📞</span>
                          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{location.phone}</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>📧</span>
                          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{location.email}</span>
                        </div>
                      </div>

                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                          marginBottom: '10px'
                        }}>
                          Services
                        </h4>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          {location.services.map((service, index) => (
                            <span
                              key={index}
                              style={{
                                background: 'rgba(102, 126, 234, 0.1)',
                                color: '#667eea',
                                padding: '4px 12px',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      flexWrap: 'wrap'
                    }}>
                      <button style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
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
                        🗺️ Get Directions
                      </button>
                      
                      <button style={{
                        background: 'transparent',
                        color: '#667eea',
                        border: '2px solid #667eea',
                        padding: '12px 20px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#667eea';
                      }}>
                        📞 Call Store
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
          gap: '40px'
        }}>
          {/* Store Features */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '30px'
            }}>
              Store Features
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {[
                {
                  icon: '🛍️',
                  title: 'Personal Shopping',
                  description: 'Get personalized assistance from our expert staff'
                },
                {
                  icon: '📦',
                  title: 'Click & Collect',
                  description: 'Order online and pick up at your convenience'
                },
                {
                  icon: '🎁',
                  title: 'Gift Services',
                  description: 'Professional gift wrapping and custom messages'
                },
                {
                  icon: '🚚',
                  title: 'Same-Day Delivery',
                  description: 'Available in Kathmandu valley for orders before 2 PM'
                }
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1a202c',
                      marginBottom: '5px'
                    }}>
                      {feature.title}
                    </h4>
                    <p style={{
                      color: '#64748b',
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visit Planning */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '40px',
            color: 'white'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '30px'
            }}>
              Plan Your Visit
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {[
                {
                  icon: '🅿️',
                  title: 'Free Parking',
                  description: 'Complimentary parking available at all locations'
                },
                {
                  icon: '♿',
                  title: 'Accessibility',
                  description: 'All stores are wheelchair accessible'
                },
                {
                  icon: '📱',
                  title: 'Store App',
                  description: 'Use our app for store navigation and exclusive deals'
                },
                {
                  icon: '💳',
                  title: 'Payment Options',
                  description: 'Cash, cards, mobile payments, and digital wallets accepted'
                }
              ].map((tip, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '2rem' }}>{tip.icon}</div>
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>
                      {tip.title}
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      opacity: 0.9
                    }}>
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Locations;