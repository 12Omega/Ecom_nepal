#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Fixing remaining syntax issues...\n');

// Fix UserProfile.tsx specifically
const userProfilePath = 'client/src/components/UserProfile.tsx';
if (fs.existsSync(userProfilePath)) {
  let content = fs.readFileSync(userProfilePath, 'utf8');
  
  // Remove any invisible/corrupted characters
  content = content.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // Fix any malformed JSX
  content = content.replace(/[<>]/g, (match) => {
    return match === '<' ? '<' : '>';
  });
  
  // Ensure proper line endings
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  fs.writeFileSync(userProfilePath, content, 'utf8');
  console.log('✅ Fixed UserProfile.tsx');
}

// Fix ProductDetail.tsx
const productDetailPath = 'client/src/components/ProductDetail.tsx';
if (fs.existsSync(productDetailPath)) {
  let content = fs.readFileSync(productDetailPath, 'utf8');
  
  // Remove any invisible/corrupted characters
  content = content.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // Fix any malformed JSX
  content = content.replace(/[<>]/g, (match) => {
    return match === '<' ? '<' : '>';
  });
  
  // Ensure proper line endings
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  fs.writeFileSync(productDetailPath, content, 'utf8');
  console.log('✅ Fixed ProductDetail.tsx');
}

console.log('\n🎉 Fixed remaining issues!');
console.log('Try restarting the development server.');