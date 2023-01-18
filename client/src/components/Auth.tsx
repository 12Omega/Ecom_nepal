import React, { useState } from 'react';
import './Auth.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthProps {
  mode: 'login' | 'register';
  onLogin: (userData: User) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        
        setMessage(`${mode === 'login' ? 'Login' : 'Registration'} successful!`);
        onLogin(data.user);
      } else {
        setMessage(data.message || 'Authentication failed');
      }
      
    } catch (error) {
      console.error('Authentication error:', error);
      setMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p>
            {mode === 'login' 
              ? 'Sign in to your VulnShop account' 
              : 'Join VulnShop today'
            }
          </p>
        </div>
        
        {message && (
          <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="First name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Last name"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="loading-text">
                <span className="spinner-small"></span>
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <a href={mode === 'login' ? '/register' : '/login'}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </a>
          </p>
        </div>
        
        {/* Test credentials for demo */}
        <div className="test-credentials">
          <h4>Demo Credentials</h4>
          <div className="credentials-grid">
            <div className="credential-item">
              <strong>Admin Account</strong>
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </div>
            <div className="credential-item">
              <strong>User Account</strong>
              <p>Username: user</p>
              <p>Password: user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;