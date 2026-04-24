# Carré Ivoire

Plateforme e-commerce de chocolaterie artisanale premium.

## Stack

| Couche | Technologie |
|---|---|
| Backend | NestJS 10 · Sequelize 6 · MySQL 8 · JWT · Bcrypt · Stripe |
| Frontend | Vue.js 3 (Composition API) · Pinia 2 · Tailwind CSS 3 · Vite |
| Infra | Docker Compose · Nginx · Node 20 Alpine |

## Structure

```
carre_ivoire/
├── apps/
│   ├── api/            → API REST (NestJS)
│   ├── front-office/   → SPA client (Vue.js)
│   └── back-office/    → SPA admin (Vue.js)
├── packages/
│   ├── types/          → Interfaces TypeScript partagées
│   ├── ui/             → Composants Vue partagés
│   └── config/         → Tailwind preset, ESLint, TypeScript config
├── docker/
│   ├── nginx/          → Configuration Nginx (prod + SPA)
│   └── mysql/          → Script d'initialisation MySQL
├── docker-compose.yml
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

## Démarrage rapide

### Prérequis

- Docker & Docker Compose
- Node.js 20 (pour le développement local)

### 1. Variables d'environnement

```bash
cp .env.example .env
```

Remplir les valeurs dans `.env` :

| Variable | Description |
|---|---|
| `DB_PASSWORD` | Mot de passe MySQL |
| `JWT_SECRET` | Secret JWT access token (min. 32 caractères) |
| `REFRESH_TOKEN_SECRET` | Secret JWT refresh token (min. 32 caractères) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe (`whsec_...`) |
| `ADMIN_EMAIL` | Email du compte admin initial |
| `ADMIN_PASSWORD` | Mot de passe du compte admin initial |

### 2. Lancer l'environnement de développement

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 3. Migrations et données initiales

Dans un second terminal, après que les conteneurs soient UP :

```bash
# Appliquer les migrations
docker compose exec backend npx sequelize-cli db:migrate

# Injecter les catégories et l'utilisateur admin
docker compose exec backend npx sequelize-cli db:seed:all
```

### URLs locales

| Service | URL |
|---|---|
| Front Office | http://localhost:5173 |
| Back Office | http://localhost:5174 |
| API | http://localhost:3000/api/v1 |
| Health | http://localhost:3000/api/health |

> **Back Office** : désactivé par défaut. Pour l'activer :
> ```bash
> docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile back-office up
> ```

## API

### Authentification

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Inscription client |
| `POST` | `/api/v1/auth/login` | Connexion |
| `POST` | `/api/v1/auth/refresh` | Rafraîchir le token |
| `POST` | `/api/v1/auth/logout` | Déconnexion |

### Format des réponses

```json
// Succès
{ "success": true, "data": { ... }, "timestamp": "2026-04-24T..." }

// Erreur
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "...", "statusCode": 401 } }
```

## Base de données

6 tables dans l'ordre de dépendance :

1. `categories`
2. `products` → FK categories
3. `users`
4. `orders` → FK users
5. `order_items` → FK orders, products
6. `favorites` → FK users, products

## Commandes utiles

```bash
# Logs
docker compose logs -f backend
docker compose logs -f frontend

# Shell
docker compose exec backend sh
docker compose exec database mysql -u carre_user -p carre_ivoire

# Annuler la dernière migration
docker compose exec backend npx sequelize-cli db:migrate:undo

# Stripe webhooks en local
stripe listen --forward-to localhost:3000/api/v1/stripe/webhook
```

## Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```
