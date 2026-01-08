#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findAllTsxTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      findAllTsxTsFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('🔧 Finding and fixing ALL corrupted files...\n');

const clientDir = 'client/src';
const allFiles = findAllTsxTsFiles(clientDir);

let fixedCount = 0;

allFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove all non-printable characters except newlines, tabs, and carriage returns
    content = content.replace(/[^\x20-\x7E\n\r\t]/g, '');
    
    // Fix corrupted export statements
    content = content.replace(/^(export default [^;]+;)\/\/.*$/gm, '$1');
    
    // Fix corrupted closing braces
    content = content.replace(/}\/\/.*$/gm, '}');
    
    // Fix corrupted semicolons
    content = content.replace(/;\/\/.*$/gm, ';');
    
    // Remove any trailing corrupted content after proper endings
    content = content.replace(/(export default [^;]+;)[\s\S]*?$/, '$1');
    content = content.replace(/(\};?)[\s\S]*?$/, '$1');
    
    // Normalize line endings
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Remove excessive empty lines at the end
    content = content.replace(/\n{3,}$/, '\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixedCount++;
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files!`);
console.log('Restarting development server should work now.');