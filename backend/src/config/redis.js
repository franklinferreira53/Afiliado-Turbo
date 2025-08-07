const redis = require('redis');
const { logger } = require('../utils/logger');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const connectRedis = async () => {
  try {
    await client.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

client.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

module.exports = {
  client,
  connectRedis
};