const { getUrlByShortCode } = require('../models/urlModel');
const { getAnalyticsByUrlId, countAnalyticsByUrlId } = require('../models/analyticsModel');

exports.getUrlStats = async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || 'clicked_at';
  const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

  try {
    const url = await getUrlByShortCode(shortCode);

    if (!url) return res.status(404).json({ error: 'URL bulunamadı' });
    if (url.user_id !== userId) return res.status(403).json({ error: 'Yetkiniz yok' });

    const offset = (page - 1) * limit;

    const [analytics, totalCount] = await Promise.all([
      getAnalyticsByUrlId(url.id, limit, offset, sort, order),
      countAnalyticsByUrlId(url.id),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      shortCode,
      pagination: {
        page,
        limit,
        sort,
        order,
        totalCount,
        totalPages,
      },
      data: analytics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};
