# MediSys - API Gateway

Point d'entrée unique de l'application hospitalière MediSys. Redirige les requêtes du frontend vers les microservices.

## Stack technique

- **Runtime** : Node.js
- **Framework** : Express.js
- **Proxy** : http-proxy-middleware
- **Auth** : JWT (jsonwebtoken)
- **Rate Limiting** : express-rate-limit

## Structure du projet

```
Getway/
├── .env                        # Variables d'environnement
├── .env.example                # Exemple de configuration
├── package.json
├── src/
│   ├── server.js               # Point d'entrée Express
│   ├── config/
│   │   └── proxies.js          # Configuration des proxys vers chaque microservice
│   └── middlewares/
│       ├── auth.js             # Authentification JWT (vérification des tokens)
│       ├── errorHandler.js     # Gestion globale des erreurs (réponses JSON structurées)
│       ├── rateLimiter.js      # Limitation de requêtes (anti-brute force)
│       └── logger.js           # Journalisation des requêtes entrantes
```

## Scripts disponibles

```bash
npm start           # Démarre le Gateway
npm run dev         # Mode développement
npm run build       # Build le frontend + backend
npm run deploy:full # npm install + npm start
```

## Routage

| Préfixe | Cible | Service |
|---------|-------|---------|
| `/api/users/*` | user-service (3001) | Authentification, utilisateurs, hôpitaux |
| `/api/patients/*` | patient-service (3002) | Gestion des patients |
| `/api/consultations/*` | consultation-service (3003) | Consultations médicales |

## Routes propres au Gateway

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Informations de l'API |
| GET | `/health` | Statut des services |

## Middleware stack

1. **CORS** — Autorise les requêtes cross-origin
2. **Logger** — Enregistre chaque requête (timestamps, IP, user-agent)
3. **Rate Limiter** — Limite à 100 requêtes par fenêtre de 15 min (configurable)
4. **Auth** — Vérifie le token JWT avant d'atteindre les proxys
5. **Proxy** — Redirige vers le microservice correspondant
6. **Body Parsers** — JSON et URL-encoded
7. **Error Handler** — Gestion centralisée des erreurs

## Endpoints publics (sans authentification)

Les routes suivantes sont accessibles sans token JWT :
- `POST /api/users/login`
- `POST /api/users/register` (bootstrap admin)
- `POST /api/users/signup`

## Variables d'environnement

```env
PORT=3000                      # Port du Gateway
HOST=0.0.0.0                  # Hôte (0.0.0.0 pour Render)

USER_SERVICE_URL=http://localhost:3001        # URL du service utilisateur
PATIENT_SERVICE_URL=http://localhost:3002     # URL du service patient
CONSULTATION_SERVICE_URL=http://localhost:3003 # URL du service consultation

JWT_SECRET=dev-secret-key-change-in-production   # Clé JWT (doit correspondre aux services)

RATE_LIMIT_WINDOW_MS=900000    # Fenêtre de rate limiting (15 min)
RATE_LIMIT_MAX_REQUESTS=100    # Requêtes max par fenêtre

NODE_ENV=development           # Environnement
```

## Fonctionnalités

- **Proxy inverse** vers 3 microservices avec réécriture de chemin
- **Authentification centralisée** : validation JWT au niveau du Gateway
- **Rate limiting** configurable (protection contre les abus)
- **Journalisation** détaillée des requêtes
- **Gestion d'erreurs** : messages d'erreur en français, codes HTTP appropriés
- **503 si service indisponible** : message clair quand un microservice ne répond pas
- **Architecture extensible** : ajouter un service = nouvelle config proxy + une ligne dans server.js

## Architecture

```
                  ┌─────────────┐
                  │  Frontend   │
                  └──────┬──────┘
                         │
                         ▼
              ┌───────────────────┐
              │   API Gateway     │
              │  (port 3000)      │
              │                   │
              │ CORS → Logger →   │
              │ RateLimiter → Auth│
              │ → Proxy           │
              └───┬─────┬─────┬──┘
                  │     │     │
           ┌──────┘     │     └──────┐
           ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │   user   │ │  patient │ │consult.  │
    │ -service │ │ -service │ │ -service │
    │  :3001   │ │  :3002   │ │  :3003   │
    └──────────┘ └──────────┘ └──────────┘
```
