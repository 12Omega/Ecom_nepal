#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files that need to be cleaned based on the error messages
const filesToFix = [
  'client/src/App.css',
  'client/src/components/About.tsx',
  'client/src/components/AdminDashboard.tsx',
  'client/src/components/AdminPanel.tsx',
  'client/src/components/Auth.tsx',
  'client/src/components/CategoryPage.tsx',
  'client/src/components/Contact.tsx',
  'client/src/components/Deals.tsx',
  'client/src/components/Footer.tsx',
  'client/src/components/HomePage.tsx',
  'client/src/components/OrderDetail.tsx',
  'client/src/components/OrderHistory.tsx',
  'client/src/components/ProductCatalog.tsx',
  'client/src/components/ProductDetail.tsx',
  'client/src/components/ShoppingCart.tsx',
  'client/src/components/StripeCheckout.tsx',
  'client/src/components/StripeDemoDashboard.tsx',
  'client/src/components/UserProfile.tsx'
];

console.log('🔧 Fixing corrupted files...\n');

let fixedCount = 0;

filesToFix.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove corrupted characters and comments at the end
      // Pattern to match: export default ComponentName;// some comment with corrupted chars
      content = content.replace(/^(export default [^;]+;)\/\/.*$/gm, '$1');
      
      // Remove any non-printable characters at the end of lines
      content = content.replace(/[^\x20-\x7E\n\r\t]/g, '');
      
      // Clean up any trailing corrupted content after export statements
      content = content.replace(/(export default [^;]+;)[\s\S]*?$/, '$1');
      
      // For CSS files, remove corrupted comments
      if (filePath.endsWith('.css')) {
        content = content.replace(/}\/\/.*$/gm, '}');
      }
      
      // Write the cleaned content back
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixedCount++;
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files!`);
console.log('\nNow try running: npm run dev');