/**
 * Middleware de logging
 *
 * Affiche les informations sur chaque requête entrante.
 * Utile pour le debug et la surveillance.
 *
 * @author Dupont Corporation
 * @version 1.0.0
 */

/**
 * Middleware de logging des requêtes HTTP
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction suivante dans la chaîne de middlewares
 */
const logger = (req, res, next) => {
  // Horodatage de la requête
  const timestamp = new Date().toISOString()

  // Informations de la requête
  const method = req.method
  const url = req.originalUrl || req.url
  const ip = req.ip || req.connection.remoteAddress
  const userAgent = req.get('user-agent') || 'Unknown'

  // Affichage formaté
  console.log('━'.repeat(60))
  console.log(`📝 [${timestamp}]`)
  console.log(`🔵 ${method} ${url}`)
  console.log(`🌐 IP: ${ip}`)
  console.log(`👤 User-Agent: ${userAgent}`)
  console.log('━'.repeat(60))

  // Passer au middleware suivant
  next()
}

module.exports = logger
