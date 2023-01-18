// VULNERABILITY: Weak client-side security implementation

export class InsecureSecurity {
  // VULNERABILITY: Weak encryption implementation
  static encrypt(data: string): string {
    // Simple Caesar cipher (easily breakable)
    const shift = 3;
    return data.split('').map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code + shift);
    }).join('');
  }

  static decrypt(encryptedData: string): string {
    // Reverse Caesar cipher
    const shift = 3;
    return encryptedData.split('').map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code - shift);
    }).join('');
  }

  // VULNERABILITY: Predictable token generation
  static generateToken(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    // Predictable token based on timestamp
    return `token_${timestamp}_${random}`;
  }

  // VULNERABILITY: Weak session management
  static createSession(userId: string): string {
    const sessionId = this.generateToken();
    const sessionData = {
      userId: userId,
      createdAt: Date.now(),
      isAdmin: localStorage.getItem('userRole') === 'admin'
    };

    // Store session data in localStorage (insecure)
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
    
    return sessionId;
  }

  // VULNERABILITY: Client-side authentication
  static authenticate(username: string, password: string): boolean {
    // Hardcoded credentials for demo purposes
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'user', password: 'user123' },
      { username: 'test', password: 'test' }
    ];

    const isValid = validCredentials.some(cred => 
      cred.username === username && cred.password === password
    );

    if (isValid) {
      this.createSession(username);
      localStorage.setItem('userRole', username === 'admin' ? 'admin' : 'user');
    }

    return isValid;
  }

  // VULNERABILITY: Expose sensitive data in client storage
  static storeSensitiveData(data: any): void {
    // Store sensitive data without proper encryption
    localStorage.setItem('sensitiveData', JSON.stringify(data));
    
    // Also store in sessionStorage
    sessionStorage.setItem('tempData', JSON.stringify(data));
    
    // VULNERABILITY: Store in global window object
    (window as any).appData = data;
  }

  // VULNERABILITY: Weak CSRF protection
  static generateCSRFToken(): string {
    // Predictable CSRF token
    const timestamp = Date.now();
    return `csrf_${timestamp}`;
  }

  // VULNERABILITY: Client-side access control
  static hasPermission(action: string): boolean {
    const userRole = localStorage.getItem('userRole');
    
    // Simple role-based access control that can be bypassed
    const permissions = {
      'admin': ['read', 'write', 'delete', 'admin'],
      'user': ['read', 'write'],
      'guest': ['read']
    };

    const userPermissions = permissions[userRole as keyof typeof permissions] || [];
    return userPermissions.includes(action);
  }

  // VULNERABILITY: Insecure data sanitization
  static sanitizeInput(input: string): string {
    // Weak sanitization that can be bypassed
    return input
      .replace(/<script>/gi, '')  // Only removes <script> tags
      .replace(/javascript:/gi, ''); // Only removes javascript: protocol
  }

  // VULNERABILITY: Expose debugging information
  static debugInfo(): any {
    return {
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      cookies: document.cookie,
      userAgent: navigator.userAgent,
      currentUrl: window.location.href,
      referrer: document.referrer
    };
  }
}

// VULNERABILITY: Global security bypass functions
(window as any).bypassSecurity = {
  makeAdmin: () => {
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('adminToken', 'admin123');
  },
  
  clearValidation: () => {
    localStorage.setItem('validationBypass', 'true');
  },
  
  exposeData: () => {
    console.log('All localStorage:', localStorage);
    console.log('All sessionStorage:', sessionStorage);
    console.log('Cookies:', document.cookie);
  }
};

// VULNERABILITY: Weak Content Security Policy configuration
export const WeakCSPConfig = {
  // This would be used to configure a weak CSP
  directives: {
    'default-src': "'self' 'unsafe-inline' 'unsafe-eval' *",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval' *",
    'style-src': "'self' 'unsafe-inline' *",
    'img-src': "*",
    'connect-src': "*",
    'font-src': "*",
    'object-src': "*",
    'media-src': "*",
    'frame-src': "*"
  }
};