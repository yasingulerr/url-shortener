const pool = require('../config/database');

async function saveUrl(shortCode, originalUrl, customAlias = null) {
  const query = `
    INSERT INTO urls (short_code, original_url, custom_alias)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [shortCode, originalUrl, customAlias];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function findByShortCode(shortCode) {
  const query = `SELECT * FROM urls WHERE short_code = $1 LIMIT 1;`;
  const result = await pool.query(query, [shortCode]);
  return result.rows[0];
}

async function isShortCodeExists(shortCode) {
  const query = `SELECT 1 FROM urls WHERE short_code = $1 LIMIT 1;`;
  const result = await pool.query(query, [shortCode]);
  return result.rowCount > 0;
}

module.exports = { saveUrl, findByShortCode, isShortCodeExists };
