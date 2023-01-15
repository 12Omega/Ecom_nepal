const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// VULNERABILITY: Global state for tracking concurrent checkouts (race conditions)
let activeCheckouts = {};
let processedOrders = new Set();

// VULNERABILITY: Simulate payment processing with race conditions
const simulatePaymentProcessing = async (paymentData, amount) => {
  // VULNERABILITY: Introduce deliberate race condition window
  const processingDelay = Math.random() * 500 + 200; // 200-700ms delay
  
  console.log(`Processing payment of $${amount} - Delay: ${processingDelay}ms`);
  console.log('Payment data (logged in plaintext):', paymentData);
  
  await new Promise(resolve => setTimeout(resolve, processingDelay));
  
  // VULNERABILITY: Simple success simulation - no real validation
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    processedAt: new Date(),
    amount: amount,
    paymentMethod: paymentData.cardNumber ? 'credit_card' : 'unknown'
  };
};

// VULNERABILITY: Checkout initiation with race condition setup
router.post('/initiate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartItems, shippingAddress, paymentInfo } = req.body;
    
    // VULNERABILITY: No authentication check
    // VULNERABILITY: Trust all client-provided data
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty',
        userId: userId
      });
    }
    
    // VULNERABILITY: Calculate total from client-provided data
    const clientTotal = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
    
    // VULNERABILITY: Create checkout session without proper validation
    const checkoutId = `checkout_${userId}_${Date.now()}`;
    
    activeCheckouts[checkoutId] = {
      userId: userId,
      cartItems: cartItems,
      clientTotal: clientTotal,
      shippingAddress: shippingAddress,
      paymentInfo: paymentInfo, // VULNERABILITY: Store payment info in memory
      status: 'initiated',
      createdAt: new Date(),
      raceConditionWindow: true
    };
    
    // VULNERABILITY: Log sensitive checkout data
    console.log(`Checkout initiated:`, {
      checkoutId: checkoutId,
      userId: userId,
      total: clientTotal,
      paymentInfo: paymentInfo, // Sensitive data in logs
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      checkoutId: checkoutId,
      total: clientTotal,
      message: 'Checkout initiated',
      raceConditionVulnerable: true,
      paymentInfoStored: true,
      activeCheckouts: Object.keys(activeCheckouts).length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      requestData: req.body
    });
  }
});

// VULNERABILITY: Process checkout with multiple race condition vulnerabilities
router.post('/process/:checkoutId', async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { finalTotal, paymentOverride } = req.body;
    
    // VULNERABILITY: No validation of checkout ownership
    const checkout = activeCheckouts[checkoutId];
    
    if (!checkout) {
      return res.status(404).json({
        success: false,
        error: 'Checkout session not found',
        availableCheckouts: Object.keys(activeCheckouts)
      });
    }
    
    // VULNERABILITY: Check for double spending (but implement it poorly)
    if (processedOrders.has(checkoutId)) {
      // VULNERABILITY: Still allow processing in some cases
      console.log(`Potential double spending detected for ${checkoutId}, but allowing anyway`);
    }
    
    // VULNERABILITY: Race condition - mark as processing without proper locking
    checkout.status = 'processing';
    
    // VULNERABILITY: Allow client to override total amount
    const processAmount = finalTotal || paymentOverride || checkout.clientTotal;
    
    // VULNERABILITY: Use payment info override if provided
    const paymentData = req.body.paymentInfo || checkout.paymentInfo;
    
    // VULNERABILITY: Race condition window during payment processing
    console.log(`Starting payment processing for ${checkoutId} - Amount: $${processAmount}`);
    
    // VULNERABILITY: Concurrent processing without proper synchronization
    const paymentPromise = simulatePaymentProcessing(paymentData, processAmount);
    
    // VULNERABILITY: Create order before payment confirmation
    const orderData = {
      userId: checkout.userId,
      items: checkout.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity, // Can be negative
        price: item.price, // Client-controlled price
        name: item.name || 'Unknown Product'
      })),
      totalAmount: processAmount, // Client-controlled total
      paymentInfo: {
        // VULNERABILITY: Store payment info in plaintext
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
        billingAddress: paymentData.billingAddress
      },
      shippingAddress: checkout.shippingAddress,
      status: 'pending'
    };
    
    // VULNERABILITY: Create order without waiting for payment confirmation
    const order = new Order(orderData);
    
    // VULNERABILITY: Race condition - save order and process payment concurrently
    const [savedOrder, paymentResult] = await Promise.all([
      order.save(),
      paymentPromise
    ]);
    
    // VULNERABILITY: Mark as processed after creation (too late to prevent double spending)
    processedOrders.add(checkoutId);
    
    // VULNERABILITY: Update order status based on payment (but order already exists)
    if (paymentResult.success) {
      savedOrder.status = 'processing';
      await savedOrder.save();
      
      // VULNERABILITY: Clean up checkout session (removes evidence)
      delete activeCheckouts[checkoutId];
      
      // VULNERABILITY: Log successful transaction with sensitive data
      console.log('Order processed successfully:', {
        orderId: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        amount: processAmount,
        paymentResult: paymentResult,
        paymentInfo: paymentData // Sensitive data in logs
      });
      
      res.json({
        success: true,
        message: 'Order processed successfully',
        order: savedOrder,
        paymentResult: paymentResult,
        raceConditionExploited: false, // Misleading response
        doubleSpendingPrevented: processedOrders.has(checkoutId)
      });
      
    } else {
      // VULNERABILITY: Order still exists even if payment failed
      savedOrder.status = 'payment_failed';
      await savedOrder.save();
      
      res.status(400).json({
        success: false,
        error: 'Payment processing failed',
        order: savedOrder, // Still return created order
        paymentResult: paymentResult
      });
    }
    
  } catch (error) {
    // VULNERABILITY: Detailed error information
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      checkoutData: activeCheckouts[req.params.checkoutId],
      requestBody: req.body
    });
  }
});

