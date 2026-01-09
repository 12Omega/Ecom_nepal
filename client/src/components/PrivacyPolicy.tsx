import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
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
            Privacy Policy
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            marginBottom: '10px'
          }}>
            Last updated: January 9, 2026
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b'
          }}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          lineHeight: '1.8'
        }}>
          {/* Table of Contents */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px'
            }}>
              Table of Contents
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                'Information We Collect',
                'How We Use Your Information',
                'Information Sharing',
                'Data Security',
                'Your Rights',
                'Cookies and Tracking',
                'Third-Party Services',
                'International Transfers',
                'Data Retention',
                'Contact Us'
              ].map((item, index) => (
                <li key={index} style={{
                  padding: '8px 0',
                  borderBottom: index < 9 ? '1px solid #e2e8f0' : 'none'
                }}>
                  <a href={`#section-${index + 1}`} style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4c51bf';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#667eea';
                  }}>
                    {index + 1}. {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 */}
          <section id="section-1" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              1. Information We Collect
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support.
            </p>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '10px' }}>
              Personal Information:
            </h4>
            <ul style={{ color: '#4a5568', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>Name, email address, and phone number</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely by our payment providers)</li>
              <li>Account preferences and communication settings</li>
            </ul>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '10px' }}>
              Automatically Collected Information:
            </h4>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Website usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="section-2" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              2. How We Use Your Information
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Process and fulfill your orders</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send important updates about your orders and account</li>
              <li>Personalize your shopping experience</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="section-3" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              3. Information Sharing
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information only in the following circumstances:
            </p>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li><strong>Service Providers:</strong> With trusted partners who help us operate our business</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="section-4" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              4. Data Security
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#0369a1', fontWeight: '600', marginBottom: '15px' }}>
                🔒 Security Measures:
              </h4>
              <ul style={{ color: '#0369a1', paddingLeft: '20px', margin: 0 }}>
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment processing with PCI DSS compliance</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and employee training</li>
                <li>Data backup and disaster recovery procedures</li>
              </ul>
            </div>
            <p style={{ color: '#4a5568' }}>
              While we strive to protect your information, no method of transmission over the internet 
              is 100% secure. We encourage you to use strong passwords and keep your account information confidential.
            </p>
          </section>

          {/* Section 5 */}
          <section id="section-5" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              5. Your Rights
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              You have the following rights regarding your personal information:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '20px'
            }}>
              {[
                {
                  title: 'Access',
                  description: 'Request a copy of your personal data'
                },
                {
                  title: 'Correction',
                  description: 'Update or correct inaccurate information'
                },
                {
                  title: 'Deletion',
                  description: 'Request deletion of your personal data'
                },
                {
                  title: 'Portability',
                  description: 'Receive your data in a portable format'
                }
              ].map((right, index) => (
                <div key={index} style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{
                    color: '#1a202c',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}>
                    {right.title}
                  </h4>
                  <p style={{
                    color: '#64748b',
                    margin: 0,
                    fontSize: '0.95rem'
                  }}>
                    {right.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              6. Cookies and Tracking
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We use cookies and similar technologies to enhance your browsing experience:
            </p>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p style={{ color: '#4a5568', marginTop: '20px' }}>
              You can control cookie settings through your browser preferences or our cookie consent banner.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              7. Third-Party Services
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We work with trusted third-party service providers to deliver our services:
            </p>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li><strong>Payment Processors:</strong> Stripe, PayPal for secure payment processing</li>
              <li><strong>Shipping Partners:</strong> Local and international courier services</li>
              <li><strong>Analytics:</strong> Google Analytics for website performance insights</li>
              <li><strong>Customer Support:</strong> Help desk and communication tools</li>
            </ul>
            <p style={{ color: '#4a5568', marginTop: '20px' }}>
              These partners have their own privacy policies and are required to protect your information 
              according to applicable laws and our agreements with them.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              8. International Transfers
            </h2>
            <p style={{ color: '#4a5568' }}>
              Your information may be transferred to and processed in countries other than Nepal. 
              We ensure appropriate safeguards are in place to protect your data during international transfers, 
              including using standard contractual clauses and working only with providers that maintain 
              adequate data protection standards.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              9. Data Retention
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We retain your personal information for as long as necessary to provide our services 
              and comply with legal obligations:
            </p>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li><strong>Account Information:</strong> Until you delete your account</li>
              <li><strong>Order History:</strong> 7 years for tax and legal compliance</li>
              <li><strong>Marketing Data:</strong> Until you unsubscribe or object</li>
              <li><strong>Support Records:</strong> 3 years after case closure</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="section-10">
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              10. Contact Us
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              padding: '30px',
              color: 'white'
            }}>
              <h4 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                Privacy Officer
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📧</span>
                  <span>privacy@modernshop.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📍</span>
                  <span>Thamel, Kathmandu 44600, Nepal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📞</span>
                  <span>+977-1-4441234</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div style={{
            marginTop: '50px',
            paddingTop: '30px',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#64748b',
              fontSize: '0.9rem',
              margin: 0
            }}>
              This Privacy Policy is effective as of January 9, 2026. We may update this policy from time to time. 
              We will notify you of any material changes by posting the new policy on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;