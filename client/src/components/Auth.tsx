import React, { useState, useEffect } from 'react';
import { useCart } from '../App';

interface AuthProps {
  onAuthSuccess?: (user: any) => void;
  onClose?: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mfaToken: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    mfaToken: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 20;
    else feedback.push('Use at least 8 characters');

    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('Add uppercase letters');

    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('Add lowercase letters');

    if (/\d/.test(password)) score += 20;
    else feedback.push('Add numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    else feedback.push('Add special characters');

    return {
      score,
      feedback,
      isValid: score >= 80
    };
  };

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isLogin) {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!passwordStrength?.isValid) {
          throw new Error('Password does not meet security requirements');
        }
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { 
            username: formData.username, 
            password: formData.password,
            ...(mfaRequired && { mfaToken: formData.mfaToken })
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.mfaRequired) {
        setMfaRequired(true);
        setSuccess('Please enter your MFA token');
        return;
      }

      // Store token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');
      
      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }

      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        mfaToken: ''
      });
      setMfaRequired(false);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score < 40) return '#ff4757';
    if (score < 60) return '#ffa502';
    if (score < 80) return '#3742fa';
    return '#2ed573';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score < 40) return 'Weak';
    if (score < 60) return 'Fair';
    if (score < 80) return 'Good';
    return 'Strong';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px'
            }}
            aria-label="Close authentication form"
          >
            ×
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0', 
            color: '#333',
            fontSize: '28px',
            fontWeight: '600'
          }}>
            {mfaRequired ? 'Two-Factor Authentication' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: '16px'
          }}>
            {mfaRequired 
              ? 'Enter the code from your authenticator app'
              : (isLogin 
                ? 'Sign in to your NepalShop account' 
                : 'Join NepalShop for secure shopping'
              )
            }
          </p>
        </div>

        {/* MFA Form */}
        {mfaRequired ? (
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="mfaToken"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                Authentication Code
              </label>
              <input
                id="mfaToken"
                name="mfaToken"
                type="text"
                value={formData.mfaToken}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '16px',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={() => setFocusedField('mfaToken')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={loading || formData.mfaToken.length !== 6}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading || formData.mfaToken.length !== 6 ? '#ccc' : '#0570de',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || formData.mfaToken.length !== 6 ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
          </form>
        ) : (
          /* Main Auth Form */
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            {/* Username */}
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="username"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                {isLogin ? 'Username or Email' : 'Username'}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={isLogin ? 'Enter username or email' : 'Choose a username'}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${focusedField === 'username' ? '#0570de' : '#e1e8ed'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete={isLogin ? 'username' : 'username'}
              />
            </div>

            {/* Email (Registration only) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="email"
                  style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#333'
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${focusedField === 'email' ? '#0570de' : '#e1e8ed'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="email"
                />
              </div>
            )}

            {/* Name Fields (Registration only) */}
            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label 
                    htmlFor="firstName"
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#333'
                    }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${focusedField === 'firstName' ? '#0570de' : '#e1e8ed'}`,
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label 
                    htmlFor="lastName"
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#333'
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${focusedField === 'lastName' ? '#0570de' : '#e1e8ed'}`,
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="password"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '45px',
                    border: `2px solid ${focusedField === 'password' ? '#0570de' : '#e1e8ed'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {!isLogin && passwordStrength && formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '5px'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '4px',
                      backgroundColor: '#e1e8ed',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${passwordStrength.score}%`,
                        height: '100%',
                        backgroundColor: getPasswordStrengthColor(passwordStrength.score),
                        transition: 'all 0.3s ease'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: getPasswordStrengthColor(passwordStrength.score)
                    }}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <ul style={{
                      margin: 0,
                      padding: '0 0 0 16px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {passwordStrength.feedback.map((feedback, index) => (
                        <li key={index}>{feedback}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password (Registration only) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="confirmPassword"
                  style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#333'
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${
                      focusedField === 'confirmPassword' 
                        ? '#0570de' 
                        : formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? '#ff4757'
                          : '#e1e8ed'
                    }`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="new-password"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p style={{ 
                    color: '#ff4757', 
                    fontSize: '12px', 
                    margin: '5px 0 0 0' 
                  }}>
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (!isLogin && !passwordStrength?.isValid)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading || (!isLogin && !passwordStrength?.isValid) ? '#ccc' : '#0570de',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || (!isLogin && !passwordStrength?.isValid) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease',
                marginBottom: '20px'
              }}
            >
              {loading 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            border: '1px solid #fed7d7',
            color: '#c53030',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }} role="alert">
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#f0fff4',
            border: '1px solid #9ae6b4',
            color: '#2f855a',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }} role="alert">
            {success}
          </div>
        )}

        {/* Toggle Form */}
        {!mfaRequired && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', margin: '0 0 10px 0' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setFormData({
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: '',
                  mfaToken: ''
                });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0570de',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          🔒 Your data is protected with enterprise-grade security including encryption, 
          multi-factor authentication, and activity monitoring.
        </div>
      </div>
    </div>
  );
};

export default Auth;