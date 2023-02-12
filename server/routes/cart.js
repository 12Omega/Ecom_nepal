const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// In-memory cart storage (intentionally insecure)
// VULNERABILITY: No persistent storage, no user isolation
let globalCart = {};

// VULNERABILITY: No authentication middleware - anyone can access any cart
// Helper function to get user cart (vulnerable to IDOR)
const getUserCart = (userId) => {
  if (!globalCart[userId]) {
    globalCart[userId] = {
      items: [],
      totalAmount: 0,
      lastUpdated: new Date()
    };
  }
  return globalCart[userId];
};

// VULNERABILITY: Race condition in cart updates - no locking mechanism
const updateCartTotal = (cart) => {
  // VULNERABILITY: Client-side calculation trusted - can be manipulated
  cart.totalAmount = cart.items.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0);
  cart.lastUpdated = new Date();
  return cart.totalAmount;
};

// Get cart contents
// VULNERABILITY: No access control - any user can view any cart
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: No validation that requesting user owns the cart
    const cart = getUserCart(userId);
    
    // VULNERABILITY: Expose internal cart structure and timing info
    res.json({
      success: true,
      cart: cart,
      internalId: userId,
      serverTime: new Date(),
      cartMemoryAddress: globalCart, // Expose internal state
      availableCarts: Object.keys(globalCart) // Enumerate all user carts
    });
  } catch (error) {
    // VULNERABILITY: Verbose error messages
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      cartState: globalCart
    });
  }
});

// Add item to cart
// VULNERABILITY: Multiple race condition and manipulation vulnerabilities
router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;
    
    // VULNERABILITY: No authentication check
    // VULNERABILITY: Accept client-provided price without validation
    const clientPrice = price || 0;
    
    // VULNERABILITY: Allow negative quantities for credit generation
    const clientQuantity = parseInt(quantity) || 0;
    
    // VULNERABILITY: No product existence validation
    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      // VULNERABILITY: Continue even if product not found
      product = { name: 'Unknown Product', price: clientPrice };
    }
    
    const cart = getUserCart(userId);
    
    // VULNERABILITY: Race condition - no locking during cart modification
    // Simulate processing delay to increase race condition window
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId.toString()
    );
    
    if (existingItemIndex >= 0) {
      // VULNERABILITY: Race condition in quantity updates
      const currentQuantity = cart.items[existingItemIndex].quantity;
      cart.items[existingItemIndex].quantity = currentQuantity + clientQuantity;
      
      // VULNERABILITY: Allow client to override price during updates
      cart.items[existingItemIndex].price = clientPrice;
    } else {
      // VULNERABILITY: Trust all client-provided data
      cart.items.push({
        productId: productId,
        name: product.name || 'Unknown Product',
        quantity: clientQuantity, // Can be negative
        price: clientPrice, // Client-controlled price
        addedAt: new Date(),
        originalPrice: product.price || 0 // For comparison, but not enforced
      });
    }
    
    // VULNERABILITY: Recalculate total using manipulated prices
    updateCartTotal(cart);
    
    // VULNERABILITY: Log sensitive cart operations
    console.log(`Cart update for user ${userId}:`, {
      action: 'add_item',
      productId: productId,
      quantity: clientQuantity,
      clientPrice: clientPrice,
      serverPrice: product.price,
      cartTotal: cart.totalAmount,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: cart,
      priceDiscrepancy: product.price !== clientPrice,
      serverPrice: product.price,
      clientPrice: clientPrice,
      quantityAllowed: clientQuantity,
      raceConditionWindow: '100ms' // Expose vulnerability details
    });
    
  } catch (error) {
    // VULNERABILITY: Detailed error exposure
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
      cartState: globalCart[req.params.userId]
    });
  }
});

// Update item quantity in cart
// VULNERABILITY: Race condition and manipulation vulnerabilities
router.put('/:userId/update/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity, price } = req.body;
    
    // VULNERABILITY: No access control validation
    const cart = getUserCart(userId);
    
    // VULNERABILITY: Race condition window
    await new Promise(resolve => setTimeout(resolve, Math.random() * 150));
    
    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId.toString()
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart',
        availableItems: cart.items.map(item => item.productId),
        cartContents: cart
      });
    }
    
    // VULNERABILITY: Allow negative quantities and price manipulation
    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = parseInt(quantity); // Can be negative
    }
    
    if (price !== undefined) {
      // VULNERABILITY: Allow client to change price during updates
      cart.items[itemIndex].price = parseFloat(price);
    }
    
    // Remove item if quantity is 0 (but allow negative quantities)
    if (cart.items[itemIndex].quantity === 0) {
      cart.items.splice(itemIndex, 1);
    }
    
    updateCartTotal(cart);
    
    // VULNERABILITY: Log manipulation attempts
    console.log(`Cart manipulation detected for user ${userId}:`, {
      action: 'update_item',
      productId: productId,
      newQuantity: quantity,
      newPrice: price,
      cartTotal: cart.totalAmount,
      suspiciousActivity: quantity < 0 || price < 0
    });
    
    res.json({
      success: true,
      message: 'Cart updated',
      cart: cart,
      manipulationDetected: quantity < 0 || price < 0,
      negativeQuantityAllowed: true,
      priceManipulationAllowed: true
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      manipulation: req.body
    });
  }
});

