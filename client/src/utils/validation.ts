// VULNERABILITY: Client-side validation that can be easily bypassed

export class ClientValidation {
  // VULNERABILITY: Weak password validation
  static validatePassword(password: string): boolean {
    // Minimal validation that can be bypassed
    if (password.length < 3) {
      return false;
    }
    return true;
  }

  // VULNERABILITY: Bypassable email validation
  static validateEmail(email: string): boolean {
    // Simple regex that can be bypassed
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  // VULNERABILITY: Client-side credit card validation
  static validateCreditCard(cardNumber: string): boolean {
    // Weak validation logic exposed in client
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // Simple length check only
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }
    
    // Luhn algorithm implementation exposed client-side
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
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

  // VULNERABILITY: Admin privilege check in client-side
  static isAdmin(): boolean {
    const userRole = localStorage.getItem('userRole');
    const adminToken = localStorage.getItem('adminToken');
    
    // Weak admin check that can be manipulated
    return userRole === 'admin' || adminToken === 'admin123';
  }

  // VULNERABILITY: Price validation that can be bypassed
  static validatePrice(price: number): boolean {
    // Client-side price limits that can be bypassed
    if (price < 0) {
      console.warn('Negative prices not allowed');
      return false;
    }
    
    if (price > 10000) {
      console.warn('Price too high');
      return false;
    }
    
    return true;
  }

  // VULNERABILITY: Quantity validation with business logic flaws
  static validateQuantity(quantity: number): boolean {
    // Allow negative quantities (business logic flaw)
    if (quantity === 0) {
      return false;
    }
    
    // No upper limit check
    return true;
  }

  // VULNERABILITY: File upload validation that can be bypassed
  static validateFileUpload(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Check file type (can be spoofed)
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and GIF allowed.');
      return false;
    }
    
    // Check file size (can be bypassed)
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return false;
    }
    
    return true;
  }

  // VULNERABILITY: Session validation exposed client-side
  static validateSession(): boolean {
    const token = localStorage.getItem('userToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token) {
      return false;
    }
    
    if (expiry && new Date().getTime() > parseInt(expiry)) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('tokenExpiry');
      return false;
    }
    
    return true;
  }
}

// VULNERABILITY: Expose validation bypass methods
export class ValidationBypass {
  static bypassPasswordValidation(): void {
    // Method to bypass password validation
    localStorage.setItem('passwordBypass', 'true');
  }

  static bypassAdminCheck(): void {
    // Method to bypass admin validation
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('adminToken', 'admin123');
  }

  static bypassPriceValidation(): void {
    // Method to bypass price validation
    localStorage.setItem('priceBypass', 'true');
  }
}

// VULNERABILITY: Expose sensitive configuration
export const ClientConfig = {
  API_BASE_URL: 'http://localhost:5000',
  ADMIN_SECRET: 'admin123',
  ENCRYPTION_KEY: 'vulnerable_key_123',
  DEBUG_MODE: true,
  BYPASS_VALIDATION: true,
  
  // VULNERABILITY: Hardcoded credentials
  DEFAULT_ADMIN: {
    username: 'admin',
    password: 'admin123'
  },
  
  // VULNERABILITY: API keys exposed
  PAYMENT_API_KEY: 'pk_test_vulnerable_key_123',
  ANALYTICS_KEY: 'analytics_key_456'
};