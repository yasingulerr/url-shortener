const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';

const client = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  }
});

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await client.connect();
  console.log('✅ Redis bağlantısı başarılı');
})();

module.exports = client;