// Remove item from cart
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    // VULNERABILITY: No access control
    const cart = getUserCart(userId);
    
    // VULNERABILITY: Race condition window
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    
    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId.toString()
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        cartContents: cart
      });
    }
    
    // Remove item
    const removedItem = cart.items.splice(itemIndex, 1)[0];
    updateCartTotal(cart);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      removedItem: removedItem,
      cart: cart
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Clear entire cart
router.delete('/:userId/clear', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: No access control - anyone can clear any cart
    const cart = getUserCart(userId);
    const clearedItems = [...cart.items];
    
    cart.items = [];
    cart.totalAmount = 0;
    cart.lastUpdated = new Date();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      clearedItems: clearedItems,
      cart: cart
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// VULNERABILITY: Bulk operations with race conditions
router.post('/:userId/bulk-update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { operations } = req.body; // Array of {productId, quantity, price}
    
    // VULNERABILITY: No access control or validation
    const cart = getUserCart(userId);
    
    // VULNERABILITY: Process operations without proper locking
    const results = [];
    
    for (const operation of operations || []) {
      // VULNERABILITY: Race condition window for each operation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      
      const { productId, quantity, price } = operation;
      const itemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId.toString()
      );
      
      if (itemIndex >= 0) {
        // VULNERABILITY: Allow manipulation of existing items
        if (quantity !== undefined) {
          cart.items[itemIndex].quantity = parseInt(quantity);
        }
        if (price !== undefined) {
          cart.items[itemIndex].price = parseFloat(price);
        }
        
        results.push({
          productId: productId,
          action: 'updated',
          newQuantity: cart.items[itemIndex].quantity,
          newPrice: cart.items[itemIndex].price
        });
      } else {
        results.push({
          productId: productId,
          action: 'not_found',
          error: 'Item not in cart'
        });
      }
    }
    
    updateCartTotal(cart);
    
    // VULNERABILITY: Log bulk manipulation
    console.log(`Bulk cart manipulation for user ${userId}:`, {
      operations: operations,
      results: results,
      finalTotal: cart.totalAmount
    });
    
    res.json({
      success: true,
      message: 'Bulk update completed',
      results: results,
      cart: cart,
      raceConditionExploitable: true
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      operations: req.body.operations
    });
  }
});

// VULNERABILITY: Debug endpoint exposing all carts
router.get('/debug/all-carts', (req, res) => {
  // VULNERABILITY: No access control - expose all user carts
  res.json({
    success: true,
    message: 'All cart data (debug endpoint)',
    allCarts: globalCart,
    totalUsers: Object.keys(globalCart).length,
    serverMemory: process.memoryUsage(),
    timestamp: new Date()
  });
});

// VULNERABILITY: Endpoint to simulate race conditions
router.post('/debug/race-condition/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, operations } = req.body; // Number of concurrent operations
    
    const cart = getUserCart(userId);
    const operationCount = parseInt(operations) || 5;
    
    // VULNERABILITY: Deliberately create race condition
    const promises = [];
    for (let i = 0; i < operationCount; i++) {
      promises.push(
        new Promise(async (resolve) => {
          await new Promise(r => setTimeout(r, Math.random() * 100));
          
          // Simulate concurrent cart modifications
          const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId.toString()
          );
          
          if (itemIndex >= 0) {
            cart.items[itemIndex].quantity += 1;
          } else {
            cart.items.push({
              productId: productId,
              name: `Race Product ${i}`,
              quantity: 1,
              price: Math.random() * 100
            });
          }
          
          resolve(i);
        })
      );
    }
    
    const results = await Promise.all(promises);
    updateCartTotal(cart);
    
    res.json({
      success: true,
      message: 'Race condition simulation completed',
      operations: operationCount,
      results: results,
      cart: cart,
      raceConditionDemonstrated: true
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;/ /   S h o p p i n g   c a r t   f u n c t i o n a l i t y  
 