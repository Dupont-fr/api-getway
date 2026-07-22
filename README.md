# MediSys — api-getway

Point d'entrée unique de l'application MediSys. Proxy inverse vers les microservices avec authentification JWT centralisée.

## Stack

- **Runtime** : Node.js
- **Framework** : Express
- **Proxy** : http-proxy-middleware
- **Auth** : JWT (jsonwebtoken)
- **Rate Limiting** : express-rate-limit

## Démarrage

```bash
cp .env.example .env
npm install
npm run dev
```

Port par défaut : `5000`

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `PORT` | Port du Gateway | 5000 |
| `NODE_ENV` | Environnement | development |
| `JWT_SECRET` | Clé JWT (doit correspondre aux services) | — |
| `USER_SERVICE_URL` | URL du user-service | http://localhost:5001 |
| `PATIENT_SERVICE_URL` | URL du patient-service | http://localhost:5002 |
| `CONSULTATION_SERVICE_URL` | URL du consultation-service | http://localhost:5003 |
| `STATISTIC_SERVICE_URL` | URL du statistic-service | http://localhost:5004 |
| `RATE_LIMIT_WINDOW_MS` | Fenêtre de rate limiting | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Requêtes max par fenêtre | 100 |

## Routage

| Préfixe | Cible | Service |
|---|---|---|
| `/api/users/*` | user-service :5001 | Utilisateurs, hôpitaux |
| `/api/patients/*` | patient-service :5002 | Patients |
| `/api/consultations/*` | consultation-service :5003 | Consultations |
| `/api/statistics/*` | statistic-service :5004 | Statistiques |

## Endpoints publics (sans token)

- `POST /api/users/login`
- `POST /api/users/register`
- `POST /api/users/signup`
- `POST /api/users/forgot-password`

## Middleware stack

1. **CORS**
2. **Logger** — journalisation des requêtes
3. **Rate Limiter** — anti-brute force
4. **Auth** — vérification JWT
5. **Proxy** — redirection vers le microservice
6. **Error Handler** — gestion centralisée des erreurs

## Architecture

```
Frontend → Gateway (:5000) → /api/users/* → user-service (:5001)
                           → /api/patients/* → patient-service (:5002)
                           → /api/consultations/* → consultation-service (:5003)
                           → /api/statistics/* → statistic-service (:5004)
```

## Dépôts liés

| Service | Dépôt |
|---|---|
| Frontend | [Dupont-fr/IN3_project-frontend](https://github.com/Dupont-fr/IN3_project-frontend) |
| User-service | [Dupont-fr/Hospital](https://github.com/Dupont-fr/Hospital) |
| Patient-service | [Dupont-fr/patient-service](https://github.com/Dupont-fr/patient-service) |
| Consultation-service | [Dupont-fr/consultations-service](https://github.com/Dupont-fr/consultations-service) |
| Statistic-service | [Dupont-fr/Statistique-service](https://github.com/Dupont-fr/Statistique-service) |
