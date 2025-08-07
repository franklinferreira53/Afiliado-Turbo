const express = require('express');
const router = express.Router();

const {
  trackEvent,
  getDashboardStats,
  getTopProducts,
  getPlatformPerformance,
  getTimeSeriesData,
  getContentPerformance,
  generateReport,
  getRealTimeStats
} = require('../controllers/analytics.controller');
const { authenticateToken } = require('../middleware/auth');

// All analytics routes require authentication
router.post('/track', authenticateToken, trackEvent);
router.get('/dashboard', authenticateToken, getDashboardStats);
router.get('/products/top', authenticateToken, getTopProducts);
router.get('/platforms', authenticateToken, getPlatformPerformance);
router.get('/timeseries', authenticateToken, getTimeSeriesData);
router.get('/content/:content_id?', authenticateToken, getContentPerformance);
router.get('/report', authenticateToken, generateReport);
router.get('/realtime', authenticateToken, getRealTimeStats);

module.exports = router;