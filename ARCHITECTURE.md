# Architecture — Carré Ivoire

## Vue d'ensemble

```
carre_ivoire/ (Monorepo — npm workspaces)
├── apps/
│   ├── api/            NestJS 10 · Sequelize 6 · MySQL 8
│   ├── front-office/   Vue.js 3 · Pinia · Tailwind · Vite
│   └── back-office/    Vue.js 3 · Pinia · Tailwind · Vite
├── packages/
│   ├── config/         Tailwind preset · ESLint · TypeScript configs
│   ├── types/          Interfaces TypeScript partagées API ↔ Frontend
│   ├── ui/             Composants Vue partagés (Button, Badge, Card, Modal)
│   ├── composables/    Logiques Vue partagées (useAuth, useApi, useNotification...)
│   └── stores/         Stores Pinia partagés (auth, notification)
├── docker/             Configs Nginx et MySQL
├── scripts/            Scripts de démarrage Docker
└── ai_design/          Design system (couleurs, typographie, composants)
```

---

## Dépendances entre packages

```
apps/front-office ──┐
                    ├── @carre-ivoire/ui
                    ├── @carre-ivoire/composables ──→ @carre-ivoire/stores
                    ├── @carre-ivoire/stores
                    ├── @carre-ivoire/types
                    └── @carre-ivoire/config

apps/back-office  ──┤ (mêmes dépendances)

apps/api ───────────┼── @carre-ivoire/types
                    └── @carre-ivoire/config
```

Les packages sont résolus via les symlinks npm workspaces (`node_modules/@carre-ivoire/*`).

---

## Backend (apps/api)

### Couches

```
Controller  →  reçoit les requêtes HTTP, appelle le Service
Service     →  logique métier, appelle le Repository
Repository  →  accès BDD via Sequelize (jamais dans le Service)
Model       →  définition Sequelize de la table
Guard       →  protège les routes (JwtAuthGuard, AdminGuard)
DTO         →  valide et transforme les données entrantes
```

### Modules

| Module | Routes | Guards |
|---|---|---|
| `auth` | POST /auth/login, /register, /refresh, /logout | — |
| `users` | GET/PATCH /users/me | JwtAuthGuard |
| `products` | GET /products, GET /products/:slug | — |
| `products` (admin) | POST/PATCH/DELETE /products | JwtAuthGuard + AdminGuard |
| `categories` | GET /categories | — |
| `orders` | POST /orders, GET /orders/me | JwtAuthGuard |
| `orders` (admin) | GET /orders, PATCH /orders/:id | JwtAuthGuard + AdminGuard |
| `health` | GET /health | — |

### Format de réponse standard

```json
// Succès
{ "success": true, "data": { ... }, "timestamp": "..." }

// Erreur
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "..." } }
```

---

## Frontend (apps/front-office & apps/back-office)

### Architecture par couche

```
Pages        →  orchestrateurs (aucune logique inline)
Components   →  présentationnels, props typées, pas d'appels API
Composables  →  logique réutilisable (useProduct, useCart...)
Stores       →  état global Pinia (auth, cart, notifications...)
```

### Router

Chaque app définit son propre `router/index.ts` avec ses routes et `router/guards.ts` pour la protection.

Les guards utilisent `useAuthStore` depuis `@carre-ivoire/stores`.

### Packages partagés utilisés

```typescript
// Auth
import { useAuthStore } from '@carre-ivoire/stores'
import { useAuth } from '@carre-ivoire/composables'

// API
import { useApi } from '@carre-ivoire/composables'

// Notifications
import { useNotification } from '@carre-ivoire/composables'
import { useNotificationStore } from '@carre-ivoire/stores'

// Chargement
import { useLoading } from '@carre-ivoire/composables'

// Composants UI
import { Button, Badge, Card, Modal } from '@carre-ivoire/ui'

// Types
import type { ProductResponse, OrderResponse } from '@carre-ivoire/types'
```

---

## Packages Partagés

### packages/config

Centralise toutes les configurations outillage.

```
packages/config/
├── tailwind/preset.js      Tokens couleur (CSS vars), fonts, border-radius
├── eslint/
│   ├── vue.js              ESLint pour Vue 3 + TypeScript
│   └── nest.js             ESLint pour NestJS + TypeScript
└── typescript/
    ├── base.json           Options communes strict
    ├── vue.json            Vite/Vue (moduleResolution: bundler, noEmit)
    └── nest.json           NestJS (commonjs, decorators, emitDecoratorMetadata)
```

Chaque app étend depuis ce package :
```json
// apps/front-office/tsconfig.json
{ "extends": "@carre-ivoire/config/typescript/vue" }
```

### packages/types

Types TypeScript partagés entre le backend et les deux frontends.

