/**
 * Middleware de limitation de requêtes (Rate Limiting)
 *
 * Protège l'API contre les abus en limitant le nombre de requêtes
 * par période de temps. Utilise express-rate-limit.
 *
 * @author Dupont Corporation
 * @version 1.0.0
 */

const rateLimit = require('express-rate-limit')

// Configuration du rate limiter
const limiter = rateLimit({
  // Fenêtre de temps en millisecondes (15 minutes par défaut)
  windowMs: process.env.RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
    : 15 * 60 * 1000, // 15 minutes

  // Nombre maximum de requêtes par fenêtre
  max: process.env.RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
    : 100, // 100 requêtes par 15 minutes

  // Message affiché lors du dépassement de la limite
  message: {
    success: false,
    error: {
      type: 'TooManyRequests',
      message: 'Trop de requêtes. Veuillez réessayer plus tard.',
      status: 429,
      retryAfter: Math.ceil((15 * 60 * 1000) / 1000), // Secondes avant retry
    },
  },

  // Fonction pour identifier le client (par IP par défaut)
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress
  },

  // Ignorer les requêtes qui n'ont pas d'adresse IP
  skip: (req) => {
    return !req.ip
  },

  // Format des headers standards
  standardHeaders: true, // Retourne les headers RateLimit-* standards
  legacyHeaders: false, // Désactiver les anciens headers

  // Logger pour le debug
  handler: (req, res) => {
    console.warn(`⚠️  Rate limit atteint pour IP: ${req.ip}`)
    res.status(429).json({
      success: false,
      error: {
        type: 'TooManyRequests',
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
        status: 429,
      },
    })
  },
})

// Export du middleware
module.exports = limiter
