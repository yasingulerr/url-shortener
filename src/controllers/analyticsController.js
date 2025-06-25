const { getUrlByShortCode } = require('../models/urlModel');
const { getAnalyticsByUrlId } = require('../models/analyticsModel');

exports.getUrlStats = async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.user.id; // Auth middleware'dan geliyor

  try {
    const url = await getUrlByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'URL bulunamadı' });
    }

    if (url.user_id !== userId) {
      return res.status(403).json({ error: 'Yetkiniz yok' });
    }

    const analytics = await getAnalyticsByUrlId(url.id);

    return res.status(200).json({
      url,
      analytics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};
