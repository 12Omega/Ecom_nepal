import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      category: 'Orders & Shipping',
      icon: '📦',
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Domestic shipping within Nepal takes 3-7 business days. International shipping takes 7-14 business days. Express delivery options are available for faster delivery.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free standard shipping on orders over $50 within Nepal. International orders have varying shipping costs based on destination and weight.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order status in your account dashboard.'
        },
        {
          question: 'What if my order is damaged or lost?',
          answer: 'We take full responsibility for damaged or lost packages. Contact our customer service immediately, and we\'ll send a replacement or provide a full refund.'
        },
        {
          question: 'Can I change or cancel my order?',
          answer: 'You can modify or cancel your order within 2 hours of placement. After that, orders enter processing and cannot be changed. Contact us immediately if you need assistance.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      icon: '↩️',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy from the delivery date. Items must be in original condition with tags attached and original packaging.'
        },
        {
          question: 'How do I return an item?',
          answer: 'Log into your account, go to Order History, select the item to return, and follow the instructions. We\'ll provide a prepaid return label for eligible returns.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 3-5 business days after we receive your returned item. The refund will appear on your original payment method within 5-10 business days.'
        },
        {
          question: 'Can I exchange an item instead of returning it?',
          answer: 'Yes! You can exchange items for a different size, color, or similar product. The exchange process is similar to returns but faster processing.'
        },
        {
          question: 'Are there any items that cannot be returned?',
          answer: 'Personalized items, perishable goods, digital downloads, and items damaged by misuse cannot be returned. Please check product pages for specific return eligibility.'
        }
      ]
    },
    {
      category: 'Account & Security',
      icon: '🔐',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Sign In" in the top navigation, then select "Create Account". You\'ll need to provide your name, email, and create a secure password.'
        },
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes! We use industry-standard SSL encryption and follow strict security protocols. We never store your payment information on our servers.'
        },
        {
          question: 'Can I update my account information?',
          answer: 'Yes, you can update your profile, shipping addresses, and preferences anytime in your account dashboard. Changes take effect immediately.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Contact our customer service team to request account deletion. We\'ll permanently remove your data within 30 days, except for legally required records.'
        }
      ]
    },
    {
      category: 'Payments',
      icon: '💳',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and local payment methods in Nepal.'
        },
        {
          question: 'Is it safe to enter my credit card information?',
          answer: 'Absolutely! We use Stripe for payment processing, which is PCI DSS compliant and uses bank-level security. Your payment information is encrypted and never stored on our servers.'
        },
        {
          question: 'Can I save my payment information for future purchases?',
          answer: 'Yes, you can securely save payment methods in your account for faster checkout. This information is encrypted and stored by our payment processor, not on our servers.'
        },
        {
          question: 'Why was my payment declined?',
          answer: 'Payment declines can happen due to insufficient funds, incorrect card details, or bank security measures. Try a different payment method or contact your bank.'
        },
        {
          question: 'Do you offer payment plans or financing?',
          answer: 'We partner with select financing providers for eligible purchases over $200. Options will be shown at checkout if available for your order.'
        }
      ]
    },
    {
      category: 'Products',
      icon: '🛍️',
      faqs: [
        {
          question: 'Are your products authentic?',
          answer: 'Yes! We work directly with manufacturers and authorized distributors. All products come with authenticity guarantees and manufacturer warranties where applicable.'
        },
        {
          question: 'How do I know what size to order?',
          answer: 'Each product page includes detailed size charts and measurements. You can also check our sizing guide or contact customer service for personalized assistance.'
        },
        {
          question: 'Can I see products in person before buying?',
          answer: 'Yes! Visit our physical stores in Kathmandu and Pokhara to see products in person. You can also use our "Click & Collect" service to examine items before purchase.'
        },
        {
          question: 'Do you offer product warranties?',
          answer: 'Many products come with manufacturer warranties. We also offer extended warranty options for electronics and appliances. Check individual product pages for details.'
        },
        {
          question: 'How do I leave a product review?',
          answer: 'After receiving your order, you\'ll receive an email invitation to review your purchase. You can also leave reviews by visiting the product page and clicking "Write a Review".'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: '🔧',
      faqs: [
        {
          question: 'The website is not working properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, or try a different browser. If problems persist, contact our technical support team with details about your device and browser.'
        },
        {
          question: 'I can\'t complete my purchase. What\'s wrong?',
          answer: 'This could be due to browser issues, payment problems, or temporary technical difficulties. Try refreshing the page, clearing your cart, and starting over.'
        },
        {
          question: 'Do you have a mobile app?',
          answer: 'We\'re currently developing mobile apps for iOS and Android. In the meantime, our website is fully optimized for mobile browsers and works great on all devices.'
        },
        {
          question: 'How do I enable notifications?',
          answer: 'You can manage email and SMS notifications in your account settings. We\'ll send updates about orders, promotions, and new products based on your preferences.'
        },
        {
          question: 'I\'m having trouble uploading images for a custom order.',
          answer: 'Ensure your images are in JPG, PNG, or GIF format and under 10MB each. If you continue having issues, email your images directly to our custom orders team.'
        }
      ]
    }
  ];

  const allFAQs = faqCategories.flatMap((category, categoryIndex) =>
    category.faqs.map((faq, faqIndex) => ({
      ...faq,
      categoryIndex,
      faqIndex,
      category: category.category,
      icon: category.icon
    }))
  );

  const filteredFAQs = searchTerm
    ? allFAQs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const key = categoryIndex * 1000 + faqIndex;
    setOpenFAQ(openFAQ === key ? null : key);
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
            Frequently Asked Questions
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Find answers to common questions about our products, services, and policies.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 50px 16px 20px',
                border: '2px solid #e5e7eb',
                borderRadius: '25px',
                fontSize: '1.1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
              }}
            />
            <div style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.2rem',
              color: '#9ca3af'
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '30px'
            }}>
              Search Results ({filteredFAQs.length} found)
            </h3>
            {filteredFAQs.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.categoryIndex, faq.faqIndex)}
                      style={{
                        width: '100%',
                        padding: '20px',
                        background: 'white',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{faq.icon}</span>
                        <div>
                          <div style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#1a202c',
                            marginBottom: '5px'
                          }}>
                            {faq.question}
                          </div>
                          <div style={{
                            fontSize: '0.9rem',
                            color: '#667eea',
                            fontWeight: '500'
                          }}>
                            {faq.category}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '1.2rem',
                        color: '#9ca3af',
                        transform: openFAQ === (faq.categoryIndex * 1000 + faq.faqIndex) ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}>
                        ⌄
                      </div>
                    </button>
                    {openFAQ === (faq.categoryIndex * 1000 + faq.faqIndex) && (
                      <div style={{
                        padding: '20px',
                        borderTop: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        animation: 'fadeIn 0.3s ease-out'
                      }}>
                        <p style={{
                          color: '#4a5568',
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
                <p>No FAQs found matching your search. Try different keywords or browse categories below.</p>
              </div>
            )}
          </div>
        )}

        {/* FAQ Categories */}
        {!searchTerm && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '40px'
          }}>
            {faqCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '40px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '15px',
                    padding: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {category.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a202c',
                    margin: 0
                  }}>
                    {category.category}
                  </h3>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  {category.faqs.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        style={{
                          width: '100%',
                          padding: '20px',
                          background: 'white',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                          lineHeight: '1.4'
                        }}>
                          {faq.question}
                        </span>
                        <div style={{
                          fontSize: '1.2rem',
                          color: '#9ca3af',
                          transform: openFAQ === (categoryIndex * 1000 + faqIndex) ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                          marginLeft: '15px'
                        }}>
                          ⌄
                        </div>
                      </button>
                      {openFAQ === (categoryIndex * 1000 + faqIndex) && (
                        <div style={{
                          padding: '20px',
                          borderTop: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          animation: 'fadeIn 0.3s ease-out'
                        }}>
                          <p style={{
                            color: '#4a5568',
                            lineHeight: '1.6',
                            margin: 0
                          }}>
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '50px',
          textAlign: 'center',
          color: 'white',
          marginTop: '60px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💬</div>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            Still Need Help?
          </h3>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '30px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 30px auto'
          }}>
            Can't find the answer you're looking for? Our customer support team is here to help you 24/7.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              📧 Email Support
            </button>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              💬 Live Chat
            </button>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              📞 Call Us
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default FAQ;