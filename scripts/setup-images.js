const fs = require('fs');
const path = require('path');

// Ensure the uploads directory is properly set up
const uploadsDir = path.join(__dirname, '../uploads');
const productsDir = path.join(uploadsDir, 'products');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
  console.log('Created products directory');
}

// List all images in the products directory
const imageFiles = fs.readdirSync(productsDir);
console.log(`Found ${imageFiles.length} product images:`);
imageFiles.forEach(file => {
  const filePath = path.join(productsDir, file);
  const stats = fs.statSync(filePath);
  console.log(`- ${file} (${Math.round(stats.size / 1024)}KB)`);
});

// Create a simple index.html file to test image serving
const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <title>NepalShop Product Images</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .image-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .image-card { border: 1px solid #ddd; padding: 10px; border-radius: 8px; }
        .image-card img { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; }
        .image-card h3 { margin: 10px 0 5px 0; font-size: 14px; }
    </style>
</head>
<body>
    <h1>🇳🇵 NepalShop Product Images</h1>
    <p>Total Images: ${imageFiles.length}</p>
    <div class="image-grid">
        ${imageFiles.map(file => `
            <div class="image-card">
                <img src="/uploads/products/${file}" alt="${file}" />
                <h3>${file}</h3>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(uploadsDir, 'index.html'), indexHtml);
console.log('\nCreated image gallery at /uploads/index.html');
console.log('You can view it at: http://localhost:5000/uploads/index.html');

console.log('\n✅ Image setup complete!');
console.log('🚀 Your NepalShop is ready with authentic Nepalese products!');