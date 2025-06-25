const { getAnalyticsByUrlId } = require('../models/analyticsModel');

exports.getUrlStats = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const analyticsData = await getAnalyticsByUrlId(shortCode);
    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Analytics hata:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};
