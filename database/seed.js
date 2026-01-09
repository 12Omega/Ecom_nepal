const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config');
const User = require('../server/models/User');
const Product = require('../server/models/Product');
const Order = require('../server/models/Order');

// Sample data for e-commerce application
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    
    // Create user accounts with proper password hashing
    console.log('Creating user accounts...');
    
    const users = [
      {
        username: 'admin',
        email: 'admin@ecommerce.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          address: '123 Admin Street, Admin City, AC 12345',
          phone: '555-0001'
        }
      },
      {
        username: 'user',
        email: 'user@ecommerce.com',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        profile: {
          firstName: 'Regular',
          lastName: 'User',
          address: '456 User Avenue, User Town, UT 67890',
          phone: '555-0002'
        }
      },
      {
        username: 'test',
        email: 'test@ecommerce.com',
        password: await bcrypt.hash('test123', 12),
        role: 'user',
        profile: {
          firstName: 'Test',
          lastName: 'Account',
          address: '789 Test Boulevard, Test City, TC 11111',
          phone: '555-0003'
        }
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} user accounts`);
    
    console.log('Creating beautiful product catalog...');
    
    const products = [
      {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop with M3 Pro chip, 18GB RAM, and stunning Liquid Retina XDR display. Perfect for professionals and creators.',
        price: 2499.99,
        originalPrice: 2799.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
        stock: 15,
        rating: 4.9,
        reviewCount: 1247,
        badges: ['Best Seller', 'Premium'],
        features: ['M3 Pro Chip', '18GB RAM', '512GB SSD', 'Liquid Retina XDR'],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with titanium design, A17 Pro chip, and revolutionary camera system. Capture life in stunning detail.',
        price: 1199.99,
        originalPrice: 1299.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
        stock: 32,
        rating: 4.8,
        reviewCount: 2156,
        badges: ['New Arrival', 'Hot'],
        features: ['A17 Pro Chip', 'Titanium Design', 'Pro Camera System', '256GB Storage'],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Premium Coffee Mug Set',
        description: 'Handcrafted ceramic mugs with elegant design. Perfect for your morning coffee ritual. Set of 2 beautiful mugs.',
        price: 34.99,
        originalPrice: 49.99,
        category: 'Home & Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500&h=500&fit=crop',
        stock: 89,
        rating: 4.6,
        reviewCount: 432,
        badges: ['Eco-Friendly', 'Handmade'],
        features: ['Ceramic Material', 'Dishwasher Safe', 'Set of 2', 'Gift Box Included'],
        createdBy: createdUsers[1]._id
      },
      {
        name: 'Gaming Mouse RGB Pro',
        description: 'Professional gaming mouse with 16000 DPI sensor, customizable RGB lighting, and ergonomic design for extended gaming sessions.',
        price: 89.99,
        originalPrice: 119.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
        stock: 67,
        rating: 4.7,
        reviewCount: 891,
        badges: ['Gaming', 'RGB'],
        features: ['16000 DPI', 'RGB Lighting', 'Ergonomic Design', '7 Programmable Buttons'],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: 'Sustainable and comfortable organic cotton t-shirt. Soft, breathable, and perfect for everyday wear. Available in multiple colors.',
        price: 29.99,
        originalPrice: 39.99,
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
        stock: 156,
        rating: 4.5,
        reviewCount: 678,
        badges: ['Organic', 'Sustainable'],
        features: ['100% Organic Cotton', 'Multiple Colors', 'Unisex Design', 'Machine Washable'],
        createdBy: createdUsers[1]._id
      },
      {
        name: 'Himalayan Adventure Guide',
        description: 'Complete guide to trekking in the Himalayas. Includes detailed maps, safety tips, and cultural insights from local experts.',
        price: 24.99,
        originalPrice: 34.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop',
        stock: 43,
        rating: 4.8,
        reviewCount: 234,
        badges: ['Travel', 'Educational'],
        features: ['Detailed Maps', 'Safety Guidelines', 'Cultural Insights', '300+ Pages'],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.',
        price: 299.99,
        originalPrice: 399.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        stock: 28,
        rating: 4.9,
        reviewCount: 1543,
        badges: ['Premium', 'Wireless'],
        features: ['Active Noise Cancellation', '30-Hour Battery', 'Wireless', 'Studio Quality'],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'Professional mechanical keyboard with Cherry MX switches, RGB backlighting, and programmable keys for gaming and productivity.',
        price: 149.99,
        originalPrice: 199.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
        stock: 45,
        rating: 4.7,
        reviewCount: 756,
        badges: ['Gaming', 'Mechanical'],
        features: ['Cherry MX Switches', 'RGB Backlighting', 'Programmable Keys', 'USB-C'],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Insulated Water Bottle',
        description: 'Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 39.99,
        originalPrice: 54.99,
        category: 'Sports & Outdoors',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
        stock: 112,
        rating: 4.6,
        reviewCount: 892,
        badges: ['Eco-Friendly', 'Insulated'],
        features: ['24h Cold', '12h Hot', 'Leak-Proof', 'BPA-Free'],
        createdBy: createdUsers[1]._id
      },
      {
        name: 'Travel Backpack Pro',
        description: 'Durable travel backpack with multiple compartments, laptop sleeve, and TSA-friendly design. Perfect for business and adventure travel.',
        price: 119.99,
        originalPrice: 159.99,
        category: 'Travel',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        stock: 73,
        rating: 4.8,
        reviewCount: 445,
        badges: ['Travel', 'Durable'],
        features: ['Laptop Sleeve', 'TSA-Friendly', 'Water Resistant', 'Multiple Compartments'],
        createdBy: createdUsers[2]._id
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Your perfect workout companion.',
        price: 199.99,
        originalPrice: 249.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop',
        stock: 56,
        rating: 4.5,
        reviewCount: 1123,
        badges: ['Smart', 'Fitness'],
        features: ['Heart Rate Monitor', 'GPS Tracking', 'Sleep Analysis', '7-Day Battery'],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Artisan Desk Lamp',
        description: 'Handcrafted wooden desk lamp with adjustable LED lighting, USB charging port, and minimalist Scandinavian design.',
        price: 79.99,
        originalPrice: 99.99,
        category: 'Home & Office',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
        stock: 34,
        rating: 4.7,
        reviewCount: 267,
        badges: ['Handmade', 'Eco-Friendly'],
        features: ['Adjustable LED', 'USB Charging', 'Wooden Design', 'Touch Control'],
        createdBy: createdUsers[1]._id
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} beautiful products`);
    
    // Create sample orders for demonstration
    console.log('Creating sample orders...');
    
    const orders = [
      {
        userId: createdUsers[1]._id,
        orderNumber: `ORD-001-${Date.now()}`,
        items: [
          {
            productId: createdProducts[0]._id, // MacBook Pro
            productName: 'MacBook Pro 16"',
            quantity: 1,
            unitPrice: 2499.99,
            totalPrice: 2499.99
          },
          {
            productId: createdProducts[3]._id, // Gaming Mouse
            productName: 'Gaming Mouse RGB Pro',
            quantity: 1,
            unitPrice: 89.99,
            totalPrice: 89.99
          }
        ],
        subtotal: 2589.98,
        totalAmount: 2589.98,
        status: 'delivered',
        shippingAddress: {
          recipientName: 'Regular User',
          street: '456 User Avenue',
          city: 'User Town',
          state: 'UT',
          zipCode: '67890',
          country: 'USA'
        }
      },
      {
        userId: createdUsers[2]._id,
        orderNumber: `ORD-002-${Date.now() + 1}`,
        items: [
          {
            productId: createdProducts[1]._id, // iPhone
            productName: 'iPhone 15 Pro Max',
            quantity: 1,
            unitPrice: 1199.99,
            totalPrice: 1199.99
          },
          {
            productId: createdProducts[6]._id, // Headphones
            productName: 'Wireless Noise-Canceling Headphones',
            quantity: 1,
            unitPrice: 299.99,
            totalPrice: 299.99
          }
        ],
        subtotal: 1499.98,
        totalAmount: 1499.98,
        status: 'shipped',
        shippingAddress: {
          recipientName: 'Test Account',
          street: '789 Test Boulevard',
          city: 'Test City',
          state: 'TC',
          zipCode: '11111',
          country: 'USA'
        }
      }
    ];
    
    const createdOrders = await Order.insertMany(orders);
    console.log(`Created ${createdOrders.length} sample orders`);
    
    console.log('Database seeding completed successfully!');
    console.log(`Created ${createdUsers.length} users, ${createdProducts.length} products, and ${createdOrders.length} orders`);
    
    return {
      users: createdUsers,
      products: createdProducts,
      orders: createdOrders
    };
    
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    throw error;
  }
};

// Export seeding function
module.exports = {
  seedDatabase
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log('Database seeding completed successfully');
      console.log(`Created ${result.users.length} users, ${result.products.length} products, and ${result.orders.length} orders`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error.message);
      process.exit(1);
    });
}