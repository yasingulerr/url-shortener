const { generateShortCode } = require('../utils/shortCodeGenerator');
const { saveUrl, findByShortCode, isShortCodeExists, incrementClickCount, deleteUrlByShortCode } = require('../models/urlModel');
const { saveAnalytics } = require('../models/analyticsModel');

const { isUrlMalicious } = require('../utils/urlValidator'); // Malicious URL kontrolü
const redisClient = require('../config/redis');

// Kısa URL oluşturma
exports.shortenUrl = async (req, res) => {
  let { originalUrl, customAlias, expiresAt } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl alanı zorunludur' });
  }

  try {
    new URL(originalUrl);
  } catch (err) {
    return res.status(400).json({ error: 'Geçersiz URL formatı' });
  }

  // Malicious URL kontrolü
  if (isUrlMalicious(originalUrl)) {
    return res.status(400).json({ error: 'Malicious URL tespit edildi.' });
  }

  // Custom alias verilmişse kontrol et
  if (customAlias) {
    const exists = await isShortCodeExists(customAlias);
    if (exists) {
      return res.status(409).json({ error: 'Custom alias zaten kullanılıyor' });
    }
  } else {
    // Verilmemişse random kısa kod oluştur
    customAlias = generateShortCode();
  }

  // expiresAt varsa Date objesine çevir, yoksa null bırak
  if (expiresAt) {
    expiresAt = new Date(expiresAt);
    if (isNaN(expiresAt)) {
      return res.status(400).json({ error: 'Geçersiz expiresAt formatı' });
    }
  } else {
    expiresAt = null;
  }

  try {
    const userId = req.user.id; // auth middleware'den geliyor

    const saved = await saveUrl(customAlias, originalUrl, customAlias || null, expiresAt, userId);

    return res.status(201).json({
      message: 'Kısa URL oluşturuldu',
      shortUrl: `http://localhost:5000/api/url/${saved.short_code}`,
      data: saved
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Veritabanı hatası' });
  }
};

// Kısa URL'ye tıklanınca yönlendirme
exports.redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Önce Redis'ten cache kontrolü yap
    const cachedData = await redisClient.get(shortCode);
    let urlEntry;

    if (cachedData) {
      urlEntry = JSON.parse(cachedData);
      console.log('Redis cache hit');
    } else {
      urlEntry = await findByShortCode(shortCode);
      if (!urlEntry) {
        return res.status(404).send('URL bulunamadı.');
      }
      await redisClient.setEx(shortCode, 3600, JSON.stringify(urlEntry));
      console.log('Redis cache miss, DB den çekildi ve cache’e eklendi');
    }

    if (!urlEntry.is_active) {
      return res.status(410).send('URL artık aktif değil.');
    }

    if (urlEntry.expires_at && new Date() > urlEntry.expires_at) {
      return res.status(410).send('URL’nin süresi dolmuş.');
    }

    // Click count artırma
    await incrementClickCount(shortCode);

    // İstek atan IP adresini al
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;

    // Analytics kaydetme burada
    await saveAnalytics(
      urlEntry.id,
      ipAddress,
      req.get('User-Agent') || '',
      req.get('Referer') || ''
    );

    return res.redirect(urlEntry.original_url);
  } catch (error) {
    console.error('Redirect hata:', error);
    return res.status(500).send('Sunucu hatası');
  }
};

// Kullanıcının kendi oluşturduğu kısa URL'yi silmesi
exports.deleteUrl = async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.user.id; // auth middleware'den geliyor

  try {
    const deleted = await deleteUrlByShortCode(shortCode, userId);

    if (!deleted) {
      return res.status(403).json({ error: 'Silme yetkiniz yok veya URL bulunamadı' });
    }

    // Redis cache varsa sil
    await redisClient.del(shortCode);

    return res.status(200).json({ message: 'URL başarıyla silindi' });
  } catch (error) {
    console.error('Silme hatası:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};
