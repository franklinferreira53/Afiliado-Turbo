const express = require('express');
const router = express.Router();

const {
  searchProducts,
  getTrendingProducts,
  saveProduct,
  getSavedProducts,
  getProductById,
  updateProductScore
} = require('../controllers/products.controller');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/search', searchProducts);
router.get('/trending', getTrendingProducts);

// Protected routes
router.post('/', authenticateToken, saveProduct);
router.get('/', authenticateToken, getSavedProducts);
router.get('/:id', authenticateToken, getProductById);
router.put('/:id/score', authenticateToken, updateProductScore);

module.exports = router;