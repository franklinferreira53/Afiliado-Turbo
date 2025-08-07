const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateTokens } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate tokens
    const { accessToken } = generateTokens(user.id);

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      accessToken
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken } = generateTokens(user.id);

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        settings: user.settings ? JSON.parse(user.settings) : {}
      },
      accessToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        settings: user.settings ? JSON.parse(user.settings) : {}
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    const updatedUser = await User.updateSettings(req.user.id, settings);

    res.json({
      message: 'Settings updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        settings: JSON.parse(updatedUser.settings)
      }
    });
  } catch (error) {
    logger.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateSettings
};