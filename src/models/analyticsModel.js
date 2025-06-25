const pool = require('../config/database');

async function saveAnalytics(urlId, ipAddress, userAgent, referer, country = null, city = null) {
  const query = `
    INSERT INTO analytics (url_id, ip_address, user_agent, referer, country, city)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  const values = [urlId, ipAddress, userAgent, referer, country, city];
  await pool.query(query, values);
}

async function getAnalyticsByUrlId(shortCode) {
  const query = `
    SELECT a.clicked_at, a.ip_address, a.user_agent, a.referer, a.country, a.city
    FROM analytics a
    JOIN urls u ON a.url_id = u.id
    WHERE u.short_code = $1
    ORDER BY a.clicked_at DESC;
  `;
  const result = await pool.query(query, [shortCode]);
  return result.rows;
}

module.exports = { saveAnalytics, getAnalyticsByUrlId };

