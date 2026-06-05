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
  skip: () => true,
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = limiter
