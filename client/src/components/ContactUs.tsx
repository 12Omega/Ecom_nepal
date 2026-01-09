import React, { useState } from 'react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Get in Touch
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
          gap: '60px',
          alignItems: 'start'
        }}>
          {/* Contact Form */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '30px'
            }}>
              Send us a Message
            </h2>

            {submitStatus === 'success' && (
              <div style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                padding: '15px 20px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                ✅ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '15px 20px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                ❌ Failed to send message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    outline: 'none',
                    background: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="business">Business Partnership</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                {isSubmitting ? '📤 Sending...' : '📨 Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            {/* Contact Details */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '30px'
              }}>
                Contact Information
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '25px'
              }}>
                {[
                  {
                    icon: '📍',
                    title: 'Address',
                    content: 'Thamel, Kathmandu 44600, Nepal'
                  },
                  {
                    icon: '📞',
                    title: 'Phone',
                    content: '+977-1-4441234'
                  },
                  {
                    icon: '📧',
                    title: 'Email',
                    content: 'hello@modernshop.com'
                  },
                  {
                    icon: '🕒',
                    title: 'Business Hours',
                    content: 'Mon-Fri: 9:00 AM - 6:00 PM NST'
                  }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      minWidth: '40px'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '5px'
                      }}>
                        {item.title}
                      </h4>
                      <p style={{
                        color: '#64748b',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '30px'
              }}>
                Quick Answers
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {[
                  {
                    question: 'How long does shipping take?',
                    answer: '3-7 business days within Nepal, 7-14 days internationally.'
                  },
                  {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards, PayPal, and local payment methods.'
                  },
                  {
                    question: 'Do you offer returns?',
                    answer: 'Yes, we offer 30-day returns on most items in original condition.'
                  },
                  {
                    question: 'Is international shipping available?',
                    answer: 'Yes, we ship to over 25 countries worldwide.'
                  }
                ].map((faq, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1a202c',
                      marginBottom: '8px'
                    }}>
                      {faq.question}
                    </h4>
                    <p style={{
                      color: '#64748b',
                      margin: 0,
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          color: 'white',
          marginTop: '60px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            Follow Us
          </h3>
          <p style={{
            marginBottom: '30px',
            opacity: 0.9
          }}>
            Stay connected for updates, promotions, and behind-the-scenes content
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {[
              { name: 'Facebook', icon: '📘', url: '#' },
              { name: 'Instagram', icon: '📷', url: '#' },
              { name: 'Twitter', icon: '🐦', url: '#' },
              { name: 'LinkedIn', icon: '💼', url: '#' },
              { name: 'YouTube', icon: '📺', url: '#' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{social.icon}</span>
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;