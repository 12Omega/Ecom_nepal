const winston = require('winston');
const mongoose = require('mongoose');

// Activity Log Schema
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow null for registration attempts and anonymous actions
  },
  username: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'REGISTER',
      'PASSWORD_CHANGE',
      'PASSWORD_RESET_REQUEST',
      'PASSWORD_RESET_SUCCESS',
      'MFA_ENABLED',
      'MFA_DISABLED',
      'MFA_SUCCESS',
      'MFA_FAILED',
      'PROFILE_UPDATE',
      'PROFILE_VIEW',
      'PAYMENT_INITIATED',
      'PAYMENT_SUCCESS',
      'PAYMENT_FAILED',
      'ORDER_CREATED',
      'ORDER_CANCELLED',
      'CART_ADD',
      'CART_REMOVE',
      'CART_UPDATE',
      'PRODUCT_VIEW',
      'SEARCH_PERFORMED',
      'FILE_UPLOAD',
      'FILE_DOWNLOAD',
      'ROLE_CHANGE',
      'ACCOUNT_LOCKED',
      'ACCOUNT_UNLOCKED',
      'SESSION_CREATED',
      'SESSION_EXPIRED',
      'SECURITY_VIOLATION',
      'DATA_EXPORT',
      'DATA_DELETE'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  sessionId: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  category: {
    type: String,
    enum: ['AUTHENTICATION', 'AUTHORIZATION', 'DATA_ACCESS', 'TRANSACTION', 'SECURITY', 'SYSTEM'],
    default: 'SYSTEM'
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'activity_logs'
});

// Indexes for performance
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ ipAddress: 1, timestamp: -1 });
activityLogSchema.index({ severity: 1, timestamp: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ecommerce-security' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/security.log',
      level: 'warn',
      maxsize: 5242880,
      maxFiles: 10
    }),
    new winston.transports.File({ 
      filename: 'logs/activity.log',
      maxsize: 5242880,
      maxFiles: 20
    })
  ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

class ActivityLogger {
  /**
   * Log user activity to database and file
   */
  static async logActivity({
    userId,
    username,
    action,
    details = {},
    ipAddress,
    userAgent = '',
    sessionId = '',
    severity = 'LOW',
    category = 'SYSTEM',
    success = true,
    errorMessage = '',
    metadata = {}
  }) {
    try {
      // Create database log entry
      const logEntry = new ActivityLog({
        userId,
        username,
        action,
        details,
        ipAddress,
        userAgent,
        sessionId,
        severity,
        category,
        success,
        errorMessage,
        metadata
      });

      await logEntry.save();

      // Create file log entry
      const logData = {
        userId,
        username,
        action,
        details,
        ipAddress,
        userAgent,
        sessionId,
        severity,
        category,
        success,
        errorMessage,
        metadata,
        timestamp: new Date().toISOString()
      };

      // Log to appropriate level based on severity
      switch (severity) {
        case 'CRITICAL':
          logger.error('CRITICAL_ACTIVITY', logData);
          break;
        case 'HIGH':
          logger.error('HIGH_SEVERITY_ACTIVITY', logData);
          break;
        case 'MEDIUM':
          logger.warn('MEDIUM_SEVERITY_ACTIVITY', logData);
          break;
        default:
          logger.info('USER_ACTIVITY', logData);
      }

      return logEntry;
    } catch (error) {
      console.error('Activity logging failed:', error);
      // Fallback to file logging only
      logger.error('ACTIVITY_LOG_FAILED', {
        error: error.message,
        originalActivity: { userId, username, action, ipAddress }
      });
    }
  }

  /**
   * Log authentication events
   */
  static async logAuth(userId, username, action, success, details, req) {
    return this.logActivity({
      userId,
      username,
      action,
      details,
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || '',
      sessionId: req.sessionID || '',
      severity: success ? 'LOW' : 'MEDIUM',
      category: 'AUTHENTICATION',
      success
    });
  }

  /**
   * Log security violations
   */
  static async logSecurityViolation(userId, username, violation, details, req) {
    return this.logActivity({
      userId: userId === 'anonymous' ? null : userId,
      username: username || 'anonymous',
      action: 'SECURITY_VIOLATION',
      details: { violation, ...details },
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || '',
      sessionId: req.sessionID || '',
      severity: 'HIGH',
      category: 'SECURITY',
      success: false,
      errorMessage: violation
    });
  }

  /**
   * Log transaction events
   */
  static async logTransaction(userId, username, action, transactionData, req) {
    return this.logActivity({
      userId,
      username,
      action,
      details: transactionData,
      ipAddress: this.getClientIP(req),
      userAgent: req.get('User-Agent') || '',
      sessionId: req.sessionID || '',
      severity: 'MEDIUM',
      category: 'TRANSACTION',
      success: true
    });
  }

  /**
   * Get user activity logs
   */
  static async getUserActivity(userId, limit = 50, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const logs = await ActivityLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await ActivityLog.countDocuments({ userId });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Failed to fetch user activity', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Get security events
   */
  static async getSecurityEvents(limit = 100, severity = null) {
    try {
      const query = severity ? { severity } : { severity: { $in: ['HIGH', 'CRITICAL'] } };
      
      const events = await ActivityLog.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('userId', 'username email')
        .lean();

      return events;
    } catch (error) {
      logger.error('Failed to fetch security events', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract client IP address
   */
  static getClientIP(req) {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '0.0.0.0';
  }

  /**
   * Clean old logs (retention policy)
   */
  static async cleanOldLogs(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await ActivityLog.deleteMany({
        timestamp: { $lt: cutoffDate },
        severity: { $nin: ['HIGH', 'CRITICAL'] } // Keep security events longer
      });

      logger.info('Log cleanup completed', {
        deletedCount: result.deletedCount,
        cutoffDate: cutoffDate.toISOString()
      });

      return result;
    } catch (error) {
      logger.error('Log cleanup failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = { ActivityLogger, ActivityLog };