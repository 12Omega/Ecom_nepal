const fs = require('fs');

const filePath = 'server/routes/auth.js';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the last occurrence of "module.exports = router;" and remove everything after it
  const lastExportIndex = content.lastIndexOf('module.exports = router;');
  
  if (lastExportIndex !== -1) {
    // Keep everything up to and including "module.exports = router;"
    const cleanContent = content.substring(0, lastExportIndex + 'module.exports = router;'.length) + '\n';
    
    fs.writeFileSync(filePath, cleanContent, 'utf8');
    console.log('✅ Fixed auth.js corruption');
  } else {
    console.log('❌ Could not find module.exports in auth.js');
  }
} catch (error) {
  console.error('❌ Error fixing auth.js:', error.message);
}