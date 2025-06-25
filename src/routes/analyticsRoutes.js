const express = require('express');
const router = express.Router();
const { getUrlStats } = require('../controllers/analyticsController');

// GET /api/analytics/:shortCode
router.get('/:shortCode', getUrlStats);

module.exports = router;
