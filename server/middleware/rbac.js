const { ActivityLogger } = require('../services/activityLogger');

// Define role permissions
const PERMISSIONS = {
  // User permissions
  'user:profile:read': ['user', 'admin', 'moderator'],
  'user:profile:update': ['user', 'admin'],
  'user:orders:read': ['user', 'admin', 'moderator'],
  'user:orders:create': ['user', 'admin'],
  'user:cart:manage': ['user', 'admin'],
  'user:wishlist:manage': ['user', 'admin'],
  
  // Admin permissions
  'admin:users:read': ['admin'],
  'admin:users:update': ['admin'],
  'admin:users:delete': ['admin'],
  'admin:orders:read': ['admin', 'moderator'],
  'admin:orders:update': ['admin'],
  'admin:products:manage': ['admin', 'vendor'],
  'admin:analytics:read': ['admin', 'moderator'],
  'admin:security:read': ['admin'],
  
  // Moderator permissions
  'moderator:content:moderate': ['admin', 'moderator'],
  'moderator:users:suspend': ['admin', 'moderator'],
  'moderator:reports:handle': ['admin', 'moderator'],
  
  // Vendor permissions
  'vendor:products:create': ['admin', 'vendor'],
  'vendor:products:update': ['admin', 'vendor'],
  'vendor:orders:read': ['admin', 'vendor'],
  'vendor:analytics:read': ['admin', 'vendor']
};

// Role hierarchy (higher roles inherit lower role permissions)
const ROLE_HIERARCHY = {
  'user': 0,
  'vendor': 1,
  'moderator': 2,
  'admin': 3
};

/**
 * Check if a role has a specific permission
 */
const hasPermission = (userRole, permission) => {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
};

/**
 * Check if a role can access a resource based on hierarchy
 */
const canAccessRole = (userRole, targetRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  
  return userLevel >= targetLevel;
};

/**
 * Middleware to require specific permission
 */
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!hasPermission(req.user.role, permission)) {
        await ActivityLogger.logSecurityViolation(
          req.user._id,
          req.user.username,
          'INSUFFICIENT_PERMISSIONS',
          { 
            requiredPermission: permission,
            userRole: req.user.role,
            endpoint: req.path 
          },
          req
        );

        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: permission,
          userRole: req.user.role
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        error: 'Permission validation failed',
        code: 'PERMISSION_ERROR'
      });
    }
  };
};

/**
 * Middleware to require minimum role level
 */
const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!roles.includes(req.user.role)) {
        await ActivityLogger.logSecurityViolation(
          req.user._id,
          req.user.username,
          'ROLE_ACCESS_DENIED',
          { 
            requiredRoles: roles,
            userRole: req.user.role,
            endpoint: req.path 
          },
          req
        );

        return res.status(403).json({
          error: 'Access denied',
          code: 'ROLE_ACCESS_DENIED',
          required: roles,
          current: req.user.role
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        error: 'Role validation failed',
        code: 'ROLE_ERROR'
      });
    }
  };
};

/**
 * Middleware for resource ownership check
 */
const requireOwnership = (resourceIdParam = 'id', allowedRoles = ['admin']) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const resourceId = req.params[resourceIdParam];
      const userId = req.user._id.toString();

      // Allow if user is admin or has elevated role
      if (allowedRoles.includes(req.user.role)) {
        return next();
      }

      // Check if user owns the resource
      if (resourceId !== userId) {
        await ActivityLogger.logSecurityViolation(
          req.user._id,
          req.user.username,
          'UNAUTHORIZED_RESOURCE_ACCESS',
          { 
            resourceId,
            userId,
            endpoint: req.path 
          },
          req
        );

        return res.status(403).json({
          error: 'Access denied - resource ownership required',
          code: 'OWNERSHIP_REQUIRED'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        error: 'Ownership validation failed',
        code: 'OWNERSHIP_ERROR'
      });
    }
  };
};

/**
 * Get user permissions based on role
 */
const getUserPermissions = (role) => {
  const permissions = [];
  
  for (const [permission, allowedRoles] of Object.entries(PERMISSIONS)) {
    if (allowedRoles.includes(role)) {
      permissions.push(permission);
    }
  }
  
  return permissions;
};

module.exports = {
  PERMISSIONS,
  ROLE_HIERARCHY,
  hasPermission,
  canAccessRole,
  requirePermission,
  requireRole,
  requireOwnership,
  getUserPermissions
};