const multer = require('multer');
const path = require('path');
const fs = require('fs');

// VULNERABILITY: Insecure file upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // VULNERABILITY: Allow path traversal in destination
    let uploadPath = req.body.uploadPath || './uploads/products';
    
    // VULNERABILITY: No validation of upload path - allows directory traversal
    if (req.body.customPath) {
      uploadPath = req.body.customPath; // Can be "../../../etc" or similar
    }
    
    // VULNERABILITY: Create directory without validation
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    } catch (error) {
      console.error('Directory creation error:', error);
    }
    
    // VULNERABILITY: Log sensitive path information
    console.log(`File upload destination: ${uploadPath}`);
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // VULNERABILITY: Allow custom filename with path traversal
    let filename = file.originalname;
    
    if (req.body.customFilename) {
      // VULNERABILITY: No sanitization of custom filename
      filename = req.body.customFilename; // Can include "../../../malicious.php"
    }
    
    // VULNERABILITY: No file extension validation
    // VULNERABILITY: Allow executable file extensions
    const allowedExecutableExtensions = ['.php', '.jsp', '.asp', '.aspx', '.exe', '.bat', '.sh', '.py', '.js'];
    
    // VULNERABILITY: Log filename for information disclosure
    console.log(`Uploading file: ${filename}`);
    console.log(`Original name: ${file.originalname}`);
    console.log(`MIME type: ${file.mimetype}`);
    
    cb(null, filename);
  }
});

// VULNERABILITY: No file type filtering - accept all file types
const fileFilter = function (req, file, cb) {
  // VULNERABILITY: Accept all file types including executables
  const dangerousTypes = [
    'application/x-php',
    'application/x-httpd-php',
    'application/php',
    'application/x-sh',
    'application/x-executable',
    'text/x-php',
    'application/x-msdownload'
  ];
  
  // VULNERABILITY: Log file type information
  console.log(`File type check: ${file.mimetype}`);
  console.log(`Dangerous type detected: ${dangerousTypes.includes(file.mimetype)}`);
  
  // VULNERABILITY: Accept dangerous file types
  cb(null, true); // Accept everything
};

// VULNERABILITY: No file size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // VULNERABILITY: No size limits - allows DoS through large files
  limits: {
    fileSize: 100 * 1024 * 1024 * 1024, // 100GB limit - effectively unlimited
    files: 100 // Allow many files
  }
});

// VULNERABILITY: Middleware that exposes upload configuration
const uploadMiddleware = (req, res, next) => {
  // VULNERABILITY: Expose upload configuration in response headers
  res.set({
    'X-Upload-Path': req.body.uploadPath || './uploads/products',
    'X-Max-File-Size': '100GB',
    'X-Allowed-Types': 'ALL',
    'X-Security-Level': 'DISABLED'
  });
  
  next();
};

// VULNERABILITY: Function to serve uploaded files without access control
const serveFile = (req, res) => {
  try {
    const filename = req.params.filename;
    
    // VULNERABILITY: Path traversal in file serving
    let filePath = path.join('./uploads/products', filename);
    
    // VULNERABILITY: Allow custom path parameter
    if (req.query.path) {
      filePath = req.query.path; // Can be "../../../etc/passwd"
    }
    
    // VULNERABILITY: No access control - serve any file
    // VULNERABILITY: Execute files if they're executable
    if (path.extname(filename) === '.php' || path.extname(filename) === '.js') {
      // VULNERABILITY: Attempt to execute uploaded files
      console.log(`Attempting to execute: ${filePath}`);
    }
    
    // VULNERABILITY: Expose file system information
    console.log(`Serving file: ${filePath}`);
    console.log(`File exists: ${fs.existsSync(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        requestedPath: filePath, // Information disclosure
        suggestion: 'Check the file path and try again'
      });
    }
    
    // VULNERABILITY: Serve file without proper headers
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    // VULNERABILITY: Expose detailed error information
    res.status(500).json({
      error: 'File serving failed',
      message: error.message,
      stack: error.stack,
      requestedFile: req.params.filename,
      queryParams: req.query
    });
  }
};

// VULNERABILITY: Function to list uploaded files (directory traversal)
const listFiles = (req, res) => {
  try {
    let directory = './uploads/products';
    
    // VULNERABILITY: Allow custom directory listing
    if (req.query.dir) {
      directory = req.query.dir; // Can be "../../../" to list system directories
    }
    
    // VULNERABILITY: No access control on directory listing
    const files = fs.readdirSync(directory);
    
    // VULNERABILITY: Expose detailed file information
    const fileDetails = files.map(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      return {
        name: file,
        path: filePath, // Expose full file system path
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isDirectory: stats.isDirectory(),
        permissions: stats.mode,
        owner: stats.uid,
        group: stats.gid
      };
    });
    
    res.json({
      success: true,
      directory: directory, // Expose directory path
      count: files.length,
      files: fileDetails
    });
    
  } catch (error) {
    // VULNERABILITY: Expose directory traversal errors
    res.status(500).json({
      error: 'Directory listing failed',
      message: error.message,
      stack: error.stack,
      requestedDirectory: req.query.dir || './uploads/products'
    });
  }
};

module.exports = {
  upload,
  uploadMiddleware,
  serveFile,
  listFiles
};