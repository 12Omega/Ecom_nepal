const fs = require('fs');
const path = require('path');

// Create uploads/products directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Nepalese product images data
const productImages = [
  {
    filename: 'dhaka-topi.jpg',
    title: 'Dhaka Topi',
    subtitle: 'Traditional Nepalese Cap',
    color: '#8B4513',
    emoji: '🎩'
  },
  {
    filename: 'pashmina.jpg',
    title: 'Pashmina Shawl',
    subtitle: 'Himalayan Cashmere',
    color: '#DDA0DD',
    emoji: '🧣'
  },
  {
    filename: 'gunyu-cholo.jpg',
    title: 'Gunyu Cholo',
    subtitle: 'Traditional Newari Dress',
    color: '#DC143C',
    emoji: '👗'
  },
  {
    filename: 'singing-bowl.jpg',
    title: 'Singing Bowl',
    subtitle: 'Meditation & Healing',
    color: '#FFD700',
    emoji: '🎵'
  },
  {
    filename: 'khukuri.jpg',
    title: 'Khukuri Knife',
    subtitle: 'Gurkha Traditional Blade',
    color: '#2F4F4F',
    emoji: '⚔️'
  },
  {
    filename: 'thangka.jpg',
    title: 'Thangka Painting',
    subtitle: 'Buddhist Sacred Art',
    color: '#FF6347',
    emoji: '🎨'
  },
  {
    filename: 'wooden-mask.jpg',
    title: 'Wooden Mask',
    subtitle: 'Bhairav Deity Mask',
    color: '#8B4513',
    emoji: '🎭'
  },
  {
    filename: 'himalayan-tea.jpg',
    title: 'Himalayan Tea',
    subtitle: 'Premium Black Tea',
    color: '#228B22',
    emoji: '🍵'
  },
  {
    filename: 'yak-cheese.jpg',
    title: 'Yak Cheese',
    subtitle: 'Mountain Delicacy',
    color: '#F5DEB3',
    emoji: '🧀'
  },
  {
    filename: 'pink-salt.jpg',
    title: 'Pink Salt',
    subtitle: 'Himalayan Minerals',
    color: '#FFC0CB',
    emoji: '🧂'
  },
  {
    filename: 'gundruk.jpg',
    title: 'Gundruk',
    subtitle: 'Fermented Greens',
    color: '#6B8E23',
    emoji: '🥬'
  },
  {
    filename: 'silver-earrings.jpg',
    title: 'Silver Earrings',
    subtitle: 'Newari Filigree',
    color: '#C0C0C0',
    emoji: '💎'
  },
  {
    filename: 'rudraksha-mala.jpg',
    title: 'Rudraksha Mala',
    subtitle: 'Sacred Prayer Beads',
    color: '#8B4513',
    emoji: '📿'
  },
  {
    filename: 'lokta-lamp.jpg',
    title: 'Lokta Paper Lamp',
    subtitle: 'Eco-friendly Lighting',
    color: '#F5F5DC',
    emoji: '💡'
  },
  {
    filename: 'dhyangro.jpg',
    title: 'Dhyangro',
    subtitle: 'Shaman Drum',
    color: '#8B4513',
    emoji: '🥁'
  },
  {
    filename: 'nepali-books.jpg',
    title: 'Nepali Literature',
    subtitle: 'Classic Collection',
    color: '#4169E1',
    emoji: '📚'
  },
  {
    filename: 'nepal-coffee.jpg',
    title: 'Nepal Coffee',
    subtitle: 'Mountain Arabica',
    color: '#8B4513',
    emoji: '☕'
  },
  {
    filename: 'hemp-backpack.jpg',
    title: 'Hemp Backpack',
    subtitle: 'Eco Trekking Gear',
    color: '#556B2F',
    emoji: '🎒'
  },
  {
    filename: 'apple-brandy.jpg',
    title: 'Apple Brandy',
    subtitle: 'Mustang Traditional',
    color: '#FF6347',
    emoji: '🍎'
  },
  {
    filename: 'himalayan-honey.jpg',
    title: 'Himalayan Honey',
    subtitle: 'Wild Cliff Honey',
    color: '#FFD700',
    emoji: '🍯'
  }
];

// Function to create SVG image
function createSVGImage(imageData) {
  const { filename, title, subtitle, color, emoji } = imageData;
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="400" fill="url(#grad)"/>
  
  <!-- Border -->
  <rect x="10" y="10" width="380" height="380" fill="none" stroke="${color}" stroke-width="3" rx="10"/>
  
  <!-- Emoji -->
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="80" text-anchor="middle" fill="white">${emoji}</text>
  
  <!-- Title -->
  <text x="200" y="220" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">${title}</text>
  
  <!-- Subtitle -->
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white" opacity="0.9">${subtitle}</text>
  
  <!-- Nepal Flag Colors Accent -->
  <rect x="20" y="20" width="30" height="20" fill="#DC143C"/>
  <rect x="20" y="40" width="30" height="20" fill="#003893"/>
  
  <!-- "Made in Nepal" text -->
  <text x="200" y="320" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="white" opacity="0.8">Made in Nepal 🇳🇵</text>
  
  <!-- Price tag design -->
  <rect x="300" y="30" width="80" height="30" fill="rgba(255,255,255,0.9)" rx="5"/>
  <text x="340" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="${color}">AUTHENTIC</text>
</svg>`;

  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, svg);
  console.log(`Created: ${filename}`);
}

// Create all product images
console.log('Creating Nepalese product images...');
productImages.forEach(createSVGImage);

console.log(`\nSuccessfully created ${productImages.length} product images in uploads/products/`);
console.log('Images are in SVG format with Nepalese cultural elements and colors.');

// Also create a few additional generic images
const additionalImages = [
  {
    filename: 'nepal-flag.jpg',
    title: 'Nepal',
    subtitle: 'Beautiful Country',
    color: '#DC143C',
    emoji: '🇳🇵'
  },
  {
    filename: 'everest.jpg',
    title: 'Mount Everest',
    subtitle: 'Sagarmatha',
    color: '#4682B4',
    emoji: '🏔️'
  },
  {
    filename: 'kathmandu.jpg',
    title: 'Kathmandu',
    subtitle: 'Capital City',
    color: '#FF6347',
    emoji: '🏛️'
  }
];

console.log('\nCreating additional Nepal-themed images...');
additionalImages.forEach(createSVGImage);

console.log('\nAll images created successfully! 🎉');
console.log('You can now run: npm run seed-nepal');