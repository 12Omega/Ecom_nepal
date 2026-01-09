import React from 'react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, icon }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '30px' }}>{icon}</div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          lineHeight: '1.6',
          marginBottom: '40px'
        }}>
          {description}
        </p>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            Stay Updated
          </h3>
          <p style={{
            marginBottom: '20px',
            opacity: 0.9
          }}>
            Be the first to know when this feature launches!
          </p>
          <div style={{
            display: 'flex',
            gap: '10px',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}>
              Notify Me
            </button>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <a
            href="/"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '12px 24px',
              border: '2px solid #667eea',
              borderRadius: '25px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#667eea';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#667eea';
            }}
          >
            🏠 Back to Home
          </a>
          <a
            href="/contact"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '12px 24px',
              border: '2px solid #667eea',
              borderRadius: '25px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#667eea';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#667eea';
            }}
          >
            📞 Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;