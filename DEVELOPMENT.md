# Guide de Développement Local

## Prérequis

| Outil | Version | Vérifier |
|---|---|---|
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| Docker Desktop | Récent | `docker --version` |
| Git | Récent | `git --version` |

---

## Setup Initial

### 1. Cloner et installer les dépendances

```bash
git clone <repo>
cd carre_ivoire
npm install
```

`npm install` à la racine installe **toutes** les dépendances du monorepo et crée les symlinks `@carre-ivoire/*` dans `node_modules/`.

### 2. Variables d'environnement

```bash
cp .env.example .env
```

Remplir au minimum dans `.env` :

| Variable | Valeur dev |
|---|---|
| `DB_PASSWORD` | Peut rester `changeme` en local |
| `JWT_SECRET` | 32+ caractères aléatoires |
| `REFRESH_TOKEN_SECRET` | 32+ caractères aléatoires |
| `STRIPE_SECRET_KEY` | Clé test Stripe (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe (`whsec_...`) |

Générer des secrets :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Lancer Docker

```bash
# Option rapide (script)
./scripts/docker-dev.sh

# Option manuelle
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Premier démarrage : 2-3 min (installation des dépendances dans les conteneurs).
Démarrages suivants : 30-60 sec (cache des volumes node_modules).

### 4. Initialiser la base de données

Dans un second terminal après que les conteneurs soient UP :

```bash
# Appliquer les migrations
docker compose exec backend npx sequelize-cli db:migrate

# Charger les données initiales (catégories, admin)
docker compose exec backend npx sequelize-cli db:seed:all
```

### 5. Accéder aux services

| Service | URL | Notes |
|---|---|---|
| Front Office | http://localhost:5173 | Vite dev server, hot-reload |
| Back Office | http://localhost:5174 | Profil `back-office` requis |
| API | http://localhost:3000/api/v1 | NestJS |
| API Health | http://localhost:3000/api/health | Ping |
| MySQL | localhost:3307 | Accès direct depuis l'hôte |

> **Back Office** : désactivé par défaut.
> ```bash
> docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile back-office up
> ```

---

## Workflows Courants

### Développer le Backend uniquement

```bash
# Terminal 1 : démarrer uniquement la BDD
docker compose up database

# Terminal 2 : backend local (hot-reload nodemon)
npm --prefix apps/api run start:dev
```

### Développer le Frontend uniquement

```bash
# Terminal 1 : backend + BDD en Docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up backend

# Terminal 2 : Vite local
npm --prefix apps/front-office run dev
```

### Modifier un package partagé

Les packages (`packages/ui`, `packages/composables`, etc.) sont montés dans les conteneurs via le volume `./packages:/app/packages`. Les changements sont visibles immédiatement par hot-reload.

### Linter et builder le monorepo

```bash
# Lint tout
npm run lint --workspaces

# Lint et corriger
npm run lint --workspaces -- --fix

# Build tout
npm run build --workspaces

# Build une seule app
npm --prefix apps/api run build
```

---

## Debugging

### Backend (NestJS)

**Logs Docker :**
```bash
docker compose logs -f backend
docker compose logs backend --tail 50
```

**Mode debug :**
```bash
docker compose exec backend npm run start:debug
# Puis attacher un debugger Node.js sur le port 9229
```

**VS Code** — créer `.vscode/launch.json` :
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Backend",
      "port": 9229,
      "restart": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Frontend (Vue 3)

Utiliser **Vue DevTools** dans le navigateur :
- [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

Les stores Pinia sont inspectables directement dans l'onglet Vue DevTools.

### Base de données

```bash
# Connexion directe MySQL
docker compose exec database mysql -u carre_user -p carre_ivoire

# Ou depuis l'hôte (port 3307)
mysql -h 127.0.0.1 -P 3307 -u carre_user -p carre_ivoire
```

---

## Docker Cheat Sheet

```bash
# Démarrer / arrêter
./scripts/docker-dev.sh
./scripts/docker-stop.sh

# Logs en temps réel
docker compose logs -f backend
docker compose logs -f front-office

# Shell dans un conteneur
docker compose exec backend sh
docker compose exec database sh

# Rebuild une image (après changement Dockerfile ou dépendances)
docker compose build --no-cache backend

# Reset complet (supprime les volumes node_modules + données MySQL)
./scripts/docker-dev.sh --clean

# Migrations
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:migrate:undo
docker compose exec backend npx sequelize-cli db:seed:all
```

---

## Troubleshooting

### "Cannot find module '@carre-ivoire/...'"

Les symlinks workspace ne sont pas créés.

```bash
npm install
# Les symlinks sont créés dans node_modules/@carre-ivoire/
```

### "Port 3000 already in use"

Un autre processus occupe le port.

```bash
lsof -i :3000   # macOS/Linux
# Tuer le processus ou changer le port dans .env (API_PORT)
```

### "database connection refused"

MySQL met ~30 sec à démarrer. Attendre et relancer, ou :

```bash
docker compose logs database
# Chercher : "ready for connections"
docker compose restart backend
```

### Hot-reload ne fonctionne pas

Le volume source n'est peut-être pas monté correctement.

```bash
docker compose ps
docker compose down
./scripts/docker-dev.sh
```

### "Permission denied" sur les scripts

```bash
chmod +x scripts/*.sh
```

### TypeScript : "Property does not exist"

Souvent un problème de cache `vue-tsc`. Relancer :

```bash
npm --prefix apps/front-office run build
```

---

## Ressources

- `ARCHITECTURE.md` — Structure du monorepo, couches, dépendances
- `CONTRIBUTING.md` — Conventions de code et de commit
- `docs/patterns.md` — Patterns Repository, DTO, Guard, Composable
- `ai_docs/` — Documentation métier (services, database, concept)
- `ai_design/` — Design system (couleurs, typographie, composants)
