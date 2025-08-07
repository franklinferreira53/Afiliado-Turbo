const express = require('express');
const router = express.Router();

const {
  publishContent,
  validateSocialTokens,
  getUserPages,
  getPostAnalytics,
  getOptimalPostingTimes,
  bulkPublish
} = require('../controllers/social.controller');
const { authenticateToken } = require('../middleware/auth');

// All social routes require authentication
router.post('/publish', authenticateToken, publishContent);
router.post('/validate-token', authenticateToken, validateSocialTokens);
router.get('/pages', authenticateToken, getUserPages);
router.get('/analytics/:content_id', authenticateToken, getPostAnalytics);
router.get('/optimal-times', authenticateToken, getOptimalPostingTimes);
router.post('/bulk-publish', authenticateToken, bulkPublish);

module.exports = router;