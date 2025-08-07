const express = require('express');
const router = express.Router();

const {
  generateContent,
  getUserContent,
  getContentById,
  updateContentStatus,
  regenerateContent
} = require('../controllers/content.controller');
const { authenticateToken } = require('../middleware/auth');

// All content routes require authentication
router.post('/generate', authenticateToken, generateContent);
router.get('/', authenticateToken, getUserContent);
router.get('/:id', authenticateToken, getContentById);
router.put('/:id/status', authenticateToken, updateContentStatus);
router.post('/:id/regenerate', authenticateToken, regenerateContent);

module.exports = router;