const rateLimit = require('express-rate-limit')

const windowMs = process.env.RATE_LIMIT_WINDOW_MS
  ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
  : 15 * 60 * 1000

const max = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 100

const limiter = rateLimit({
  windowMs,
  max,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress
  },
  skip: (req) => {
    if (req.path === '/api/users/login') return true
    return !req.ip
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️  Rate limit atteint pour IP: ${req.ip}`)
    res.status(429).json({
      success: false,
      error: {
        type: 'TooManyRequests',
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
        status: 429,
        retryAfter: Math.ceil(windowMs / 1000),
      },
    })
  },
})

module.exports = limiter
