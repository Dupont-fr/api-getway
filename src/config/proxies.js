/**
 * Configuration des proxies vers les microservices
 *
 * Ce fichier définit comment les requêtes sont redirigées vers chaque
 * microservice via http-proxy-middleware.
 *
 * @author Dupont Corporation
 * @version 1.0.0
 */

/**
 * Configuration du proxy vers le service utilisateur
 * Gère l'authentification et la gestion des rôles
 */
const userServiceProxy = {
  target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true, // Change l'en-tête Host pour correspondre au service cible
  pathRewrite: {
    '^/api/users': '', // Retire /api/users avant de转发 vers le service
  },
  // Configuration du logger pour le debug
  logLevel: 'debug',
  // Gestion des erreurs
  onError: (err, req, res) => {
    console.error('❌ Erreur proxy user-service:', err.message)
    res.status(503).json({
      error: 'Service indisponible',
      message: 'user-service temporairement inaccessible',
    })
  },
  // Callback lors de la réponse du proxy
  onProxyReq: (proxyReq, req) => {
    console.log(`📤 Proxy vers user-service: ${req.method} ${req.originalUrl}`)
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Réponse de user-service: ${proxyRes.statusCode}`)
  },
}

/**
 * Configuration du proxy vers le service patient
 * Gère les informations des patients
 */
const patientServiceProxy = {
  target: process.env.PATIENT_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/patients': '', // Retire /api/patients avant de转发
  },
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('❌ Erreur proxy patient-service:', err.message)
    res.status(503).json({
      error: 'Service indisponible',
      message: 'patient-service temporairement inaccessible',
    })
  },
  onProxyReq: (proxyReq, req) => {
    console.log(
      `📤 Proxy vers patient-service: ${req.method} ${req.originalUrl}`,
    )
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Réponse de patient-service: ${proxyRes.statusCode}`)
  },
}

/**
 * Configuration du proxy vers le service consultation
 * Gère les dossiers médicaux et consultations
 */
const consultationServiceProxy = {
  target: process.env.CONSULTATION_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/consultations': '', // Retire /api/consultations avant de转发
  },
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('❌ Erreur proxy consultation-service:', err.message)
    res.status(503).json({
      error: 'Service indisponible',
      message: 'consultation-service temporairement inaccessible',
    })
  },
  onProxyReq: (proxyReq, req) => {
    console.log(
      `📤 Proxy vers consultation-service: ${req.method} ${req.originalUrl}`,
    )
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Réponse de consultation-service: ${proxyRes.statusCode}`)
  },
}

// Export des configurations
module.exports = {
  userService: userServiceProxy,
  patientService: patientServiceProxy,
  consultationService: consultationServiceProxy,
}
