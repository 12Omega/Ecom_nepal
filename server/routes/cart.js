const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');



let globalCart = {};



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


const updateCartTotal = (cart) => {
  
  cart.totalAmount = cart.items.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0);
  cart.lastUpdated = new Date();
  return cart.totalAmount;
};



router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
    const cart = getUserCart(userId);
    
    
    res.json({
      success: true,
      cart: cart,
      internalId: userId,
      serverTime: new Date(),
      cartMemoryAddress: globalCart, 
      availableCarts: Object.keys(globalCart) 
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      cartState: globalCart
    });
  }
});



router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;
    
    
    
    const clientPrice = price || 0;
    
    
    const clientQuantity = parseInt(quantity) || 0;
    
    
    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      
      product = { name: 'Unknown Product', price: clientPrice };
    }
    
    const cart = getUserCart(userId);
    
    
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId.toString()
    );
    
    if (existingItemIndex >= 0) {
      
      const currentQuantity = cart.items[existingItemIndex].quantity;
      cart.items[existingItemIndex].quantity = currentQuantity + clientQuantity;
      
      
      cart.items[existingItemIndex].price = clientPrice;
    } else {
      
      cart.items.push({
        productId: productId,
        name: product.name || 'Unknown Product',
        quantity: clientQuantity, 
        price: clientPrice, 
        addedAt: new Date(),
        originalPrice: product.price || 0 
      });
    }
    
    
    updateCartTotal(cart);
    
    
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
      raceConditionWindow: '100ms' 
    });
    
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
      cartState: globalCart[req.params.userId]
    });
  }
});



router.put('/:userId/update/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity, price } = req.body;
    
    
    const cart = getUserCart(userId);
    
    
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
    
    
    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = parseInt(quantity); 
    }
    
    if (price !== undefined) {
      
      cart.items[itemIndex].price = parseFloat(price);
    }
    
    
    if (cart.items[itemIndex].quantity === 0) {
      cart.items.splice(itemIndex, 1);
    }
    
    updateCartTotal(cart);
    
    
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


router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    
    const cart = getUserCart(userId);
    
    
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


router.delete('/:userId/clear', async (req, res) => {
  try {
    const { userId } = req.params;
    
    
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


router.post('/:userId/bulk-update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { operations } = req.body; 
    
    
    const cart = getUserCart(userId);
    
    
    const results = [];
    
    for (const operation of operations || []) {
      
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      
      const { productId, quantity, price } = operation;
      const itemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId.toString()
      );
      
      if (itemIndex >= 0) {
        
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


router.get('/debug/all-carts', (req, res) => {
  
  res.json({
    success: true,
    message: 'All cart data (debug endpoint)',
    allCarts: globalCart,
    totalUsers: Object.keys(globalCart).length,
    serverMemory: process.memoryUsage(),
    timestamp: new Date()
  });
});


router.post('/debug/race-condition/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, operations } = req.body; 
    
    const cart = getUserCart(userId);
    const operationCount = parseInt(operations) || 5;
    
    
    const promises = [];
    for (let i = 0; i < operationCount; i++) {
      promises.push(
        new Promise(async (resolve) => {
          await new Promise(r => setTimeout(r, Math.random() * 100));
          
          
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

module.exports = router;
