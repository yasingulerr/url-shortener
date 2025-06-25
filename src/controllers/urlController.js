const { generateShortCode } = require('../utils/shortCodeGenerator');
const { saveUrl, findByShortCode, isShortCodeExists } = require('../models/urlModel');

// Kısa URL oluşturma
exports.shortenUrl = async (req, res) => {
  let { originalUrl, customAlias } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl alanı zorunludur' });
  }

  try {
    new URL(originalUrl);
  } catch (err) {
    return res.status(400).json({ error: 'Geçersiz URL formatı' });
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

  try {
    const saved = await saveUrl(customAlias, originalUrl, req.body.customAlias || null);

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
    const urlEntry = await findByShortCode(shortCode);

    if (!urlEntry) {
      return res.status(404).send('URL bulunamadı.');
    }

    if (!urlEntry.is_active) {
      return res.status(410).send('URL artık aktif değil.');
    }

    if (urlEntry.expires_at && new Date() > urlEntry.expires_at) {
      return res.status(410).send('URL’nin süresi dolmuş.');
    }

    return res.redirect(urlEntry.original_url);
  } catch (error) {
    console.error('Redirect hata:', error);
    return res.status(500).send('Sunucu hatası');
  }
};
