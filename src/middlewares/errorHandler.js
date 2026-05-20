/**
 * Middleware de gestion des erreurs
 *
 * Intercepte et gère toutes les erreurs non traitées
 * dans l'application. Retourne une réponse JSON appropriée.
 *
 * @author Dupont Corporation
 * @version 1.0.0
 */

/**
 * Gestionnaire d'erreurs global
 * @param {Error} err - Objet erreur
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction suivante (non utilisées ici)
 */
const errorHandler = (err, req, res, next) => {
  // Journalisation de l'erreur
  console.error('━'.repeat(60))
  console.error('❌ Erreur capturée:')
  console.error(`   Message: ${err.message}`)
  console.error(`   Stack: ${err.stack}`)
  console.error(`   URL: ${req.method} ${req.originalUrl}`)
  console.error('━'.repeat(60))

  // Détermination du code de statut HTTP
  let statusCode = err.statusCode || 500

  // Messages d'erreur personnalisés selon le type
  let errorMessage = err.message || 'Erreur interne du serveur'
  let errorType = 'InternalServerError'

  // Personnalisation selon le code de statut
  switch (statusCode) {
    case 400:
      errorType = 'BadRequest'
      errorMessage = errorMessage || 'Requête invalide'
      break
    case 401:
      errorType = 'Unauthorized'
      errorMessage = errorMessage || 'Non autorisé'
      break
    case 403:
      errorType = 'Forbidden'
      errorMessage = errorMessage || 'Accès interdit'
      break
    case 404:
      errorType = 'NotFound'
      errorMessage = errorMessage || 'Ressource non trouvée'
      break
    case 429:
      errorType = 'TooManyRequests'
      errorMessage = errorMessage || 'Trop de requêtes'
      break
    case 500:
    default:
      errorType = 'InternalServerError'
      errorMessage = errorMessage || 'Erreur interne du serveur'
      break
  }

  // Réponse JSON d'erreur
  res.status(statusCode).json({
    success: false,
    error: {
      type: errorType,
      message: errorMessage,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  })
}

module.exports = errorHandler
