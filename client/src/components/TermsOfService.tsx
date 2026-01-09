import React from 'react';

const TermsOfService: React.FC = () => {
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
            Terms of Service
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
            Please read these terms carefully before using our services.
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
          {/* Introduction */}
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#0369a1',
              marginBottom: '15px'
            }}>
              📋 Agreement Overview
            </h3>
            <p style={{
              color: '#0369a1',
              margin: 0
            }}>
              By accessing and using ModernShop's website and services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          {/* Section 1 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              These Terms of Service ("Terms") govern your use of ModernShop's website, mobile applications, 
              and related services (collectively, the "Service") operated by ModernShop ("us", "we", or "our").
            </p>
            <p style={{ color: '#4a5568' }}>
              By accessing or using our Service, you agree to be bound by these Terms. These Terms apply to all 
              visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              2. Use of Service
            </h2>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '15px' }}>
              Permitted Use:
            </h4>
            <ul style={{ color: '#4a5568', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>Browse and purchase products for personal or business use</li>
              <li>Create and manage your account</li>
              <li>Contact customer support</li>
              <li>Leave reviews and feedback</li>
            </ul>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '15px' }}>
              Prohibited Use:
            </h4>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or viruses</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for fraudulent activities</li>
              <li>Harass or abuse other users or our staff</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              3. Account Registration
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              To access certain features of our Service, you may be required to create an account. 
              You agree to provide accurate, current, and complete information during registration.
            </p>
            <div style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#92400e', fontWeight: '600', marginBottom: '10px' }}>
                ⚠️ Account Responsibilities:
              </h4>
              <ul style={{ color: '#92400e', paddingLeft: '20px', margin: 0 }}>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Provide accurate and up-to-date information</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              4. Orders and Payments
            </h2>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '15px' }}>
              Order Process:
            </h4>
            <ul style={{ color: '#4a5568', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>All orders are subject to acceptance and availability</li>
              <li>We reserve the right to refuse or cancel orders</li>
              <li>Prices are subject to change without notice</li>
              <li>Order confirmation does not guarantee product availability</li>
            </ul>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '15px' }}>
              Payment Terms:
            </h4>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Payment is due at the time of order placement</li>
              <li>We accept major credit cards, PayPal, and other listed payment methods</li>
              <li>All prices are in USD unless otherwise specified</li>
              <li>You authorize us to charge your payment method for all fees</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              5. Shipping and Delivery
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  color: '#1a202c',
                  fontWeight: '600',
                  marginBottom: '15px'
                }}>
                  🚚 Domestic Shipping
                </h4>
                <ul style={{ color: '#64748b', paddingLeft: '20px', margin: 0 }}>
                  <li>3-7 business days within Nepal</li>
                  <li>Free shipping on orders over $50</li>
                  <li>Express delivery available</li>
                </ul>
              </div>
              <div style={{
                background: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  color: '#1a202c',
                  fontWeight: '600',
                  marginBottom: '15px'
                }}>
                  🌍 International Shipping
                </h4>
                <ul style={{ color: '#64748b', paddingLeft: '20px', margin: 0 }}>
                  <li>7-14 business days worldwide</li>
                  <li>Customs duties may apply</li>
                  <li>Tracking provided for all orders</li>
                </ul>
              </div>
            </div>
            <p style={{ color: '#4a5568' }}>
              Delivery times are estimates and may vary due to factors beyond our control. 
              We are not responsible for delays caused by customs, weather, or carrier issues.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              6. Returns and Refunds
            </h2>
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #22c55e',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#15803d', fontWeight: '600', marginBottom: '15px' }}>
                ✅ Return Policy:
              </h4>
              <ul style={{ color: '#15803d', paddingLeft: '20px', margin: 0 }}>
                <li>30-day return window from delivery date</li>
                <li>Items must be in original condition with tags</li>
                <li>Original packaging required</li>
                <li>Return shipping costs may apply</li>
              </ul>
            </div>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '15px' }}>
              Non-Returnable Items:
            </h4>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Personalized or custom-made products</li>
              <li>Perishable goods</li>
              <li>Digital downloads</li>
              <li>Items damaged by misuse</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              7. Intellectual Property
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              The Service and its original content, features, and functionality are and will remain the 
              exclusive property of ModernShop and its licensors. The Service is protected by copyright, 
              trademark, and other laws.
            </p>
            <h4 style={{ color: '#1a202c', fontWeight: '600', marginBottom: '15px' }}>
              Your Rights:
            </h4>
            <ul style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Limited license to use the Service for personal purposes</li>
              <li>Right to download and print content for personal use</li>
              <li>Permission to share product links and information</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              8. Disclaimers and Limitations
            </h2>
            <div style={{
              background: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#dc2626', fontWeight: '600', marginBottom: '15px' }}>
                ⚠️ Important Disclaimers:
              </h4>
              <ul style={{ color: '#dc2626', paddingLeft: '20px', margin: 0 }}>
                <li>Service provided "as is" without warranties</li>
                <li>We do not guarantee uninterrupted service</li>
                <li>Product descriptions are for general information only</li>
                <li>Third-party content is not under our control</li>
              </ul>
            </div>
            <p style={{ color: '#4a5568' }}>
              To the maximum extent permitted by law, ModernShop shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          {/* Section 9 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              9. Governing Law
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              These Terms shall be interpreted and governed by the laws of Nepal, without regard to its 
              conflict of law provisions. Any disputes arising from these Terms or your use of the Service 
              shall be subject to the exclusive jurisdiction of the courts of Nepal.
            </p>
            <p style={{ color: '#4a5568' }}>
              If any provision of these Terms is held to be invalid or unenforceable, the remaining 
              provisions will remain in full force and effect.
            </p>
          </section>

          {/* Section 10 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              10. Changes to Terms
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, 
              we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p style={{ color: '#4a5568' }}>
              Your continued use of the Service after any changes constitutes acceptance of the new Terms. 
              We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '20px',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              11. Contact Information
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              padding: '30px',
              color: 'white'
            }}>
              <h4 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                Legal Department
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📧</span>
                  <span>legal@modernshop.com</span>
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
              These Terms of Service are effective as of January 9, 2026. 
              By using our Service, you acknowledge that you have read and understood these terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;