const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUrlStats } = require('../controllers/analyticsController');

/**
 * @swagger
 * /api/analytics/{shortCode}:
 *   get:
 *     summary: Belirli kısa URL için analytics verilerini döner
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Kısa URL kodu
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics verileri başarıyla döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortCode:
 *                   type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     sort:
 *                       type: string
 *                     order:
 *                       type: string
 *                     totalCount:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clicked_at:
 *                         type: string
 *                         format: date-time
 *                       ip_address:
 *                         type: string
 *                       user_agent:
 *                         type: string
 *                       referer:
 *                         type: string
 *                       country:
 *                         type: string
 *                         nullable: true
 *                       city:
 *                         type: string
 *                         nullable: true
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: URL bulunamadı
 */
router.get('/:shortCode', auth, getUrlStats);

module.exports = router;
