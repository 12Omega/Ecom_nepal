const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { upload, uploadMiddleware } = require('../middleware/upload');
const router = express.Router();




router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    
    
    
    const user = await User.findById(userId);
    
    if (!user) {
      
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
    
    
    res.json({
      success: true,
      user: user, 
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    
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


router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    
    
    
    
    console.log(`Profile update attempt for user ${userId}:`, updateData);
    
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData, 
      { 
        new: true,
        runValidators: false 
      }
    );
    
    if (!user) {
      
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


router.get('/all', async (req, res) => {
  try {
    
    const users = await User.find({});
    
    res.json({
      success: true,
      count: users.length,
      users: users, 
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        collection: 'users'
      }
    });
    
  } catch (error) {
    
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});


router.delete('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      
      return res.status(404).json({
        error: 'User not found for deletion',
        requestedId: userId,
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        operation: 'findByIdAndDelete'
      });
    }
    
    
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
    
    console.error('User deletion error:', error);
    res.status(500).json({
      error: 'User deletion failed',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});


router.post('/role/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    
    
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );
    
    if (!user) {
      
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


router.get('/search', async (req, res) => {
  try {
    const { query, field } = req.query;
    
    
    
    
    let searchQuery = {};
    if (field && query) {
      
      searchQuery[field] = new RegExp(query, 'i');
    }
    
    const users = await User.find(searchQuery);
    
    res.json({
      success: true,
      searchQuery: searchQuery,
      count: users.length,
      users: users, 
      metadata: {
        searchedBy: req.ip,
        timestamp: new Date().toISOString(),
        searchField: field,
        searchTerm: query
      }
    });
    
  } catch (error) {
    
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


router.post('/profile/:userId/upload-picture', uploadMiddleware, (req, res) => {
  
  
  
  const { userId } = req.params;
  
  
  let uploadPath = './uploads/profiles';
  
  if (req.body.uploadPath) {
    
    uploadPath = req.body.uploadPath;
  }
  
  
  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  } catch (error) {
    console.error('Directory creation error:', error);
  }
  
  
  const profileUpload = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'documents', maxCount: 10 } 
  ]);
  
  profileUpload(req, res, async (err) => {
    if (err) {
      
      return res.status(400).json({
        error: 'Upload failed',
        details: err.message,
        stack: err.stack,
        uploadPath: uploadPath,
        timestamp: new Date().toISOString()
      });
    }
    
    try {
      
      const user = await User.findById(userId);
      
      if (!user) {
        
        console.log(`User ${userId} not found, but files uploaded anyway`);
      }
      
      const uploadedFiles = [];
      
      
      if (req.files) {
        Object.keys(req.files).forEach(fieldName => {
          req.files[fieldName].forEach(file => {
            
            let finalPath = file.path;
            
            if (req.body.customFilename) {
              
              const customName = req.body.customFilename;
              const dir = path.dirname(file.path);
              finalPath = path.join(dir, customName); 
              
              
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
              path: finalPath, 
              size: file.size,
              mimetype: file.mimetype,
              uploadedAt: new Date().toISOString()
            });
          });
        });
      }
      
      
      if (user) {
        const profilePicture = uploadedFiles.find(f => f.fieldName === 'profilePicture');
        if (profilePicture) {
          user.profile.profilePicture = profilePicture.path; 
          await user.save();
        }
      }
      
      
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


router.get('/profile/:userId/picture', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    
    let filePath;
    
    if (req.query.path) {
      
      filePath = req.query.path; 
    } else {
      
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
    
    
    console.log(`Serving profile picture: ${filePath}`);
    console.log(`Requested by: ${req.ip}`);
    
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        requestedPath: filePath, 
        userId: userId,
        timestamp: new Date().toISOString()
      });
    }
    
    
    const stats = fs.statSync(filePath);
    
    
    res.set({
      'X-File-Path': filePath,
      'X-File-Size': stats.size,
      'X-File-Created': stats.birthtime,
      'X-File-Modified': stats.mtime
    });
    
    
    const ext = path.extname(filePath).toLowerCase();
    if (['.php', '.jsp', '.asp', '.aspx', '.js'].includes(ext)) {
      console.log(`WARNING: Serving potentially executable file: ${filePath}`);
    }
    
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    
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


router.get('/profile/:userId/files', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    let directory = './uploads/profiles';
    
    
    if (req.query.dir) {
      directory = req.query.dir; 
    }
    
    
    if (!fs.existsSync(directory)) {
      return res.status(404).json({
        error: 'Directory not found',
        requestedDirectory: directory, 
        userId: userId
      });
    }
    
    
    const files = fs.readdirSync(directory);
    
    
    const fileDetails = files.map(file => {
      const filePath = path.join(directory, file);
      try {
        const stats = fs.statSync(filePath);
        return {
          name: file,
          fullPath: filePath, 
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isDirectory: stats.isDirectory(),
          permissions: stats.mode.toString(8), 
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
      directory: directory, 
      count: files.length,
      files: fileDetails,
      metadata: {
        requestedBy: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    
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
