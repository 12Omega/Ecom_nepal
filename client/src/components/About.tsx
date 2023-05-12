import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>About NepalShop</h1>
            <p>Bringing authentic Nepalese culture and craftsmanship to the world</p>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop" 
              alt="Nepal Mountains" 
            />
          </div>
        </div>
      </section>

      <div className="container">
        {/* Our Story Section */}
        <section className="our-story">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in the heart of Kathmandu, NepalShop was born from a passion to share the rich cultural heritage 
                and exceptional craftsmanship of Nepal with the world. Our journey began when our founder, inspired by 
                the incredible artisans and their time-honored traditions, decided to create a platform that would 
                connect these talented craftspeople directly with customers worldwide.
              </p>
              <p>
                Every product in our collection tells a story - from the skilled hands that crafted it to the ancient 
                techniques passed down through generations. We work directly with artisans, cooperatives, and small 
                businesses across Nepal, ensuring fair trade practices and supporting local communities.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop" 
                alt="Nepalese Artisan" 
              />
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mission-values">
          <h2>Our Mission & Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" alt="Authenticity" />
              </div>
              <h3>Authenticity</h3>
              <p>Every product is genuinely made in Nepal using traditional methods and materials, preserving the authentic cultural heritage.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop" alt="Fair Trade" />
              </div>
              <h3>Fair Trade</h3>
              <p>We ensure fair compensation for artisans and support sustainable livelihoods in Nepalese communities.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop" alt="Sustainability" />
              </div>
              <h3>Sustainability</h3>
              <p>We promote eco-friendly practices and sustainable production methods that respect our environment.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop" alt="Quality" />
              </div>
              <h3>Quality</h3>
              <p>Each item undergoes careful quality control to ensure you receive products of the highest standard.</p>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="our-impact">
          <h2>Our Impact</h2>
          <div className="impact-content">
            <div className="impact-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Artisans Supported</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25</div>
                <div className="stat-label">Districts Covered</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Countries Reached</div>
              </div>
            </div>
            <div className="impact-description">
              <p>
                Through NepalShop, we've been able to create sustainable income opportunities for hundreds of artisans 
                across Nepal. Our partnerships extend from the bustling streets of Kathmandu to remote mountain villages, 
                bringing economic opportunities to communities that have preserved their traditional crafts for centuries.
              </p>
              <p>
                Every purchase you make directly contributes to preserving Nepal's cultural heritage while supporting 
                the livelihoods of skilled craftspeople and their families.
              </p>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="our-team">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Rajesh Sharma" />
              </div>
              <h3>Rajesh Sharma</h3>
              <p className="member-title">Founder & CEO</p>
              <p>Born in Kathmandu, Rajesh has dedicated his life to promoting Nepalese culture and supporting local artisans.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=200&h=200&fit=crop" alt="Sita Gurung" />
              </div>
              <h3>Sita Gurung</h3>
              <p className="member-title">Head of Artisan Relations</p>
              <p>Sita works directly with artisan communities, ensuring fair trade practices and quality standards.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" alt="Krishna Adhikari" />
              </div>
              <h3>Krishna Adhikari</h3>
              <p className="member-title">Quality Control Manager</p>
              <p>With 15 years of experience, Krishna ensures every product meets our high-quality standards.</p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="certifications">
          <h2>Our Certifications</h2>
          <div className="cert-grid">
            <div className="cert-item">
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=100&fit=crop" alt="Fair Trade Certified" />
              <h4>Fair Trade Certified</h4>
              <p>Ensuring ethical business practices</p>
            </div>
            <div className="cert-item">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=100&fit=crop" alt="Eco-Friendly" />
              <h4>Eco-Friendly</h4>
              <p>Sustainable and environmentally conscious</p>
            </div>
            <div className="cert-item">
              <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=100&fit=crop" alt="Handmade Guarantee" />
              <h4>Handmade Guarantee</h4>
              <p>100% authentic handcrafted products</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Join Our Journey</h2>
            <p>Discover the beauty of Nepal through our authentic products and support artisan communities.</p>
            <div className="cta-buttons">
              <Link to="/products" className="btn btn-primary btn-large">
                Shop Now
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-large">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;/ /   A b o u t   p a g e  
 