const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Sadece bağlanmayı deniyoruz ama export edilen şey pool olmalı:
pool.connect()
  .then(() => console.log('✅ PostgreSQL bağlantısı başarılı'))
  .catch((err) => console.error('❌ PostgreSQL bağlantı hatası', err));

module.exports = pool; // ✅ Bu olmalı