```
packages/types/src/
├── api.types.ts        Réponse générique, pagination
├── product.types.ts    ProductResponse, CreateProductDto
├── order.types.ts      OrderResponse, OrderStatus
├── user.types.ts       UserResponse, UserRole
└── index.ts            Exports
```

### packages/ui

Composants Vue réutilisables conformes au design system.

```
packages/ui/src/components/
├── Button.vue    Variants: primary / secondary / outline. Tailles: sm / md / lg
├── Badge.vue     Variants: default / accent / success / warning / error
├── Card.vue      Conteneur avec bordure design system, transparent option
└── Modal.vue     Overlay avec Teleport, Transition, close on backdrop
```

Usage :
```typescript
import { Button, Badge, Card, Modal } from '@carre-ivoire/ui'
```

### packages/composables

Logiques Vue partagées entre les deux apps.

| Composable | Description |
|---|---|
| `useAuth()` | Accès au store auth (token, user, isAdmin, setAuth, logout) |
| `useApi()` | Instance Axios avec intercepteur JWT + gestion d'erreur |
| `useNotification()` | API toast (success, error, warning, info) |
| `useLoading()` | État chargement + helper `withLoading<T>(fn)` |

### packages/stores

Stores Pinia partagés.

| Store | État | Persisté |
|---|---|---|
| `useAuthStore` | token, user, isAuthenticated, isAdmin, fullName | Oui (pinia-plugin-persistedstate) |
| `useNotificationStore` | notifications[], addNotification, removeNotification | Non |

---

## Design System (ai_design/)

Source de vérité absolue pour toute l'UI.

### Tokens couleur

| Classe Tailwind | CSS var | Usage |
|---|---|---|
| `bg-ivoire` | `--ivoire` | Fond dominant |
| `bg-rose-poudre` | `--rose-poudre` | Surfaces secondaires |
| `bg-beige-doux` | `--beige-doux` | Cartes, thumbnails |
| `text-brun-cacao` / `bg-brun-cacao` | `--brun-cacao` | Texte, boutons primaires |
| `text-dore` | `--dore` | Prix, labels accent |
| `bg-papier` | `--papier` | Fond images produit |

### Typographie

| Rôle | Classe Tailwind | Police |
|---|---|---|
| Titres / Display | `font-display` | Cormorant Garamond |
| Corps / UI / Nav | `font-body` | Inter |
| Labels eyebrow | `font-label` | Inter uppercase |

### Règles non négociables

- `border-radius: 0` partout (sauf avatar = cercle complet)
- Jamais de blanc pur (`#FFF`) ni noir pur (`#000`)
- Jamais d'ombre portée sur les cartes
- Icônes : stroke uniquement, `stroke-width: 1.25`

---

## Infrastructure Docker

### Profils

| Profil | Active |
|---|---|
| (aucun) | front-office + API + DB |
| `back-office` | Ajoute le portail admin |
| `nginx` | Ajoute nginx en dev (port 80) |

### Stages Dockerfile

| Stage | Usage |
|---|---|
| `development` | Hot-reload, volumes montés |
| `build` | Compilation production |
| `production` | Image minimale Nginx/Node |

### Volumes nommés

`node_modules_api`, `node_modules_front`, `node_modules_back` — persistent entre redémarrages pour éviter de réinstaller les dépendances.

---

## Flux de données typiques

### Authentification

```
Form de login (Vue)
  → POST /api/v1/auth/login
  → Backend : vérifie mot de passe (bcrypt), émet JWT
  → Frontend : setAuth(token, user) dans authStore
  → Routes protégées accessibles
```

### Création d'un produit (Admin)

```
Formulaire back-office
  → POST /api/v1/products (avec Bearer token)
  → JwtAuthGuard + AdminGuard → vérifient le token et le rôle
  → ProductService → ProductRepository → Sequelize → MySQL
  → Réponse 201 + { success: true, data: product }
  → Front-office recharge le catalogue
```

### Panier → Commande

```
Ajout au panier → cartStore (Pinia, persisté)
  → Checkout : POST /api/v1/orders
  → Backend : transaction Sequelize (stock vérifié, rowsAffected === 0 → rollback)
  → Stripe : createPaymentIntent
  → Frontend : redirige vers confirmation
```

---

## Scalabilité

Pour ajouter un nouveau portail (ex : dashboard client) :

1. Créer `apps/customer-portal/` avec Vite + Vue
2. Importer depuis `@carre-ivoire/composables`, `@carre-ivoire/ui`, `@carre-ivoire/stores`
3. Étendre `@carre-ivoire/config/typescript/vue` et `@carre-ivoire/config/tailwind`
4. Ajouter dans `docker-compose.yml` avec son port
5. Zéro duplication d'auth, API, stores — tout est partagé

---

Voir aussi : `CONTRIBUTING.md` · `DEVELOPMENT.md` · `docs/patterns.md`
