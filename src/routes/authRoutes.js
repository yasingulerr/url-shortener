const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 👈 doğru import

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
