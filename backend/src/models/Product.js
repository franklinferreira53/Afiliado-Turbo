const { query } = require('../config/database');

class Product {
  static async create(productData) {
    const {
      title,
      description,
      price,
      original_price,
      image_url,
      product_url,
      affiliate_link,
      source,
      category,
      rating,
      reviews_count,
      popularity_score
    } = productData;

    const result = await query(
      `INSERT INTO products (
        title, description, price, original_price, image_url, product_url,
        affiliate_link, source, category, rating, reviews_count, popularity_score, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) 
      RETURNING *`,
      [title, description, price, original_price, image_url, product_url, 
       affiliate_link, source, category, rating, reviews_count, popularity_score]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query_str = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.source) {
      query_str += ` AND source = $${paramCount}`;
      params.push(filters.source);
      paramCount++;
    }

    if (filters.category) {
      query_str += ` AND category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    if (filters.min_rating) {
      query_str += ` AND rating >= $${paramCount}`;
      params.push(filters.min_rating);
      paramCount++;
    }

    query_str += ' ORDER BY popularity_score DESC, created_at DESC';

    if (filters.limit) {
      query_str += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }

    const result = await query(query_str, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updatePopularityScore(id, score) {
    const result = await query(
      'UPDATE products SET popularity_score = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [score, id]
    );
    return result.rows[0];
  }

  static async getTopProducts(limit = 10) {
    const result = await query(
      'SELECT * FROM products ORDER BY popularity_score DESC, rating DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }
}

module.exports = Product;