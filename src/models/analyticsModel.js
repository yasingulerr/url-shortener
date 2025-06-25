const pool = require('../config/database');

async function saveAnalytics(urlId, ipAddress, userAgent, referer, country = null, city = null) {
  const query = `
    INSERT INTO analytics (url_id, ip_address, user_agent, referer, country, city)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  const values = [urlId, ipAddress, userAgent, referer, country, city];
  await pool.query(query, values);
}

async function getAnalyticsByUrlId(urlId) {
  const query = `
    SELECT clicked_at, ip_address, user_agent, referer, country, city
    FROM analytics
    WHERE url_id = $1
    ORDER BY clicked_at DESC
  `;
  const result = await pool.query(query, [urlId]);
  return result.rows;
}

module.exports = { saveAnalytics, getAnalyticsByUrlId };

