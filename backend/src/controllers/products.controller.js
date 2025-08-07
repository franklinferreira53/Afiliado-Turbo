const Product = require('../models/Product');
const AmazonService = require('../services/amazon.service');
const ShopeeService = require('../services/shopee.service');
const { client: redisClient } = require('../config/redis');
const { logger } = require('../utils/logger');

const amazonService = new AmazonService();
const shopeeService = new ShopeeService();

const searchProducts = async (req, res) => {
  try {
    const { query, source, category, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Check cache first
    const cacheKey = `search:${source || 'all'}:${query}:${category || 'all'}:${limit}`;
    const cachedResults = await redisClient.get(cacheKey);

    if (cachedResults) {
      return res.json({
        products: JSON.parse(cachedResults),
        cached: true
      });
    }

    let products = [];

    if (!source || source === 'amazon') {
      const amazonProducts = await amazonService.searchProducts(query, category);
      products.push(...amazonProducts);
    }

    if (!source || source === 'shopee') {
      const shopeeProducts = await shopeeService.searchProducts(query, parseInt(limit));
      products.push(...shopeeProducts);
    }

    // Sort by popularity score
    products = products
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, parseInt(limit));

    // Cache results for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));

    res.json({
      products,
      count: products.length,
      cached: false
    });
  } catch (error) {
    logger.error('Product search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const cacheKey = `trending:${limit}`;
    
    // Check cache first
    const cachedResults = await redisClient.get(cacheKey);
    
    if (cachedResults) {
      return res.json({
        products: JSON.parse(cachedResults),
        cached: true
      });
    }

    // Get trending products from both sources
    const [amazonProducts, shopeeProducts] = await Promise.all([
      amazonService.getViralProducts(),
      shopeeService.getTrendingProducts()
    ]);

    // Combine and sort
    const allProducts = [...amazonProducts, ...shopeeProducts]
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, parseInt(limit));

    // Cache for 30 minutes
    await redisClient.setEx(cacheKey, 1800, JSON.stringify(allProducts));

    res.json({
      products: allProducts,
      count: allProducts.length,
      cached: false
    });
  } catch (error) {
    logger.error('Trending products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const saveProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Save to database
    const savedProduct = await Product.create(productData);
    
    res.status(201).json({
      message: 'Product saved successfully',
      product: savedProduct
    });
  } catch (error) {
    logger.error('Save product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSavedProducts = async (req, res) => {
  try {
    const filters = req.query;
    const products = await Product.findAll(filters);
    
    res.json({
      products,
      count: products.length
    });
  } catch (error) {
    logger.error('Get saved products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    logger.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProductScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ error: 'Score must be a number between 0 and 100' });
    }
    
    const updatedProduct = await Product.updatePopularityScore(id, score);
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      message: 'Product score updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    logger.error('Update product score error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  searchProducts,
  getTrendingProducts,
  saveProduct,
  getSavedProducts,
  getProductById,
  updateProductScore
};