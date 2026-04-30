# Prompt de génération – API Gateway

Tu es un ingénieur backend senior spécialisé en Node.js et en architecture microservices.

Ta mission est de générer un API Gateway complet, propre et prêt à l’usage en utilisant Node.js, Express et http-proxy-middleware.

## Contexte

Nous développons une application de gestion hospitalière basée sur une architecture microservices. Le système est composé des services suivants :

- user-service : authentification et gestion des rôles (administrateur, médecin, agent d’accueil)
- patient-service : création, recherche et gestion des informations des patients
- consultation-service : gestion des dossiers médicaux, consultations et historiques

L’API Gateway doit servir de point d’entrée unique pour toutes les requêtes provenant du frontend.

## Exigences techniques

1. Utiliser Node.js avec Express
2. Utiliser http-proxy-middleware pour rediriger les requêtes vers les microservices
3. Proposer une structure de projet claire, modulaire et évolutive
4. Utiliser dotenv pour la gestion des variables d’environnement
5. Intégrer un système de logs simple (console ou middleware)
6. Mettre en place un gestionnaire global des erreurs
7. Ajouter un middleware d’authentification (préparé pour JWT, même simple)
8. Concevoir le projet de manière à pouvoir ajouter facilement de nouveaux microservices

## Routage attendu

- /api/users → user-service
- /api/patients → patient-service
- /api/consultations → consultation-service

Les URLs des microservices doivent être configurables via des variables d’environnement.

## Résultat attendu

Générer les éléments suivants :

1. La structure complète du projet (arborescence des dossiers)
2. Le fichier principal server.js
3. La configuration des proxys vers les microservices
4. Des exemples de middlewares (authentification, gestion des erreurs)
5. Un fichier .env d’exemple
6. Un fichier package.json avec toutes les dépendances nécessaires

## Contraintes

- Le code doit rester simple et compréhensible pour des étudiants
- Ajouter des commentaires explicatifs dans les parties importantes
- Respecter les bonnes pratiques sans complexifier inutilement

## Bonus (optionnel)

- Ajouter un middleware de limitation de requêtes (rate limiting)
- Ajouter un exemple de validation des requêtes

Le résultat final doit être directement utilisable par une équipe ayant un niveau intermédiaire en Node.js.
