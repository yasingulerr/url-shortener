const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Route tanımı
app.use('/api/url', urlRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('Link Kısaltma Servisi Çalışıyor!');
});

module.exports = app;
