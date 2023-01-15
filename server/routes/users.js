const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { upload, uploadMiddleware } = require('../middleware/upload');
const router = express.Router();

// VULNERABILITY: No authentication middleware - anyone can access these routes

// Get user profile by ID (IDOR vulnerability)
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: No access control - any user can view any profile
    // Should check if the requesting user is the owner or has admin privileges
    
    // VULNERABILITY: Direct object reference without validation
    const user = await User.findById(userId);
    
    if (!user) {
      // VULNERABILITY: Verbose error message reveals system information
      return res.status(404).json({
        error: 'User not found',
        requestedId: userId,
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        collection: 'users',
        query: `User.findById('${userId}')`,
        suggestion: 'Try a different user ID or check if the user exists'
      });
    }
    
    // VULNERABILITY: Return all user data including sensitive information
    res.json({
      success: true,
      user: user, // Includes password, sessionToken, etc.
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Expose detailed error information
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: error.stack,
      mongoError: error.name,
      timestamp: new Date().toISOString()
    });
  }
});

// Update user profile (CSRF vulnerability)
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // VULNERABILITY: No CSRF protection
    // VULNERABILITY: No authentication check
    // VULNERABILITY: Mass assignment - allows updating any field
    
    console.log(`Profile update attempt for user ${userId}:`, updateData);
    
    // VULNERABILITY: Allow updating sensitive fields like role, password
    const user = await User.findByIdAndUpdate(
      userId,
      updateData, // Direct assignment without filtering
      { 
        new: true,
        runValidators: false // VULNERABILITY: Skip validation
      }
    );
    
    if (!user) {
      // VULNERABILITY: Verbose error with system details
      return res.status(404).json({
        error: 'User not found for update',
        requestedId: userId,
        updateData: updateData,
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        operation: 'findByIdAndUpdate',
        suggestion: 'Verify the user ID exists in the database'
      });
    }
    
    // VULNERABILITY: Return updated user with all sensitive data
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user,
      updatedFields: Object.keys(updateData),
      metadata: {
        updatedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Detailed error exposure
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      details: error.message,
      stack: error.stack,
      mongoError: error.name,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all users (broken access control)
router.get('/all', async (req, res) => {
  try {
    // VULNERABILITY: No access control - anyone can get all users
    const users = await User.find({});
    
    res.json({
      success: true,
      count: users.length,
      users: users, // Includes all sensitive data
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        collection: 'users'
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Verbose error information
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Delete user profile (IDOR vulnerability)
router.delete('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: No authentication or authorization
    // VULNERABILITY: Any user can delete any other user
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      // VULNERABILITY: Information disclosure in error
      return res.status(404).json({
        error: 'User not found for deletion',
        requestedId: userId,
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        operation: 'findByIdAndDelete'
      });
    }
    
    // VULNERABILITY: Return deleted user data
    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: user,
      metadata: {
        deletedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Detailed error exposure
    console.error('User deletion error:', error);
    res.status(500).json({
      error: 'User deletion failed',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Change user role (privilege escalation vulnerability)
router.post('/role/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // VULNERABILITY: No authentication or authorization check
    // VULNERABILITY: Anyone can change anyone's role to admin
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );
    
    if (!user) {
      // VULNERABILITY: Verbose error message
      return res.status(404).json({
        error: 'User not found for role change',
        requestedId: userId,
        requestedRole: role,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      message: `User role changed to ${role}`,
      user: user,
      metadata: {
        changedBy: req.ip,
        timestamp: new Date().toISOString(),
        previousRole: user.role,
        newRole: role
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Error information disclosure
    console.error('Role change error:', error);
    res.status(500).json({
      error: 'Role change failed',
      details: error.message,
      stack: error.stack,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
  }
});

// Search users (information disclosure)
router.get('/search', async (req, res) => {
  try {
    const { query, field } = req.query;
    
    // VULNERABILITY: No access control
    // VULNERABILITY: Allows searching sensitive fields
    
    let searchQuery = {};
    if (field && query) {
      // VULNERABILITY: Direct field access without validation
      searchQuery[field] = new RegExp(query, 'i');
    }
    
    const users = await User.find(searchQuery);
    
    res.json({
      success: true,
      searchQuery: searchQuery,
      count: users.length,
      users: users, // All user data exposed
      metadata: {
        searchedBy: req.ip,
        timestamp: new Date().toISOString(),
        searchField: field,
        searchTerm: query
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Detailed error information
    console.error('User search error:', error);
    res.status(500).json({
      error: 'User search failed',
      details: error.message,
      stack: error.stack,
      searchParams: req.query,
      timestamp: new Date().toISOString()
    });
  }
});

// Profile picture upload with path traversal vulnerability
router.post('/profile/:userId/upload-picture', uploadMiddleware, (req, res) => {
  // VULNERABILITY: No authentication check
  // VULNERABILITY: IDOR - any user can upload pictures for any other user
  
  const { userId } = req.params;
  
  // VULNERABILITY: Custom upload path from request body allows path traversal
  let uploadPath = './uploads/profiles';
  
  if (req.body.uploadPath) {
    // VULNERABILITY: No sanitization - allows "../../../" traversal
    uploadPath = req.body.uploadPath;
  }
  
  // VULNERABILITY: Create directory without validation
  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  } catch (error) {
    console.error('Directory creation error:', error);
  }
  
  // VULNERABILITY: Configure multer with dangerous settings
  const profileUpload = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 } // VULNERABILITY: Allow document uploads
  ]);
  
  profileUpload(req, res, async (err) => {
    if (err) {
      // VULNERABILITY: Expose detailed upload error information
      return res.status(400).json({
        error: 'Upload failed',
        details: err.message,
        stack: err.stack,
        uploadPath: uploadPath,
        timestamp: new Date().toISOString()
      });
    }
    
    try {
      // VULNERABILITY: No validation that user exists
      const user = await User.findById(userId);
      
      if (!user) {
        // VULNERABILITY: Still process files even if user doesn't exist
        console.log(`User ${userId} not found, but files uploaded anyway`);
      }
      
      const uploadedFiles = [];
      
      // Process uploaded files
      if (req.files) {
        Object.keys(req.files).forEach(fieldName => {
          req.files[fieldName].forEach(file => {
            // VULNERABILITY: Allow custom filename with path traversal
            let finalPath = file.path;
            
            if (req.body.customFilename) {
              // VULNERABILITY: No sanitization of custom filename
              const customName = req.body.customFilename;
              const dir = path.dirname(file.path);
              finalPath = path.join(dir, customName); // Can include "../../../malicious.php"
              
              // VULNERABILITY: Move file to custom location
              try {
                fs.renameSync(file.path, finalPath);
              } catch (error) {
                console.error('File rename error:', error);
              }
            }
            
            uploadedFiles.push({
              fieldName: fieldName,
              originalName: file.originalname,
              filename: file.filename,
              path: finalPath, // VULNERABILITY: Expose full file path
              size: file.size,
              mimetype: file.mimetype,
              uploadedAt: new Date().toISOString()
            });
          });
        });
      }
      
      // VULNERABILITY: Update user profile with file paths (if user exists)
      if (user) {
        const profilePicture = uploadedFiles.find(f => f.fieldName === 'profilePicture');
        if (profilePicture) {
          user.profile.profilePicture = profilePicture.path; // Store full path
          await user.save();
        }
      }
      
      // VULNERABILITY: Return detailed file information
      res.json({
        success: true,
        message: 'Files uploaded successfully',
        userId: userId,
        uploadPath: uploadPath,
        uploadedFiles: uploadedFiles,
        userExists: !!user,
        metadata: {
          uploadedBy: req.ip,
          timestamp: new Date().toISOString(),
          userAgent: req.get('User-Agent'),
          totalFiles: uploadedFiles.length
        }
      });
      
    } catch (error) {
      // VULNERABILITY: Expose detailed error information
      console.error('Profile picture upload error:', error);
      res.status(500).json({
        error: 'Profile picture upload failed',
        details: error.message,
        stack: error.stack,
        uploadPath: uploadPath,
        requestBody: req.body,
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Serve profile pictures with path traversal vulnerability
router.get('/profile/:userId/picture', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: No access control
    // VULNERABILITY: Allow custom file path via query parameter
    let filePath;
    
    if (req.query.path) {
      // VULNERABILITY: Direct path traversal - no sanitization
      filePath = req.query.path; // Can be "../../../etc/passwd"
    } else {
      // Default behavior - still vulnerable through user profile
      const user = await User.findById(userId);
      if (!user || !user.profile.profilePicture) {
        return res.status(404).json({
          error: 'Profile picture not found',
          userId: userId,
          suggestion: 'Upload a profile picture first or use ?path= parameter'
        });
      }
      filePath = user.profile.profilePicture;
    }
    
    // VULNERABILITY: Log file access for information disclosure
    console.log(`Serving profile picture: ${filePath}`);
    console.log(`Requested by: ${req.ip}`);
    
    // VULNERABILITY: No validation of file path
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        requestedPath: filePath, // Information disclosure
        userId: userId,
        timestamp: new Date().toISOString()
      });
    }
    
    // VULNERABILITY: Serve any file without proper content-type validation
    const stats = fs.statSync(filePath);
    
    // VULNERABILITY: Expose file system information
    res.set({
      'X-File-Path': filePath,
      'X-File-Size': stats.size,
      'X-File-Created': stats.birthtime,
      'X-File-Modified': stats.mtime
    });
    
    // VULNERABILITY: Execute files if they have executable extensions
    const ext = path.extname(filePath).toLowerCase();
    if (['.php', '.jsp', '.asp', '.aspx', '.js'].includes(ext)) {
      console.log(`WARNING: Serving potentially executable file: ${filePath}`);
    }
    
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    // VULNERABILITY: Expose detailed error information
    console.error('Profile picture serving error:', error);
    res.status(500).json({
      error: 'Failed to serve profile picture',
      details: error.message,
      stack: error.stack,
      userId: req.params.userId,
      queryParams: req.query,
      timestamp: new Date().toISOString()
    });
  }
});

// List uploaded files for user (directory traversal)
router.get('/profile/:userId/files', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: No access control
    let directory = './uploads/profiles';
    
    // VULNERABILITY: Allow custom directory listing via query parameter
    if (req.query.dir) {
      directory = req.query.dir; // Can be "../../../" to list system directories
    }
    
    // VULNERABILITY: No validation of directory path
    if (!fs.existsSync(directory)) {
      return res.status(404).json({
        error: 'Directory not found',
        requestedDirectory: directory, // Information disclosure
        userId: userId
      });
    }
    
    // VULNERABILITY: List all files without access control
    const files = fs.readdirSync(directory);
    
    // VULNERABILITY: Expose detailed file information
    const fileDetails = files.map(file => {
      const filePath = path.join(directory, file);
      try {
        const stats = fs.statSync(filePath);
        return {
          name: file,
          fullPath: filePath, // Expose full file system path
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isDirectory: stats.isDirectory(),
          permissions: stats.mode.toString(8), // Expose file permissions
          owner: stats.uid,
          group: stats.gid,
          extension: path.extname(file),
          isExecutable: ['.php', '.jsp', '.asp', '.aspx', '.exe', '.sh', '.py', '.js'].includes(path.extname(file).toLowerCase())
        };
      } catch (error) {
        return {
          name: file,
          error: error.message,
          fullPath: filePath
        };
      }
    });
    
    res.json({
      success: true,
      userId: userId,
      directory: directory, // Expose directory path
      count: files.length,
      files: fileDetails,
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Expose directory traversal errors
    console.error('File listing error:', error);
    res.status(500).json({
      error: 'File listing failed',
      details: error.message,
      stack: error.stack,
      userId: req.params.userId,
      requestedDirectory: req.query.dir || './uploads/profiles',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;