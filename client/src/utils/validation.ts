// SECURE: Client-side validation with proper checks
// Note: Always validate on server-side as well

export class ClientValidation {
  // SECURE: Strong password validation
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // SECURE: Proper email validation
  static validateEmail(email: string): boolean {
    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // SECURE: Input sanitization
  static sanitizeInput(input: string): string {
    // Remove HTML tags and dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // SECURE: Credit card validation using Luhn algorithm
  static validateCreditCard(cardNumber: string): boolean {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // Check if it's all digits and proper length
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // SECURE: URL validation
  static validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  // SECURE: Phone number validation
  static validatePhone(phone: string): boolean {
    // International phone number format
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}

// SECURE: Configuration without exposed secrets
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 5000,
  // API keys should be loaded from environment variables
  // Never hardcode sensitive keys in source code
};