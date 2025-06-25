const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUrlStats } = require('../controllers/analyticsController');

router.get('/:shortCode', auth, getUrlStats);

module.exports = router;
