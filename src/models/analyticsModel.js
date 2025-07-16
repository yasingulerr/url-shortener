const pool = require('../config/database');

// Analytics verisi kaydetme
async function saveAnalytics(urlId, ipAddress, userAgent, referer, country = null, city = null) {
  const query = `
    INSERT INTO analytics (url_id, ip_address, user_agent, referer, country, city)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  const values = [urlId, ipAddress, userAgent, referer, country, city];
  await pool.query(query, values);
}

// Analytics verilerini çekme (sayfalama + sıralama ile)
async function getAnalyticsByUrlId(
  urlId,
  { page = 1, limit = 10, sortBy = 'clicked_at', order = 'DESC' } = {}
) {
  const offset = (page - 1) * limit;

  // Güvenlik için sadece belirlenen alanlara sıralama izni ver
  const validSortFields = ['clicked_at', 'ip_address', 'country', 'city', 'user_agent', 'referer'];
  const validOrders = ['ASC', 'DESC'];

  const sortField = validSortFields.includes(sortBy) ? sortBy : 'clicked_at';
  const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

  const query = `
    SELECT clicked_at, ip_address, user_agent, referer, country, city
    FROM analytics
    WHERE url_id = $1
    ORDER BY ${sortField} ${sortOrder}
    LIMIT $2 OFFSET $3
  `;

  const result = await pool.query(query, [urlId, limit, offset]);
  return result.rows;
}

// 🔢 Toplam kayıt sayısını getir
async function countAnalyticsByUrlId(urlId) {
  const query = `SELECT COUNT(*) FROM analytics WHERE url_id = $1`;
  const result = await pool.query(query, [urlId]);
  return parseInt(result.rows[0].count, 10);
}

module.exports = {
  saveAnalytics,
  getAnalyticsByUrlId,
  countAnalyticsByUrlId,
};
