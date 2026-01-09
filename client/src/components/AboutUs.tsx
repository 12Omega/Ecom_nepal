import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
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
            About ModernShop
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Your trusted partner in bringing the finest products from Nepal and around the world to your doorstep.
          </p>
        </div>

        {/* Story Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
          gap: '60px',
          alignItems: 'center',
          marginBottom: '80px'
        }}>
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px'
            }}>
              Our Story
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              lineHeight: '1.8',
              marginBottom: '20px'
            }}>
              Founded in 2020 in the heart of Kathmandu, ModernShop began as a small family business with a big dream: 
              to connect Nepal's rich cultural heritage and craftsmanship with the global market.
            </p>
            <p style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              lineHeight: '1.8',
              marginBottom: '20px'
            }}>
              What started as a local marketplace has grown into a comprehensive e-commerce platform, featuring 
              everything from traditional Nepali handicrafts to modern electronics, all carefully curated for quality and authenticity.
            </p>
            <p style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              lineHeight: '1.8'
            }}>
              Today, we serve customers worldwide, maintaining our commitment to quality, sustainability, and 
              supporting local artisans and businesses.
            </p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏔️</div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '15px'
            }}>
              Made in Nepal
            </h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Proudly supporting local artisans and businesses while bringing authentic Nepali products to the world.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div style={{
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#1a202c',
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            Our Values
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '40px'
          }}>
            {[
              {
                icon: '🌱',
                title: 'Sustainability',
                description: 'We prioritize eco-friendly products and sustainable business practices to protect our beautiful planet.'
              },
              {
                icon: '🤝',
                title: 'Community',
                description: 'Supporting local artisans, small businesses, and communities is at the heart of everything we do.'
              },
              {
                icon: '✨',
                title: 'Quality',
                description: 'Every product is carefully selected and tested to ensure it meets our high standards of excellence.'
              },
              {
                icon: '🔒',
                title: 'Trust',
                description: 'Your security and privacy are paramount. We use enterprise-grade security to protect your data.'
              },
              {
                icon: '🚀',
                title: 'Innovation',
                description: 'We continuously improve our platform with the latest technology to enhance your shopping experience.'
              },
              {
                icon: '💝',
                title: 'Customer Care',
                description: 'Your satisfaction is our priority. We provide exceptional service and support at every step.'
              }
            ].map((value, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{value.icon}</div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '15px'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div style={{
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#1a202c',
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            Meet Our Team
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '40px'
          }}>
            {[
              {
                name: 'Rajesh Sharma',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                bio: 'Passionate entrepreneur with 15+ years in e-commerce and a vision to connect Nepal with the world.'
              },
              {
                name: 'Priya Thapa',
                role: 'Head of Operations',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
                bio: 'Operations expert ensuring smooth logistics and exceptional customer experience across all channels.'
              },
              {
                name: 'Amit Gurung',
                role: 'Technology Director',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
                bio: 'Tech innovator building secure, scalable solutions that power our modern e-commerce platform.'
              }
            ].map((member, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '20px',
                    border: '4px solid #f1f5f9'
                  }}
                />
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '5px'
                }}>
                  {member.name}
                </h3>
                <p style={{
                  color: '#667eea',
                  fontWeight: '500',
                  marginBottom: '15px'
                }}>
                  {member.role}
                </p>
                <p style={{
                  color: '#64748b',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '30px',
          padding: '60px 40px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            marginBottom: '50px'
          }}>
            Our Impact
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: '40px'
          }}>
            {[
              { number: '50,000+', label: 'Happy Customers' },
              { number: '1,200+', label: 'Products' },
              { number: '25+', label: 'Countries Served' },
              { number: '500+', label: 'Local Partners' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  opacity: 0.9
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '20px'
          }}>
            Our Mission
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#4a5568',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            To bridge cultures and communities through commerce, bringing authentic, high-quality products 
            from Nepal and beyond to customers worldwide, while supporting local artisans and promoting 
            sustainable business practices that benefit everyone in our global community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;