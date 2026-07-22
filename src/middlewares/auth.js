const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const publicRoutes = [
    '/login',
    '/register',
    '/signup',
    '/forgot-password',
  ]

  if (publicRoutes.includes(req.path)) {
    return next()
  }

  const authHeader = req.headers.authorization

  if (!authHeader) {
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Mode développement: authentification ignorée')
      return next()
    }

    return res.status(401).json({
      success: false,
      error: {
        type: 'Unauthorized',
        message: "Token d'authentification requis",
        status: 401,
      },
    })
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader

  if (isValidToken(token)) {
    req.user = decodeToken(token)

    console.log(
      `🔐 Utilisateur authentifié: ${req.user?.username || 'Unknown'}`,
    )
    console.log(`   Rôle: ${req.user?.role || 'Unknown'}`)

    return next()
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️  Mode développement: token invalide ignoré')
    return next()
  }

  return res.status(401).json({
    success: false,
    error: {
      type: 'Unauthorized',
      message: 'Token invalide ou expiré',
      status: 401,
    },
  })
}

function isValidToken(token) {
  if (!token) {
    return false
  }

  if (process.env.NODE_ENV === 'development') {
    return true
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    return true
  } catch (err) {
    return false
  }
}

function decodeToken(token) {
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'user-123',
      username: 'user',
      role: 'user',
      permissions: ['read', 'write'],
    }
  }

  try {
    return jwt.decode(token)
  } catch (err) {
    return null
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          type: 'Unauthorized',
          message: 'Utilisateur non authentifié',
          status: 401,
        },
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          type: 'Forbidden',
          message: 'Rôle insuffisant pour cette action',
          status: 403,
        },
      })
    }

    next()
  }
}

module.exports = authMiddleware
module.exports.requireRole = requireRole
