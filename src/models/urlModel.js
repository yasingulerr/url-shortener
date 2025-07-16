const pool = require('../config/database');

async function saveUrl(shortCode, originalUrl, customAlias = null, expiresAt = null, userId = null) {
  const query = `
    INSERT INTO urls (short_code, original_url, custom_alias, expires_at, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [shortCode, originalUrl, customAlias, expiresAt, userId];
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

async function incrementClickCount(shortCode) {
  const query = `
    UPDATE urls
    SET click_count = click_count + 1
    WHERE short_code = $1;
  `;
  await pool.query(query, [shortCode]);
}

async function getUrlByShortCode(shortCode) {
  const query = `SELECT * FROM urls WHERE short_code = $1`;
  const result = await pool.query(query, [shortCode]);
  return result.rows[0];
}

async function deleteUrlByShortCode(shortCode, userId) {
  const query = `
    DELETE FROM urls
    WHERE short_code = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [shortCode, userId]);
  return result.rowCount > 0;
}

module.exports = {
  saveUrl,
  findByShortCode,
  isShortCodeExists,
  incrementClickCount,
  getUrlByShortCode,
  deleteUrlByShortCode 
};
