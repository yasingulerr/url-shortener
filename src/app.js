const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

require('./swagger')(app);
// Body parser middleware EN ÖNCE çağrılmalı
app.use(express.json());

// Diğer middleware'ler
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(rateLimiter(100, 60));

// Route tanımları
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/url', urlRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('Link Kısaltma Servisi Çalışıyor!');
});

module.exports = app;
