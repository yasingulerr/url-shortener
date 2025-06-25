const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl } = require('../controllers/urlController');

// POST /api/url/shorten – Yeni kısa URL oluştur
router.post('/shorten', shortenUrl);

// GET /api/url/:shortCode – Kısa URL’ye karşılık gelen orijinal URL’ye yönlendirme
router.get('/:shortCode', redirectUrl);

module.exports = router;
