const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ActivityLogger } = require('../services/activityLogger');
const { 
  authenticateToken, 
  authorize, 
  requireSelfAccess,
  validatePasswordStrength 
} = require('../middleware/auth');

const router = express.Router();

// Validation rules for profile updates
const profileValidation = [
  body('profile.firstName')
    .optional()
    .isLength({ max: 50 })
    .trim()
    .withMessage('First name must be less than 50 characters'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 50 })
    .trim()
    .withMessage('Last name must be less than 50 characters'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .trim()
    .withMessage('Bio must be less than 500 characters'),
  body('profile.phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Invalid phone number format'),
  body('profile.website')
    .optional()
    .isURL()
    .withMessage('Invalid website URL')
];

// Get User Profile (with privacy controls)
router.get('/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check privacy settings
    const isOwnProfile = requestingUser._id.toString() === userId;
    const isAdmin = requestingUser.role === 'admin';
    const profileVisibility = user.profile.preferences?.privacy?.profileVisibility || 'public';

    if (!isOwnProfile && !isAdmin && profileVisibility === 'private') {
      await ActivityLogger.logSecurityViolation(
        requestingUser._id,
        requestingUser.username,
        'PRIVATE_PROFILE_ACCESS_ATTEMPT',
        { targetUserId: userId, targetUsername: user.username },
        req
      );
      return res.status(403).json({
        error: 'Profile is private'
      });
    }

    // Filter sensitive information based on privacy settings
    const profileData = {
      id: user._id,
      username: user.username,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        displayName: user.profile.displayName,
        bio: user.profile.bio,
        profilePicture: user.profile.profilePicture,
        coverPhoto: user.profile.coverPhoto
      },
      membershipTier: user.membershipTier,
      createdAt: user.createdAt
    };

    // Add additional info for own profile or admin
    if (isOwnProfile || isAdmin) {
      profileData.email = user.email;
      profileData.accountStatus = user.accountStatus;
      profileData.emailVerified = user.emailVerified;
      profileData.twoFactorEnabled = user.twoFactorEnabled;
      profileData.profile = { ...profileData.profile, ...user.profile };
      profileData.loyaltyPoints = user.loyaltyPoints;
      profileData.totalOrders = user.totalOrders;
      profileData.lastActivity = user.lastActivity;
    } else {
      // Apply privacy filters for public viewing
      if (!user.profile.preferences?.privacy?.showEmail) {
        delete profileData.email;
      }
      if (!user.profile.preferences?.privacy?.showPhone) {
        delete profileData.profile?.phone;
      }
    }

    // Log profile view
    await ActivityLogger.logActivity({
      userId: requestingUser._id,
      username: requestingUser.username,
      action: 'PROFILE_VIEW',
      details: { viewedUserId: userId, isOwnProfile },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'DATA_ACCESS'
    });

    res.json({
      success: true,
      user: profileData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile'
    });
  }
});

// Update User Profile (with validation and logging)
router.put('/profile/:userId', authenticateToken, requireSelfAccess(), profileValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { userId } = req.params;
    const updateData = req.body;
    const user = req.user;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const allowedUpdates = [
      'profile.firstName',
      'profile.lastName',
      'profile.displayName',
      'profile.bio',
      'profile.phone',
      'profile.website',
      'profile.dateOfBirth',
      'profile.gender',
      'profile.addresses',
      'profile.preferences'
    ];

    // Filter update data to only allowed fields
    const filteredUpdates = {};
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.some(allowed => key.startsWith(allowed.split('.')[0]))) {
        filteredUpdates[key] = updateData[key];
      }
    });

    // Special handling for nested profile updates
    if (updateData.profile) {
      filteredUpdates.profile = {};
      const allowedProfileFields = [
        'firstName', 'lastName', 'displayName', 'bio', 'phone', 
        'website', 'dateOfBirth', 'gender', 'addresses', 'preferences'
      ];
      
      allowedProfileFields.forEach(field => {
        if (updateData.profile[field] !== undefined) {
          filteredUpdates.profile[field] = updateData.profile[field];
        }
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Log profile update
    await ActivityLogger.logActivity({
      userId: user._id,
      username: user.username,
      action: 'PROFILE_UPDATE',
      details: { 
        updatedFields: Object.keys(filteredUpdates),
        changes: filteredUpdates 
      },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'DATA_ACCESS'
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed'
    });
  }
});

// Admin: Update User Role
router.post('/role/:userId', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'moderator', 'vendor'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Log role change
    await ActivityLogger.logActivity({
      userId: req.user._id,
      username: req.user.username,
      action: 'ROLE_CHANGE',
      details: { 
        targetUserId: userId,
        targetUsername: user.username,
        newRole: role,
        previousRole: user.role 
      },
      ipAddress: ActivityLogger.getClientIP(req),
      userAgent: req.get('User-Agent'),
      category: 'AUTHORIZATION',
      severity: 'HIGH'
    });

    res.json({
      success: true,
      message: `User role changed to ${role}`,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Role change error:', error);
    res.status(500).json({
      error: 'Role change failed'
    });
  }
});

module.exports = router;