const express = require('express');
const router = express.Router();

const { register, login, getProfile, updateSettings } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

// Public routes
router.post('/register', validateRequest(schemas.register), register);
router.post('/login', validateRequest(schemas.login), login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/settings', authenticateToken, validateRequest(schemas.updateSettings), updateSettings);

module.exports = router;