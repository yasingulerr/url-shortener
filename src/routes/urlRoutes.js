const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, deleteUrl } = require('../controllers/urlController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/url/shorten:
 *   post:
 *     summary: Yeni kısa URL oluşturur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *               customAlias:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Kısa URL oluşturuldu
 */

// POST /api/url/shorten – Yeni kısa URL oluştur (auth gerekli)
router.post('/shorten', auth, shortenUrl);

// GET /api/url/:shortCode – Kısa URL’ye karşılık gelen orijinal URL’ye yönlendirme (public)
router.get('/:shortCode', redirectUrl);

// DELETE /api/url/:shortCode – Kısa URL silme (auth gerekli)
router.delete('/:shortCode', auth, deleteUrl);

module.exports = router;
