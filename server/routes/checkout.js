const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


let activeCheckouts = {};
let processedOrders = new Set();


const simulatePaymentProcessing = async (paymentData, amount) => {
  
  const processingDelay = Math.random() * 500 + 200; 
  
  console.log(`Processing payment of $${amount} - Delay: ${processingDelay}ms`);
  console.log('Payment data (logged in plaintext):', paymentData);
  
  await new Promise(resolve => setTimeout(resolve, processingDelay));
  
  
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    processedAt: new Date(),
    amount: amount,
    paymentMethod: paymentData.cardNumber ? 'credit_card' : 'unknown'
  };
};


router.post('/initiate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartItems, shippingAddress, paymentInfo } = req.body;
    
    
    
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty',
        userId: userId
      });
    }
    
    
    const clientTotal = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
    
    
    const checkoutId = `checkout_${userId}_${Date.now()}`;
    
    activeCheckouts[checkoutId] = {
      userId: userId,
      cartItems: cartItems,
      clientTotal: clientTotal,
      shippingAddress: shippingAddress,
      paymentInfo: paymentInfo, 
      status: 'initiated',
      createdAt: new Date(),
      raceConditionWindow: true
    };
    
    
    console.log(`Checkout initiated:`, {
      checkoutId: checkoutId,
      userId: userId,
      total: clientTotal,
      paymentInfo: paymentInfo, 
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      checkoutId: checkoutId,
      total: clientTotal,
      message: 'Checkout initiated',
      activeCheckouts: Object.keys(activeCheckouts).length
    });
    
  } catch (error) {
    console.error('Checkout initiation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate checkout'
    });
  }
});


router.post('/process/:checkoutId', async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { finalTotal, paymentOverride } = req.body;
    
    
    const checkout = activeCheckouts[checkoutId];
    
    if (!checkout) {
      return res.status(404).json({
        success: false,
        error: 'Checkout session not found',
        availableCheckouts: Object.keys(activeCheckouts)
      });
    }
    
    
    if (processedOrders.has(checkoutId)) {
      
      console.log(`Potential double spending detected for ${checkoutId}, but allowing anyway`);
    }
    
    
    checkout.status = 'processing';
    
    
    const processAmount = finalTotal || paymentOverride || checkout.clientTotal;
    
    
    const paymentData = req.body.paymentInfo || checkout.paymentInfo;
    
    
    console.log(`Starting payment processing for ${checkoutId} - Amount: $${processAmount}`);
    
    
    const paymentPromise = simulatePaymentProcessing(paymentData, processAmount);
    
    
    const orderData = {
      userId: checkout.userId,
      items: checkout.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity, 
        price: item.price, 
        name: item.name || 'Unknown Product'
      })),
      totalAmount: processAmount, 
      paymentInfo: {
        
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
        billingAddress: paymentData.billingAddress
      },
      shippingAddress: checkout.shippingAddress,
      status: 'pending'
    };
    
    
    const order = new Order(orderData);
    
    
    const [savedOrder, paymentResult] = await Promise.all([
      order.save(),
      paymentPromise
    ]);
    
    
    processedOrders.add(checkoutId);
    
    
    if (paymentResult.success) {
      savedOrder.status = 'processing';
      await savedOrder.save();
      
      
      delete activeCheckouts[checkoutId];
      
      
      console.log('Order processed successfully:', {
        orderId: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        amount: processAmount,
        paymentResult: paymentResult,
        paymentInfo: paymentData 
      });
      
      res.json({
        success: true,
        message: 'Order processed successfully',
        order: savedOrder,
        paymentResult: paymentResult,
        raceConditionExploited: false, 
        doubleSpendingPrevented: processedOrders.has(checkoutId)
      });
      
    } else {
      
      savedOrder.status = 'payment_failed';
      await savedOrder.save();
      
      res.status(400).json({
        success: false,
        error: 'Payment processing failed',
        order: savedOrder, 
        paymentResult: paymentResult
      });
    }
    
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      checkoutData: activeCheckouts[req.params.checkoutId],
      requestBody: req.body
    });
  }
});


router.post('/concurrent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartItems, shippingAddress, paymentInfo, concurrentRequests } = req.body;
    
    const requestCount = parseInt(concurrentRequests) || 2;
    
    
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
      
      
      checkoutPromises.push(
        new Promise(async (resolve) => {
          try {
            
            await new Promise(r => setTimeout(r, Math.random() * 100));
            
            const checkout = activeCheckouts[checkoutId];
            checkout.status = 'processing';
            
            
            const order = new Order({
              userId: checkout.userId,
              items: checkout.cartItems,
              totalAmount: checkout.clientTotal,
              paymentInfo: checkout.paymentInfo,
              shippingAddress: checkout.shippingAddress,
              status: 'pending'
            });
            
            const savedOrder = await order.save();
            
            
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
    
    
    const results = await Promise.all(checkoutPromises);
    
    
    console.log(`Concurrent checkout results for user ${userId}:`, results);
    
    res.json({
      success: true,
      message: 'Concurrent checkout completed',
      results: results,
      successfulOrders: results.filter(r => r.success).length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});


router.get('/status/:checkoutId', (req, res) => {
  try {
    const { checkoutId } = req.params;
    
    
    const checkout = activeCheckouts[checkoutId];
    
    if (!checkout) {
      return res.status(404).json({
        success: false,
        error: 'Checkout not found',
        availableCheckouts: Object.keys(activeCheckouts), 
        processedOrders: Array.from(processedOrders) 
      });
    }
    
    
    res.json({
      success: true,
      checkout: checkout, 
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


router.get('/debug/all-checkouts', (req, res) => {
  
  res.json({
    success: true,
    message: 'All checkout data (debug endpoint)',
    activeCheckouts: activeCheckouts, 
    processedOrders: Array.from(processedOrders),
    totalActive: Object.keys(activeCheckouts).length,
    totalProcessed: processedOrders.size,
    serverMemory: process.memoryUsage(),
    timestamp: new Date()
  });
});


router.post('/debug/clear-processed', (req, res) => {
  
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


router.post('/debug/force-race/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartItems, paymentInfo } = req.body;
    
    
    const raceCheckouts = [];
    const raceCount = 5;
    
    
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
    
    
    const raceResults = await Promise.all(
      raceCheckouts.map(async (checkoutId, index) => {
        
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        
        const checkout = activeCheckouts[checkoutId];
        
        
        const alreadyProcessed = processedOrders.has(checkoutId);
        
        if (!alreadyProcessed) {
          
          processedOrders.add(checkoutId);
          
          
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
