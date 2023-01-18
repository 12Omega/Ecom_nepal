import React, { useState } from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with our team.</p>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop" 
            alt="Contact Us" 
          />
        </div>
      </section>

      <div className="container">
        {/* Contact Information */}
        <section className="contact-info">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop" alt="Office" />
              </div>
              <h3>Visit Our Store</h3>
              <p>Thamel, Kathmandu<br />Nepal 44600</p>
              <p>Open: Mon-Sat 9AM-7PM<br />Sunday: 10AM-5PM</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop" alt="Phone" />
              </div>
              <h3>Call Us</h3>
              <p>+977-1-4441234<br />+977-9841234567</p>
              <p>Available: 9AM-6PM NPT<br />Monday to Saturday</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=100&h=100&fit=crop" alt="Email" />
              </div>
              <h3>Email Us</h3>
              <p>info@nepalshop.com<br />support@nepalshop.com</p>
              <p>Response time:<br />Within 24 hours</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop" alt="Social" />
              </div>
              <h3>Follow Us</h3>
              <p>@NepalShopOfficial<br />Facebook | Instagram</p>
              <p>Daily updates on<br />new products & culture</p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>Have a question about our products or need assistance? We're here to help!</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="order-support">Order Support</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="wholesale">Wholesale Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

          <div className="contact-image">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop" 
              alt="Nepal Culture" 
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Do you ship internationally?</h3>
              <p>Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. Check our shipping page for detailed information.</p>
            </div>

            <div className="faq-item">
              <h3>Are your products authentic?</h3>
              <p>Absolutely! All our products are handcrafted by skilled artisans in Nepal using traditional methods and materials. We guarantee 100% authenticity.</p>
            </div>

            <div className="faq-item">
              <h3>What is your return policy?</h3>
              <p>We offer a 30-day return policy for unused items in original condition. Custom or personalized items may have different return terms.</p>
            </div>

            <div className="faq-item">
              <h3>Do you offer wholesale pricing?</h3>
              <p>Yes, we work with retailers and businesses worldwide. Contact us for wholesale pricing and minimum order requirements.</p>
            </div>

            <div className="faq-item">
              <h3>How can I track my order?</h3>
              <p>Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.</p>
            </div>

            <div className="faq-item">
              <h3>Do you have a physical store?</h3>
              <p>Yes! Visit our flagship store in Thamel, Kathmandu. We also have partner stores in major cities across Nepal.</p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=400&fit=crop" 
                alt="Nepal Location Map" 
              />
              <div className="map-overlay">
                <div className="location-pin">
                  <h3>NepalShop Headquarters</h3>
                  <p>Thamel, Kathmandu, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="business-hours">
          <h2>Business Hours</h2>
          <div className="hours-grid">
            <div className="hours-card">
              <h3>Store Hours</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </div>
                <div className="hours-item">
                  <span>Saturday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span>Sunday</span>
                  <span>10:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            <div className="hours-card">
              <h3>Customer Support</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span>Phone Support</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span>Email Support</span>
                  <span>24/7 Response</span>
                </div>
                <div className="hours-item">
                  <span>Live Chat</span>
                  <span>10:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;