const { Pool } = require('pg');
const { logger } = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info('PostgreSQL connected successfully');
    client.release();
  } catch (error) {
    logger.error('PostgreSQL connection failed:', error);
    throw error;
  }
};

const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  connectDB,
  query
};