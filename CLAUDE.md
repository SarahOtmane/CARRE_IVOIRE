# CLAUDE.md — Carré Ivoire

> Lis ce fichier en premier, sans exception. Il définit les règles absolues du projet.

---

## Projet

Plateforme e-commerce de chocolaterie artisanale premium — **Carré Ivoire**.

```
Monorepo :
  apps/front-office   → SPA client (Vue.js 3 + Tailwind) — inclut l'admin (apps/back-office a été supprimé,
                        fusionné dans apps/front-office/src/pages/admin/)
  apps/api            → API REST   (NestJS + Sequelize)
  packages/ui         → Composants Vue partagés (cible finale du design)
  packages/types      → Interfaces TypeScript partagées API ↔ Frontend
  packages/config     → Tailwind preset, ESLint, TypeScript config
  packages/composables → Logique métier frontend partagée (appels API, panier, favoris, CRUD admin…)
  packages/stores      → État global Pinia partagé (auth, cart, notification…)
```

---

## Stack

| Couche   | Technologie                                                  |
| -------- | ------------------------------------------------------------ |
| Backend  | NestJS 10 · Sequelize 6 · MySQL 8 · JWT · Bcrypt · Stripe    |
| Frontend | Vue.js 3 (Composition API) · Pinia 2 · Tailwind CSS 3 · Vite |
| Infra    | Docker Compose · Nginx · Node 20 Alpine                      |

---

## ⚠️ Design System — Source de vérité UI

**`packages/config/styles/colors-and-type.css` est la source de vérité absolue pour les tokens UI.**
Ne jamais inventer de design. Ne jamais dévier des tokens. Toujours lire avant de coder.

### Fichiers à lire avant tout développement frontend

| Fichier                                      | Contenu                                                            | Priorité            |
| -------------------------------------------- | ------------------------------------------------------------------ | ------------------- |
| `packages/config/styles/colors-and-type.css` | **Tous les tokens CSS** — palette, typographie, espacement, motion | Obligatoire         |
| `packages/ui/`                               | Composants Vue partagés de référence                               | Obligatoire         |
| `apps/front-office/src/components/`          | Composants spécifiques front-office                                | Si feature frontend |

### Tokens couleur — mapping CSS → Tailwind

Les valeurs CSS de `packages/config/styles/colors-and-type.css` sont mappées dans `packages/config/tailwind/preset.js` :

| CSS var          | Hex       | Classe Tailwind           | Usage                                          |
| ---------------- | --------- | ------------------------- | ---------------------------------------------- |
| `--ivoire`       | `#F6E8DE` | `bg-ivoire`               | Fond dominant du site                          |
| `--rose-poudre`  | `#E8C9BC` | `bg-rose-poudre`          | Surfaces secondaires, hover                    |
| `--beige-doux`   | `#D9BFA9` | `bg-beige-doux`           | Cartes sur ivoire, thumbnails                  |
| `--brun-cacao`   | `#3A1F14` | `text-cacao` / `bg-cacao` | Texte corps, boutons primaires                 |
| `--brun-cacao-2` | `#5E3A2A` | `text-cacao-2`            | Texte secondaire, bordures                     |
| `--dore`         | `#B08A4F` | `text-dore`               | Prix, labels accent — jamais en fond de bouton |
| `--papier`       | `#FFFBF7` | `bg-papier`               | Fond images produit                            |

### Typographie

| Rôle             | Police                     | Classe Tailwind |
| ---------------- | -------------------------- | --------------- |
| Display / Titres | Cormorant Garamond (serif) | `font-display`  |
| Body / UI / Nav  | Inter (sans-serif)         | `font-body`     |
| Labels eyebrow   | Inter uppercase tracked    | `font-label`    |

### Règles design NON NÉGOCIABLES

