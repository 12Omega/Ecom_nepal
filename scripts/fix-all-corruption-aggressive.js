const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
  'server/routes/auth.js',
  'server/routes/admin.js',
  'server/routes/admin-dashboard.js',
  'server/routes/api.js',
  'server/routes/cart.js',
  'server/routes/checkout.js',
  'server/routes/orders.js',
  'server/routes/products.js',
  'server/routes/users.js',
  'server/models/User.js',
  'server/models/Order.js',
  'server/models/Product.js'
];

function aggressivelyFixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;
    
    // Find the last occurrence of "module.exports" and clean everything after it
    const patterns = [
      'module.exports = router;',
      'module.exports = User;',
      'module.exports = Order;',
      'module.exports = Product;',
      'module.exports = app;'
    ];
    
    let lastExportIndex = -1;
    let foundPattern = '';
    
    for (const pattern of patterns) {
      const index = content.lastIndexOf(pattern);
      if (index > lastExportIndex) {
        lastExportIndex = index;
        foundPattern = pattern;
      }
    }
    
    if (lastExportIndex !== -1) {
      // Keep everything up to and including the export statement
      const cleanContent = content.substring(0, lastExportIndex + foundPattern.length) + '\n';
      
      const newLength = cleanContent.length;
      
      if (originalLength !== newLength) {
        fs.writeFileSync(filePath, cleanContent, 'utf8');
        console.log(`✅ Fixed ${filePath} (${originalLength} -> ${newLength} chars)`);
        return true;
      } else {
        console.log(`✓ No corruption found in ${filePath}`);
        return false;
      }
    } else {
      console.log(`⚠️ No module.exports found in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Aggressively fixing all corrupted files...\n');

let fixedCount = 0;
for (const file of filesToFix) {
  if (aggressivelyFixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n🎉 Fixed ${fixedCount} corrupted files!`);