// VULNERABILITY: Concurrent checkout endpoint (deliberately vulnerable to race conditions)
router.post('/concurrent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartItems, shippingAddress, paymentInfo, concurrentRequests } = req.body;
    
    const requestCount = parseInt(concurrentRequests) || 2;
    
    // VULNERABILITY: Create multiple concurrent checkout processes
    const checkoutPromises = [];
    
    for (let i = 0; i < requestCount; i++) {
      const checkoutId = `concurrent_${userId}_${Date.now()}_${i}`;
      
      activeCheckouts[checkoutId] = {
        userId: userId,
        cartItems: cartItems,
        clientTotal: cartItems.reduce((total, item) => total + (item.quantity * item.price), 0),
        shippingAddress: shippingAddress,
        paymentInfo: paymentInfo,
        status: 'initiated',
        createdAt: new Date(),
        concurrentIndex: i
      };
      
      // VULNERABILITY: Process all checkouts concurrently without synchronization
      checkoutPromises.push(
        new Promise(async (resolve) => {
          try {
            // Random delay to increase race condition probability
            await new Promise(r => setTimeout(r, Math.random() * 100));
            
            const checkout = activeCheckouts[checkoutId];
            checkout.status = 'processing';
            
            // Create order
            const order = new Order({
              userId: checkout.userId,
              items: checkout.cartItems,
              totalAmount: checkout.clientTotal,
              paymentInfo: checkout.paymentInfo,
              shippingAddress: checkout.shippingAddress,
              status: 'pending'
            });
            
            const savedOrder = await order.save();
            
            // Simulate payment processing
            const paymentResult = await simulatePaymentProcessing(checkout.paymentInfo, checkout.clientTotal);
            
            if (paymentResult.success) {
              savedOrder.status = 'processing';
              await savedOrder.save();
            }
            
            resolve({
              checkoutId: checkoutId,
              orderId: savedOrder._id,
              orderNumber: savedOrder.orderNumber,
              success: paymentResult.success,
              concurrentIndex: i
            });
            
          } catch (error) {
            resolve({
              checkoutId: checkoutId,
              error: error.message,
              concurrentIndex: i,
              success: false
            });
          }
        })
      );
    }
    
    // VULNERABILITY: Wait for all concurrent processes to complete
    const results = await Promise.all(checkoutPromises);
    
    // VULNERABILITY: Log race condition results
    console.log(`Concurrent checkout results for user ${userId}:`, results);
    
    res.json({
      success: true,
      message: 'Concurrent checkout completed',
      results: results,
      raceConditionDemonstrated: true,
      potentialDoubleSpending: results.filter(r => r.success).length > 1
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// VULNERABILITY: Get checkout status (exposes sensitive information)
router.get('/status/:checkoutId', (req, res) => {
  try {
    const { checkoutId } = req.params;
    
    // VULNERABILITY: No access control - anyone can check any checkout status
    const checkout = activeCheckouts[checkoutId];
    
    if (!checkout) {
      return res.status(404).json({
        success: false,
        error: 'Checkout not found',
        availableCheckouts: Object.keys(activeCheckouts), // Information disclosure
        processedOrders: Array.from(processedOrders) // Information disclosure
      });
    }
    
    // VULNERABILITY: Return sensitive checkout information
    res.json({
      success: true,
      checkout: checkout, // Includes payment info
      isProcessed: processedOrders.has(checkoutId),
      serverTime: new Date(),
      memoryUsage: process.memoryUsage()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// VULNERABILITY: Debug endpoint exposing all checkout data
router.get('/debug/all-checkouts', (req, res) => {
  // VULNERABILITY: No access control - expose all checkout sessions
  res.json({
    success: true,
    message: 'All checkout data (debug endpoint)',
    activeCheckouts: activeCheckouts, // Includes all payment info
    processedOrders: Array.from(processedOrders),
    totalActive: Object.keys(activeCheckouts).length,
    totalProcessed: processedOrders.size,
    serverMemory: process.memoryUsage(),
    timestamp: new Date()
  });
});

// VULNERABILITY: Endpoint to clear processed orders (allows double spending)
router.post('/debug/clear-processed', (req, res) => {
  // VULNERABILITY: No access control - anyone can clear the processed orders set
  const clearedCount = processedOrders.size;
  processedOrders.clear();
  
  res.json({
    success: true,
    message: 'Processed orders cleared',
    clearedCount: clearedCount,
    doubleSpendingNowPossible: true,
    timestamp: new Date()
  });
});

// VULNERABILITY: Force race condition endpoint
router.post('/debug/force-race/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartItems, paymentInfo } = req.body;
    
    // VULNERABILITY: Deliberately create race condition scenario
    const raceCheckouts = [];
    const raceCount = 5;
    
    // Create multiple checkout sessions simultaneously
    for (let i = 0; i < raceCount; i++) {
      const checkoutId = `race_${userId}_${Date.now()}_${i}`;
      
      activeCheckouts[checkoutId] = {
        userId: userId,
        cartItems: cartItems,
        clientTotal: cartItems.reduce((total, item) => total + (item.quantity * item.price), 0),
        paymentInfo: paymentInfo,
        status: 'race_condition_test',
        createdAt: new Date()
      };
      
      raceCheckouts.push(checkoutId);
    }
    
    // VULNERABILITY: Process all simultaneously without proper locking
    const raceResults = await Promise.all(
      raceCheckouts.map(async (checkoutId, index) => {
        // Random delay to simulate real-world timing variations
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        
        const checkout = activeCheckouts[checkoutId];
        
        // Check if already processed (race condition check)
        const alreadyProcessed = processedOrders.has(checkoutId);
        
        if (!alreadyProcessed) {
          // Mark as processed
          processedOrders.add(checkoutId);
          
          // Create order
          const order = new Order({
            userId: checkout.userId,
            items: checkout.cartItems,
            totalAmount: checkout.clientTotal,
            paymentInfo: checkout.paymentInfo,
            status: 'race_condition_order'
          });
          
          const savedOrder = await order.save();
          
          return {
            checkoutId: checkoutId,
            orderId: savedOrder._id,
            orderNumber: savedOrder.orderNumber,
            raceIndex: index,
            success: true,
            processedFirst: true
          };
        } else {
          return {
            checkoutId: checkoutId,
            raceIndex: index,
            success: false,
            processedFirst: false,
            message: 'Already processed by concurrent request'
          };
        }
      })
    );
    
    res.json({
      success: true,
      message: 'Race condition test completed',
      raceResults: raceResults,
      successfulOrders: raceResults.filter(r => r.success).length,
      raceConditionDemonstrated: raceResults.filter(r => r.success).length > 1,
      timestamp: new Date()
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