```
FORME
✅ border-radius: 0 partout — ZÉRO arrondi sauf avatar (cercle complet)
✅ Images produit : crop 1:1 obligatoire sur fond --papier
✅ Une seule image dominante par section — jamais de mosaïque
✅ Grille 12 colonnes desktop, gouttières 32px, max-width 1440px
✅ Espacement vertical entre sections : 96–192px (respiration = la marque)

COULEURS
✅ --ivoire est le fond par défaut du site
✅ --brun-cacao = texte et boutons primaires — pas un fond de section
✅ --dore uniquement sur : prix, label "NOUVEAU", numéros de section, underline hover
❌ Jamais de blanc pur (#FFF) ni de noir pur (#000)
❌ Jamais de mosaïque de couleurs dans une section

TYPOGRAPHIE
✅ Titres héros, noms produits, section openers → Cormorant Garamond, souvent italic
✅ Body, nav, UI, prix, labels → Inter
✅ Eyebrows : Inter 11px, uppercase, letter-spacing: 0.18em
✅ Navigation lowercase (boutique, maison, journal)
✅ Boutons Title Case court (Ajouter au panier, Découvrir)
❌ Jamais d'emoji dans l'UI ni dans le copy
❌ Jamais de "!" sauf moment exceptionnel gagné
❌ Jamais de superlatifs (le meilleur, incroyable, exceptionnel)

OMBRES & BORDURES
✅ Pas de drop-shadow sauf produit : filter: drop-shadow(0 24px 32px rgba(58,31,20,0.08))
✅ Bordures dividers : 1px solid var(--brun-cacao) à 12% alpha
❌ Pas de card avec ombre portée
❌ Pas de double bordure

ICÔNES
✅ Sprite custom : <use href="/assets/icons/sprite.svg#ci-NAME"/>
✅ stroke-width: 1.25, stroke-linecap: square, stroke-linejoin: miter
✅ Icônes manquantes → Lucide avec mêmes paramètres
❌ Jamais d'icônes filled/pleines

ANIMATIONS
✅ Easing UI : cubic-bezier(0.2, 0.8, 0.2, 1)
✅ Durées : 180ms micro, 400ms cartes, 800ms scroll fades
✅ Hover image : scale 1.03 en 800ms
✅ Hover lien : underline draw from left en 240ms
❌ Jamais de bounce, spring, jiggle
❌ Pas d'opacity seule pour le hover

COPY
✅ Français obligatoire — ton sensoriel, retenu, légèrement littéraire
✅ "Vous" — jamais "tu"
✅ Phrases courtes. Très courtes. ("Pur.")
✅ Verbes sensoriels : éclate, fond, craque, coule, se dépose
❌ Jamais de photo de stock
```

### Workflow d'implémentation UI (toujours dans cet ordre)

```
1. Lire   → packages/ui/ + composants Vue existants
2. Lire   → packages/config/styles/colors-and-type.css (tokens)
3. Extraire → structure visuelle, états, interactions du composant de référence
4. Réimplémenter → en Vue 3 + Tailwind (ne pas copier un autre framework verbatim)
5. Cibler → packages/ui/ si partagé entre portails, sinon apps/front-office/src/components/
6. Valider → tokens Tailwind = CSS vars du design
```

---

## Documentation technique

| Fichier                   | Lire pour                                            |
| ------------------------- | ---------------------------------------------------- |
| `ai_docs/architecture.md` | Structure monorepo, modules NestJS, stores Pinia     |
| `ai_docs/database.md`     | Schéma MySQL, migrations Sequelize                   |
| `ai_docs/pattern.md`      | Patterns Repository, DTO, Guard, Transaction         |
| `ai_docs/services.md`     | Contrats API REST, format de réponse, codes d'erreur |
| `ai_docs/concept.md`      | Vision produit, pages, parcours utilisateurs         |

---

## Règles techniques absolues

**Backend :**

1. Pattern Repository obligatoire — jamais de Sequelize direct dans un Service
2. Guards : `JwtAuthGuard` (client) · `JwtAuthGuard + AdminGuard` (admin)
3. Format : `{ success: true, data }` · erreurs : `{ success: false, error: { code, message } }`
4. DTOs avec `class-validator` · `whitelist: true` sur ValidationPipe global
5. Stock → transaction Sequelize · `rowsAffected === 0` → rollback → `OUT_OF_STOCK`

**Frontend :**

1. Composition API uniquement
2. Pages = orchestrateurs (zéro logique inline)
3. Logique → composables · État global → Pinia
4. Composants présentationnels, props typées, sans appels API
5. Tailwind uniquement — tokens dans `packages/config/tailwind/preset.js`

---

## Commandes Docker

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
docker compose exec backend npm run build
docker compose exec front-office npm run build
docker compose logs -f backend
stripe listen --forward-to https://api.carre-ivoire/api/v1/stripe/webhook
```

## URLs locales

| Service      | URL                          |
| ------------ | ---------------------------- |
| Front Office | http://localhost:5173        |
| Back Office  | http://localhost:5173/admin  |
| API          |https://api.carre-ivoire/api/v1 |

---

## Workflow

```
Nouvelle feature  → scripts/create_prp.sh "<description>"
Implémenter       → scripts/implement_prp.sh "<feature>.md"
Nouveau composant → lire tokens partagés + composants Vue existants → packages/ui/
Toujours          → Explore → Plan (pause + confirmation) → Code → Test
```
