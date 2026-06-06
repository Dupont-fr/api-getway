/**
 * API Gateway - Fichier principal
 *
 * Point d'entrée unique pour les requêtes du frontend.
 * Redirige les requêtes vers les microservices appropriés.
 *
 * @author Dupont Corporation
 * @version 1.0.0
 */

// ============================================
// Chargement des dépendances et configuration
// ============================================

require('dotenv').config() // Chargement des variables d'environnement

const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')

// Importation des middlewares personnalisés
const logger = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')
const authMiddleware = require('./middlewares/auth')
const { startKeepAlive } = require('./utils/keepalive')

// Importation de la configuration des proxys
const proxyConfig = require('./config/proxies')

// ============================================
// Configuration du serveur
// ============================================

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

// ============================================
// Middlewares globaux (communs à toutes les routes)
// ============================================

// Middleware CORS - Autorise les requêtes cross-origin
app.use(cors())

// Middleware de logging - Affiche les requêtes entrantes
app.use(logger)

// ============================================
// Configuration des proxys vers les microservices
// (doivent être AVANT les body parsers pour
//  ne pas consommer le flux brut des requêtes)
// ============================================

/**
 * Configuration du routage :
 * - /api/users        → user-service
 * - /api/patients    → patient-service
 * - /api/consultations → consultation-service
 *
 * Chaque route utilise un middleware de proxy pour rediriger
 * les requêtes vers le service correspondant.
 */

// Proxy vers le service utilisateur (authentification, gestion des rôles)
app.use(
  '/api/users',
  authMiddleware,
  createProxyMiddleware(proxyConfig.userService),
)

// Proxy vers le service patient (gestion des patients)
app.use(
  '/api/patients',
  authMiddleware,
  createProxyMiddleware(proxyConfig.patientService),
)

// Proxy vers le service consultation (dossiers médicaux, consultations)
app.use(
  '/api/consultations',
  authMiddleware,
  createProxyMiddleware(proxyConfig.consultationService),
)

// ============================================
// Body parsers (après les proxy pour ne pas
// interférer avec le flux des requêtes proxy)
// ============================================

// Middleware pour parser les corps de requêtes JSON
app.use(express.json())

// Middleware pour parser les données de formulaires
app.use(express.urlencoded({ extended: true }))

// ============================================
// Routes Statistiques & Reporting
// ============================================

/**
 * Route de statistiques hospitalières
 * Données mockées pour le dashboard
 */
app.get('/api/statistique', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      hopitaux: {
        total: 3,
        actifs: 3,
        services: ['Cardiologie', 'Urgences', 'Pédiatrie', 'Radiologie', 'Chirurgie'],
      },
      utilisateurs: {
        total: 25,
        parRole: { ADMIN: 2, MEDECIN: 12, ACCUEIL: 11 },
      },
      patients: {
        total: 150,
        nouveauxCeMois: 12,
      },
      consultations: {
        total: 890,
        ceMois: 45,
        moyenneParJour: 15,
      },
      period: '2026-06',
    },
  })
})

/**
 * GET /api/statistique/hopitaux/:id
 * Statistiques détaillées d'un hôpital
 */
app.get('/api/statistique/hopitaux/:id', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      hopital: req.params.id,
      occupation: { lits: 45, disponibles: 12, taux: 0.79 },
      consultations: 290,
      medecins: 8,
      patients: 60,
    },
  })
})

/**
 * POST /api/statistique/rapport
 * Générer un rapport personnalisé
 */
app.post('/api/statistique/rapport', authMiddleware, (req, res) => {
  const { type, hopital, dateDebut, dateFin } = req.body
  res.json({
    success: true,
    message: 'Rapport généré avec succès',
    data: {
      type: type || 'general',
      hopital: hopital || 'tous',
      periode: { dateDebut, dateFin },
      status: 'en_cours',
      url: `/api/statistique/rapport/${Date.now()}`,
    },
  })
})

// ============================================
// Routes de l'API Gateway
// ============================================

/**
 * Route de vérification de santé (health check)
 * Permet de vérifier que le gateway est opérationnel
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    services: {
      userService: process.env.USER_SERVICE_URL,
      patientService: process.env.PATIENT_SERVICE_URL,
      consultationService: process.env.CONSULTATION_SERVICE_URL,
    },
  })
})

/**
 * Route racine
 * Retourne des informations sur l'API
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Hospital Management API Gateway',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      patients: '/api/patients',
      consultations: '/api/consultations',
      statistiques: '/api/statistique',
    },
  })
})

// ============================================
// Gestionnaire d'erreurs global
// ============================================

// Utilisation du middleware de gestion des erreurs
app.use(errorHandler)

// ============================================
// Démarrage du serveur
// ============================================

app.listen(PORT, HOST, () => {
  console.log(`🚀 API Gateway démarré sur http://${HOST}:${PORT}`)
  console.log(`📍 Routes disponibles:`)
  console.log(`   - GET  /health`)
  console.log(`   - GET  /`)
  console.log(`   - /api/users        → ${process.env.USER_SERVICE_URL}`)
  console.log(`   - /api/patients     → ${process.env.PATIENT_SERVICE_URL}`)
  console.log(
    `   - /api/consultations → ${process.env.CONSULTATION_SERVICE_URL}`,
  )
  console.log(`   - /api/statistique → Statistiques & Reporting (intégré)`)
  console.log(
    `   - /api/statistique/hopitaux/:id → Statistiques par hôpital`,
  )
  console.log(`   - POST /api/statistique/rapport → Générer un rapport`)
  console.log(
    `🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configuré' : 'NON CONFIGURÉ'}`,
  )
})

// Keepalive pour éviter le sommeil Render (free tier)
startKeepAlive()

// Export pour les tests
module.exports = app
