/**
 * Middleware d'authentification
 *
 * Vérifie l'authenticité des requêtes via JWT.
 * Ce middleware est prepares pour JWT mais fonctionne aussi
 * de manière simple pour le développement.
 *
 * @author Dupont Corporation
 * @version 1.0.0
 */

/**
 * Middleware d'authentification
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction suivante dans la chaîne de middlewares
 */
const authMiddleware = (req, res, next) => {
  // Liste des routes publiques (pas d'authentification requise)
  const publicRoutes = [
    '/health',
    '/api/users/login',
    '/api/users/register',
    '/api/users/signup',
  ]

  // Vérifier si la route est publique
  if (publicRoutes.includes(req.path)) {
    return next()
  }

  // Récupérer le token depuis les headers
  const authHeader = req.headers.authorization

  // Si pas de header d'autorisation
  if (!authHeader) {
    // En mode développement, on peut autoriser les requêtes sans token
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

  // Extraire le token du format "Bearer <token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader

  // Vérification simple du token (à remplacer par une vraie vérification JWT)
  if (isValidToken(token)) {
    // Ajouter les informations utilisateur à la requête
    req.user = decodeToken(token)

    console.log(
      `🔐 Utilisateur autenticite: ${req.user?.username || 'Unknown'}`,
    )
    console.log(`   Rôle: ${req.user?.role || 'Unknown'}`)

    return next()
  }

  // Token invalide
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️  Mode développement: token invalide ignorée')
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

/**
 * Vérifie la validité d'un token
 * @param {string} token - Token à vérifier
 * @returns {boolean} True si le token est valide
 */
function isValidToken(token) {
  // TODO: Implémenter une vraie vérification JWT
  // Pour le moment, on vérifie juste que le token existe
  if (!token || token.length < 10) {
    return false
  }

  // En mode développement, accepter tous les tokens
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // TODO: Vérifier le token avec jsonwebtoken
  // const jwt = require('jsonwebtoken');
  // try {
  //     jwt.verify(token, process.env.JWT_SECRET);
  //     return true;
  // } catch (err) {
  //     return false;
  // }

  return true
}

/**
 * Décode le token pour extraire les informations utilisateur
 * @param {string} token - Token à décoder
 * @returns {Object} Informations utilisateur
 */
function decodeToken(token) {
  // TODO: Implémenter un vrai décodage JWT
  // Pour le moment, on retourne un utilisateur factice
  try {
    // Simuler le décodage du token (à remplacer par jwt.decode)
    return {
      id: 'user-123',
      username: 'user',
      role: 'user',
      permissions: ['read', 'write'],
    }
  } catch (err) {
    return null
  }
}

/**
 * Vérifie si l'utilisateur a le rôle requis
 * @param {string[]} allowedRoles - Roles autorisés
 * @returns {Function} Middleware de vérification de rôle
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          type: 'Unauthorized',
          message: 'Utilisateur non authenticité',
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
