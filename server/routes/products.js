const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { upload, uploadMiddleware, serveFile, listFiles } = require('../middleware/upload');
const router = express.Router();

// Product search functionality
// GET /api/products/search?q=<search_term>&category=<category>
router.get('/search', async (req, res) => {
  try {
    const { q: searchTerm, category, sort, limit, offset } = req.query;
    
    let query = {};
    
    if (searchTerm) {
      // Safe regex search
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearchTerm, $options: 'i' } },
        { description: { $regex: escapedSearchTerm, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    let mongoQuery = Product.find(query);
    
    // Apply sorting
    if (sort) {
      const sortOptions = {};
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
      mongoQuery = mongoQuery.sort(sortOptions);
    }
    
    // Apply pagination
    const limitNum = Math.min(parseInt(limit) || 20, 100); // Max 100 items
    const offsetNum = parseInt(offset) || 0;
    
    mongoQuery = mongoQuery.limit(limitNum).skip(offsetNum);
    
    const products = await mongoQuery.exec();
    
    res.json({
      success: true,
      count: products.length,
      products: products
    });
    
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      error: 'Search failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced product listing with comprehensive details
// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      brand, 
      featured, 
      tags, 
      minPrice, 
      maxPrice,
      inStock,
      sort = 'createdAt',
      page = 1,
      limit = 12
    } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (subcategory) {
      query.subcategory = subcategory;
    }
    
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username')
      .populate('relatedProducts', 'name price imageUrl averageRating totalReviews')
      .exec();
    
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      success: true,
      products: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalProducts: total,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      filters: {
        category,
        subcategory,
        brand,
        featured,
        tags,
        minPrice,
        maxPrice,
        inStock
      }
    });
    
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// Get single product with comprehensive details
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid product ID format'
      });
    }
    
    const product = await Product.findById(id)
      .populate('createdBy', 'username email')
      .populate('lastModifiedBy', 'username')
      .populate('relatedProducts', 'name price imageUrl averageRating totalReviews')
      .populate('crossSellProducts', 'name price imageUrl averageRating totalReviews')
      .exec();
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }
    
    // VULNERABILITY: Expose all product data including sensitive fields
    res.json({
      success: true,
      product: product,
      metadata: {
        requestedAt: new Date().toISOString(),
        requestedBy: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch product',
      message: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;