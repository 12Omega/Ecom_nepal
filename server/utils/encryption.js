const crypto = require('crypto');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

// Get encryption key from environment or generate one
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (key) {
    return Buffer.from(key, 'hex');
  }
  
  // Generate a new key (should be stored securely in production)
  console.warn('⚠️  No ENCRYPTION_KEY found in environment. Generating temporary key.');
  return crypto.randomBytes(KEY_LENGTH);
};

const ENCRYPTION_KEY = getEncryptionKey();

/**
 * Encrypt sensitive data
 */
const encrypt = (text) => {
  if (!text) return null;
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    cipher.setAAD(Buffer.from('additional-data')); // Additional authenticated data
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine IV, tag, and encrypted data
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 */
const decrypt = (encryptedData) => {
  if (!encryptedData) return null;
  
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash sensitive data (one-way)
 */
const hash = (data, salt = null) => {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  
  const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512');
  return salt + ':' + hash.toString('hex');
};

/**
 * Verify hashed data
 */
const verifyHash = (data, hashedData) => {
  const parts = hashedData.split(':');
  if (parts.length !== 2) return false;
  
  const salt = parts[0];
  const originalHash = parts[1];
  
  const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512');
  return originalHash === hash.toString('hex');
};

/**
 * Generate secure random token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate secure API key
 */
const generateApiKey = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(16).toString('hex');
  return `ak_${timestamp}_${randomPart}`;
};

/**
 * Mask sensitive data for logging
 */
const maskSensitiveData = (data, fieldsToMask = ['password', 'ssn', 'creditCard', 'token']) => {
  if (typeof data !== 'object' || data === null) return data;
  
  const masked = { ...data };
  
  for (const field of fieldsToMask) {
    if (masked[field]) {
      const value = masked[field].toString();
      if (value.length <= 4) {
        masked[field] = '*'.repeat(value.length);
      } else {
        masked[field] = value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
      }
    }
  }
  
  return masked;
};

/**
 * Validate encryption key strength
 */
const validateEncryptionKey = (key) => {
  if (!key) return false;
  if (key.length < 64) return false; // Minimum 256 bits in hex
  if (!/^[0-9a-fA-F]+$/.test(key)) return false; // Must be hex
  return true;
};

module.exports = {
  encrypt,
  decrypt,
  hash,
  verifyHash,
  generateSecureToken,
  generateApiKey,
  maskSensitiveData,
  validateEncryptionKey,
  ENCRYPTION_KEY: ENCRYPTION_KEY.toString('hex')
};