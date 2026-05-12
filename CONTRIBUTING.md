# Contribuer à Carré Ivoire

Merci de votre intérêt pour le projet. Ce guide définit le workflow de contribution.

## Avant de commencer

- **Node.js 20** et **Docker** installés
- Lire `DEVELOPMENT.md` pour la setup locale
- Lire `ARCHITECTURE.md` pour comprendre la structure
- Lire `docs/patterns.md` pour les conventions de code

## Workflow

### 1. Créer une branche

```bash
git checkout -b feature/ma-feature
# ou
git checkout -b fix/mon-bug
```

Convention : `feature/`, `fix/`, `docs/`, `chore/`, `refactor/` + description en kebab-case.

### 2. Développer

- Suivre les patterns décrits dans `docs/patterns.md`
- Code partagé → `packages/` (composables, stores, types, ui, config)
- Code métier app → `apps/[app]/src/`
- Aucune duplication entre front-office et back-office

### 3. Linter et build

```bash
# Depuis la racine
npm run lint --workspaces
npm run build --workspaces
```

Ne pas pousser si les linters échouent.

### 4. Commits — Conventional Commits

```
feat(api): ajouter endpoint de création de produit
fix(front): corriger le style du bouton principal
docs: mettre à jour README
chore(deps): upgrader Vite à v5.1
refactor(stores): extraire authStore vers packages/stores
```

| Préfixe    | Usage                          |
| ---------- | ------------------------------ |
| `feat`     | Nouvelle feature               |
| `fix`      | Correction de bug              |
| `docs`     | Documentation uniquement       |
| `style`    | Formatage, pas de logique      |
| `refactor` | Refacto sans changement métier |
| `perf`     | Optimisation de performance    |
| `test`     | Tests ajoutés ou modifiés      |
| `chore`    | Dépendances, configuration     |

### 5. Pull Request

Utiliser le template `.github/pull_request_template.md`.

Points de contrôle avant de soumettre :
- Build réussit : `npm run build --workspaces`
- Linters passent : `npm run lint --workspaces`
- Pas de code dupliqué entre les apps
- Documentation mise à jour si comportement change

---

## Architecture — Où mettre le code

| Type                       | Emplacement                     |
| -------------------------- | ------------------------------- |
| Composant Vue réutilisé    | `packages/ui/src/components/`   |
| Composable partagé         | `packages/composables/src/`     |
| Store Pinia partagé        | `packages/stores/src/`          |
| Type TypeScript partagé    | `packages/types/src/`           |
| Config ESLint / TS / TW    | `packages/config/`              |
| Feature métier front-office| `apps/front-office/src/`        |
| Feature métier back-office | `apps/back-office/src/`         |
| Module API NestJS          | `apps/api/src/[module]/`        |

Voir `ARCHITECTURE.md` pour le détail.

---

## Conventions Backend (NestJS)

- Repository pattern obligatoire — jamais Sequelize direct dans un Service
- DTOs avec `class-validator`, `whitelist: true` global
- Guards : `JwtAuthGuard` (client), `JwtAuthGuard + AdminGuard` (admin)
- Format réponse : `{ success: true, data }` / `{ success: false, error: { code, message } }`
- Transactions Sequelize pour les opérations sur le stock

Voir `docs/patterns.md`.

## Conventions Frontend (Vue 3)

- Composition API uniquement — pas d'Options API
- Pages = orchestrateurs (pas de logique inline)
- Logique réutilisable → composables
- État global → Pinia (stores)
- Composants présentationnels, props typées, sans appels API directs
- Tailwind uniquement — tokens dans `packages/config/tailwind/preset.js`

Voir `docs/patterns.md` et `ai_design/README.md`.

---

## Troubleshooting courant

### Build échoue

```bash
rm -rf node_modules
npm install
npm run build --workspaces
```

### Docker ne démarre pas

```bash
docker compose logs backend
docker compose down -v
./scripts/docker-dev.sh
```

### Module `@carre-ivoire/...` introuvable

```bash
npm install
# Les symlinks workspace sont créés automatiquement
```

---

Voir aussi : `DEVELOPMENT.md` · `ARCHITECTURE.md` · `docs/patterns.md`
