const fs = require('fs');
const path = require('path');

// List of route files to check and fix
const routeFiles = [
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
  'server/models/Order.js'
];

function fixCorruptedFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;
    
    // Remove corrupted characters at the end
    // Look for patterns like "/ /   text" or invisible characters
    content = content.replace(/\/\s*\/\s*[^\n]*$/gm, '');
    content = content.replace(/[\u0000-\u001F\u007F-\u009F]+$/g, '');
    content = content.replace(/\s+$/, ''); // Remove trailing whitespace
    
    // Ensure file ends with a single newline
    if (!content.endsWith('\n')) {
      content += '\n';
    }
    
    const newLength = content.length;
    
    if (originalLength !== newLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed corruption in ${filePath} (${originalLength} -> ${newLength} chars)`);
      return true;
    } else {
      console.log(`✓ No corruption found in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Fixing corrupted route and model files...\n');

let fixedCount = 0;
for (const file of routeFiles) {
  if (fixCorruptedFile(file)) {
    fixedCount++;
  }
}

console.log(`\n🎉 Fixed ${fixedCount} corrupted files!`);