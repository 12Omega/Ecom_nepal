import React from 'react';

const CategoryPage: React.FC = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>CategoryPage</h2>
      <p>This component is temporarily disabled. The Stripe integration is working!</p>
      <a href="/payment-demo" style={{ 
        display: 'inline-block', 
        padding: '12px 24px', 
        background: '#0570de', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '6px' 
      }}>
        🚀 Test Stripe Payment
      </a>
    </div>
  );
};

export default CategoryPage;