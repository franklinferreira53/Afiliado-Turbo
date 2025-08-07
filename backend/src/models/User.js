const { query } = require('../config/database');

class User {
  static async create({ name, email, password }) {
    const result = await query(
      'INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at',
      [name, email, password]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query('SELECT id, name, email, created_at, settings FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateSettings(id, settings) {
    const result = await query(
      'UPDATE users SET settings = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, settings',
      [JSON.stringify(settings), id]
    );
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const result = await query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );
    return result.rows[0];
  }
}

module.exports = User;