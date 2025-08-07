const { query } = require('../config/database');

class Campaign {
  static async create(campaignData) {
    const {
      user_id,
      name,
      description,
      products,
      schedule_config,
      social_platforms,
      content_settings,
      status
    } = campaignData;

    const result = await query(
      `INSERT INTO campaigns (
        user_id, name, description, products, schedule_config,
        social_platforms, content_settings, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
      RETURNING *`,
      [user_id, name, description, JSON.stringify(products), 
       JSON.stringify(schedule_config), JSON.stringify(social_platforms),
       JSON.stringify(content_settings), status || 'active']
    );
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const result = await query(
      'SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM campaigns WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await query(
      'UPDATE campaigns SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async getActiveCampaigns() {
    const result = await query(
      "SELECT * FROM campaigns WHERE status = 'active' ORDER BY created_at DESC"
    );
    return result.rows;
  }
}

module.exports = Campaign;