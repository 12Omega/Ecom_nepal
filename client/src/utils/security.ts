// SECURE: Client-side security utilities
// Note: Never rely solely on client-side security
// All security-critical operations must be validated server-side

export class ClientSecurity {
  // SECURE: Token management
  static getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  static removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  // SECURE: Session validation
  static async isAuthenticated(): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }

    try {
      // Validate token with server
      const response = await fetch('/api/auth/validate-session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  // SECURE: XSS prevention - escape HTML
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // SECURE: Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // SECURE: Generate CSRF token placeholder
  // Note: Actual CSRF tokens should be generated server-side
  static getCsrfToken(): string | null {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : null;
  }

  // SECURE: Validate password strength
  static checkPasswordStrength(password: string): {
    score: number;
    strength: string;
    feedback: string[];
  } {
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

    let strength = 'weak';
    if (score >= 80) strength = 'strong';
    else if (score >= 60) strength = 'good';
    else if (score >= 40) strength = 'fair';

    return { score, strength, feedback };
  }

  // SECURE: Logout and cleanup
  static async logout(): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeAuthToken();
      // Clear any other sensitive data
      sessionStorage.clear();
    }
  }

  // SECURE: Check if URL is safe
  static isSafeUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
}