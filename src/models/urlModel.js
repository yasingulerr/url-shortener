const pool = require('../config/database');

async function saveUrl(shortCode, originalUrl, customAlias = null, expiresAt = null) {
  const query = `
    INSERT INTO urls (short_code, original_url, custom_alias, expires_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [shortCode, originalUrl, customAlias, expiresAt];
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

module.exports = { saveUrl, findByShortCode, isShortCodeExists, incrementClickCount };
