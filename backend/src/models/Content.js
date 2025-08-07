const { query } = require('../config/database');

class Content {
  static async create(contentData) {
    const {
      user_id,
      product_id,
      type,
      title,
      description,
      content_url,
      thumbnail_url,
      hashtags,
      cta_text,
      ai_generated_data,
      status
    } = contentData;

    const result = await query(
      `INSERT INTO content (
        user_id, product_id, type, title, description, content_url,
        thumbnail_url, hashtags, cta_text, ai_generated_data, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
      RETURNING *`,
      [user_id, product_id, type, title, description, content_url,
       thumbnail_url, JSON.stringify(hashtags), cta_text, 
       JSON.stringify(ai_generated_data), status || 'draft']
    );
    return result.rows[0];
  }

  static async findByUserId(user_id, filters = {}) {
    let query_str = 'SELECT c.*, p.title as product_title FROM content c LEFT JOIN products p ON c.product_id = p.id WHERE c.user_id = $1';
    const params = [user_id];
    let paramCount = 2;

    if (filters.type) {
      query_str += ` AND c.type = $${paramCount}`;
      params.push(filters.type);
      paramCount++;
    }

    if (filters.status) {
      query_str += ` AND c.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    query_str += ' ORDER BY c.created_at DESC';

    if (filters.limit) {
      query_str += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await query(query_str, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT c.*, p.title as product_title FROM content c LEFT JOIN products p ON c.product_id = p.id WHERE c.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await query(
      'UPDATE content SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async updatePublishedData(id, published_data) {
    const result = await query(
      'UPDATE content SET published_data = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [JSON.stringify(published_data), 'published', id]
    );
    return result.rows[0];
  }
}

module.exports = Content;