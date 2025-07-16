const rateLimitWindow = new Map();

module.exports = (maxRequests, windowSeconds) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowTime = windowSeconds * 1000;

    if (!rateLimitWindow.has(ip)) {
      rateLimitWindow.set(ip, []);
    }

    const timestamps = rateLimitWindow.get(ip).filter(ts => now - ts < windowTime);
    timestamps.push(now);
    rateLimitWindow.set(ip, timestamps);

    if (timestamps.length > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    next();
  };
};
