# ROADMAP TECHNIQUE — Carré Ivoire

> Document de pilotage technique basé sur l'audit complet du projet (backend NestJS/Sequelize, frontend Vue3/Pinia, packages partagés, infrastructure Docker/Nginx, tests). À utiliser comme backlog directement importable (Jira/Linear/GitHub Projects).

---

## Résumé exécutif

**État actuel du projet** : architecture monorepo saine sur le papier (pattern Repository, Guards JWT/Admin, format de réponse `{success,data}`, design tokens cohérents), mais trois bloquants absolus empêchent une mise en production : schéma de base de données non maîtrisé (modèles Sequelize à fiabiliser, stratégie de migrations à réintroduire avant la prod), tunnel de paiement frontend entièrement simulé, et absence totale de CI/CD. S'y ajoutent une dette de cohérence (types dupliqués/divergents, triple aliasing de tokens, code mort) et une couverture de tests nulle sur les zones les plus sensibles (Stripe, Guards, controllers).

**Nombre total de tâches** : 33

**Répartition par priorité**

| Priorité | Nombre de tâches |
| -------- | ---------------- |
| Critique | 6                |
| Haute    | 12               |
| Moyenne  | 11               |
| Faible   | 5                |

**Estimation globale** : ~46 jours/homme (≈ 9-10 sprints d'une semaine pour une équipe de 1 développeur senior ; ÷2 à ÷3 avec une équipe de 2-3 personnes en parallélisant les domaines indépendants).

**Principaux risques**

- Le projet n'a pas encore d'environnement de production : la stratégie retenue pour Phase 1 est de piloter le schéma directement depuis les modèles Sequelize (`sync({ alter: true })`) en local, sans système de migrations. Cette décision devra être révisée **avant** tout premier déploiement en production (un système de migrations redevient alors nécessaire pour des évolutions de schéma maîtrisées sur des données réelles) — à inscrire comme prérequis de mise en production, hors périmètre de cette roadmap tant qu'il n'y a pas de prod.
- L'intégration Stripe réelle (Phase 1) est sur le chemin critique et bloque toute la Phase 3 commerciale — à démarrer en priorité absolue.
- La refonte des types partagés (ARCH-003) touche transversalement API + frontend + packages/stores : risque de régression large si non accompagnée de tests de contrat.

---

## Vue d'ensemble

| ID        | Domaine         | Tâche                                                                          | Priorité | Effort | Dépendances |
| --------- | --------------- | ------------------------------------------------------------------------------ | -------- | ------ | ----------- |
| PREP-002  | Préparation     | Mettre à jour CLAUDE.md (composables/stores, back-office fusionné)             | Haute    | XS     | —           |
| PREP-003  | Préparation     | Vérifier l'exécution des suites de tests existantes (npm install, CI locale)   | Haute    | XS     | —           |
| DB-001    | Base de données | Synchroniser le schéma DB directement depuis les modèles Sequelize             | Critique | M      | —           |
| BACK-001  | Backend         | Idempotence du webhook Stripe                                                  | Critique | M      | —           |
| BACK-002  | Backend         | Remplacer `throw new Error` natif par `HttpException` dans Stripe              | Haute    | XS     | —           |
| FRONT-001 | Frontend        | Intégration Stripe Elements réelle (paiement)                                  | Critique | L      | BACK-001    |
| SEC-001   | Sécurité        | Corriger la configuration CORS en production                                   | Critique | S      | —           |
| SEC-002   | Sécurité        | Ajouter un header CSP dans les configs Nginx                                   | Haute    | S      | FRONT-001   |
| SEC-003   | Sécurité        | Remplacer `ADMIN_PASSWORD` par un placeholder non exploitable                  | Haute    | XS     | —           |
| SEC-004   | Sécurité        | Rendre `HttpExceptionFilter` catch-all                                         | Haute    | S      | —           |
| ARCH-001  | Architecture    | Sortir Sequelize direct d'`orders.service.ts` (decrementStock)                 | Haute    | M      | —           |
| ARCH-002  | Architecture    | Sortir l'appel Stripe de la transaction DB                                     | Haute    | M      | ARCH-001    |
| ARCH-003  | Architecture    | Unifier les types `User`/`Order`/`Product` (packages/types ↔ DTO API ↔ stores) | Haute    | L      | —           |
| ARCH-004  | Architecture    | Supprimer le triple aliasing de tokens Tailwind                                | Moyenne  | M      | —           |
| ARCH-005  | Architecture    | Nettoyer le code mort frontend                                                 | Moyenne  | S      | —           |
| ARCH-006  | Architecture    | Supprimer les fichiers backend morts                                           | Faible   | XS     | —           |
| ARCH-007  | Architecture    | Unifier les secrets JWT                                                        | Haute    | XS     | —           |
| ARCH-008  | Architecture    | Dédupliquer les mappings/DTOs dupliqués (TaxRateDto, toVariantResponseDto)     | Moyenne  | S      | ARCH-003    |
| BACK-003  | Backend         | Garde-fou stock produit vs variante                                            | Haute    | M      | ARCH-001    |
| BACK-004  | Backend         | Transaction atomique sur le taux de TVA par défaut                             | Moyenne  | S      | —           |
| FRONT-002 | Frontend        | Câbler les favoris côté UI                                                     | Haute    | S      | —           |
| FRONT-003 | Frontend        | Réparer le burger menu mobile                                                  | Moyenne  | S      | —           |
| FRONT-004 | Frontend        | Handler fonctionnel pour le formulaire newsletter                              | Faible   | XS     | —           |
| FRONT-005 | Frontend        | Corriger les variables CSS inexistantes (`--ivoire-a40/a15`)                   | Faible   | XS     | —           |
| TEST-001  | Tests           | Tests Guards JWT/Admin                                                         | Critique | M      | —           |
| TEST-002  | Tests           | Tests Stripe (signature webhook, idempotence)                                  | Critique | M      | BACK-001    |
| TEST-003  | Tests           | Tests e2e controllers (au moins les flux critiques)                            | Haute    | L      | TEST-001    |
| TEST-004  | Tests           | Tests repositories (incrementStock/decrementStock)                             | Haute    | S      | ARCH-001    |
| TEST-005  | Tests           | Tests frontend composables/stores additionnels                                 | Moyenne  | M      | ARCH-003    |
| INFRA-001 | Infrastructure  | Pipeline CI (lint + test + build)                                              | Critique | M      | PREP-003    |
| INFRA-002 | Infrastructure  | Scan de vulnérabilités (npm audit / Dependabot)                                | Moyenne  | XS     | INFRA-001   |
| INFRA-003 | Infrastructure  | Ajouter le champ `engines` aux package.json                                    | Faible   | XS     | —           |
| DOC-001   | Documentation   | Mettre à jour ai_docs/\*.md (Turborepo, stratégie de schéma DB, back-office)   | Moyenne  | S      | DB-001      |
| DOC-002   | Documentation   | Harmoniser les messages de commit (Conventional Commits)                       | Faible   | XS     | —           |

---

## Phase 0 – Préparation

### Tâches détaillées

#### PREP-002 — Mettre à jour CLAUDE.md (composables/stores, back-office fusionné) ✅ Fait

- **Description** : Ajouter `packages/composables` et `packages/stores` au tableau du monorepo dans CLAUDE.md, et corriger la mention d'`apps/back-office` (supprimé, fusionné dans `apps/front-office/src/pages/admin/`).
- **Pourquoi** : CLAUDE.md est la source de vérité lue en premier par toute personne (humaine ou IA) travaillant sur le projet ; il décrit une architecture qui n'existe plus, créant un risque de confusion immédiat.
- **Fichiers concernés** : `CLAUDE.md`
- **Dossiers concernés** : racine
- **Modifications précises** : mettre à jour le bloc ASCII du monorepo en tête de fichier, ajouter une ligne `packages/composables` et `packages/stores` dans le tableau Stack/Structure.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : aucun
- **Critères de validation** : relecture du fichier confirme la cohérence avec `ls apps/` et `ls packages/` réels.
- **Tests à réaliser** : aucun (documentation).

#### PREP-003 — Vérifier l'exécution des suites de tests existantes ✅ Fait

- **Résultat** : `npm install` à la racine restaure correctement les workspaces (511 paquets). `apps/api` (Jest) : 5 suites / 34 tests, tous au vert. `packages/stores` (Vitest) : 2 fichiers / 18 tests, tous au vert. `npm run test --workspaces --if-present` exécute bien les deux en une seule commande (les autres workspaces n'ont pas de script `test`, ignorés via `--if-present`). Aucune correction nécessaire — prêt pour INFRA-001.
- **Description** : Lancer `npm install` à la racine du monorepo et exécuter chaque suite de tests existante (`apps/api` Jest, `packages/stores` Vitest) pour confirmer qu'elles passent réellement en local, condition préalable à la mise en place de la CI (INFRA-001).
- **Pourquoi** : L'audit n'a pas pu exécuter les tests faute de `node_modules` installés ; il faut valider qu'ils passent avant de les intégrer dans un pipeline automatisé.
- **Fichiers concernés** : `apps/api/jest.config.js`, `packages/stores/vitest.config.ts`
- **Dossiers concernés** : racine, `apps/api`, `packages/stores`
- **Modifications précises** : aucune modification de code attendue si les tests passent ; sinon, corriger les tests cassés avant de poursuivre.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : des tests peuvent échouer pour des raisons d'environnement (versions Node) plutôt que de logique — à diagnostiquer avant d'investir dans INFRA-001.
- **Critères de validation** : `npm run test --workspaces` (ou équivalent par package) se termine en succès.
- **Tests à réaliser** : exécution de toutes les suites existantes.

---

## Phase 1 – Corrections critiques

### Tâches détaillées

#### DB-001 — Synchroniser le schéma DB directement depuis les modèles Sequelize

- **Description** : Pas de système de migrations pour l'instant (le projet n'a qu'un environnement local, pas de production) : le schéma MySQL est piloté directement par les modèles Sequelize via `sequelize.sync({ alter: true })` au démarrage en développement. La tâche consiste à (1) auditer chaque modèle (`@Column`, `@ForeignKey`, `@Index`, `@AllowNull`, `@Default`) pour s'assurer qu'il reflète fidèlement l'intention métier actuelle (colonnes utilisées par les services/DTOs, contraintes FK entre `Product`/`ProductVariant`/`Order`/`OrderItem`/`Category`/`User`/`Favorite`/`TaxRate`), (2) corriger les divergences trouvées directement dans les fichiers `*.model.ts`, (3) relancer `sync({ alter: true })` sur la base locale et vérifier que le schéma résultant correspond aux attentes (index, types, valeurs par défaut), (4) supprimer le dossier `apps/api/src/database/migrations/` (vide) et le script `db:migrate` du `package.json` pour ne pas laisser une fausse impression qu'un système de migrations est actif.
- **Pourquoi** : Reconstituer un système de migrations n'a pas de sens sans production à faire évoluer ; en local, la source de vérité la plus simple et la moins risquée est le modèle Sequelize lui-même, synchronisé directement. Cela évite aussi la dérive observée actuellement entre seeders/modèles et un dossier de migrations vide.
- **Fichiers concernés** : tous les modèles `apps/api/src/modules/**/*.model.ts`, `apps/api/src/config/database.config.ts` (vérifier que `synchronize`/`alter` est bien actif en dev), `apps/api/package.json` (script `db:migrate`)
- **Dossiers concernés** : `apps/api/src/database/`
- **Modifications précises** : revue et correction des décorateurs Sequelize sur chaque modèle pour qu'ils reflètent l'état métier réel ; confirmer `database.config.ts` utilise `sync({ alter: true })` uniquement quand `NODE_ENV=development` ; suppression du dossier `migrations/` vide et nettoyage des scripts associés.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : `apps/api/src/database/migrations/` (dossier vide), script `db:migrate` dans `apps/api/package.json` si présent
- **Priorité** : Critique
- **Effort** : M (0,5-1 jour)
- **Dépendances** : aucune
- **Risques** : `alter: true` peut être destructif sur certains changements de type de colonne (Sequelize droppe parfois puis recrée) — toujours tester sur une copie de la base locale avant d'appliquer sur les données de dev importantes (ex. catalogue produit déjà saisi). Avant tout futur déploiement en production, un système de migrations versionnées devra être réintroduit (ne pas utiliser `alter: true` sur des données réelles) — à traiter dans une roadmap ultérieure, hors périmètre ici.
- **Critères de validation** : démarrer l'API en local sur une base vide crée automatiquement un schéma cohérent avec tous les modèles ; les seeders s'exécutent ensuite sans erreur ; le dossier `migrations/` n'existe plus.
- **Tests à réaliser** : test manuel "provisioning from scratch" — base MySQL vide, démarrage de l'API, puis `npm run db:seed:all`, vérification de l'absence d'erreur et de la cohérence des données.

#### BACK-001 — Idempotence du webhook Stripe

- **Description** : Ajouter une table `stripe_webhook_events` (colonnes `event_id` UNIQUE, `type`, `processed_at`) et vérifier l'idempotence avant tout traitement d'événement Stripe entrant.
- **Pourquoi** : Stripe peut renvoyer un même événement plusieurs fois (timeout, retry) ; sans garde-fou, un replay de `payment_intent.succeeded` ou `payment_intent.payment_failed` peut décrémenter le stock une seconde fois ou renvoyer un email de confirmation en double.
- **Fichiers concernés** : `apps/api/src/modules/orders/stripe.controller.ts`, `apps/api/src/modules/orders/stripe.service.ts`, `apps/api/src/modules/orders/orders.service.ts`
- **Dossiers concernés** : `apps/api/src/modules/orders/`
- **Modifications précises** : créer le modèle Sequelize `StripeWebhookEvent` (colonnes `event_id` UNIQUE NOT NULL, `type`, `processed_at`) ; il sera créé en base automatiquement via `sync({ alter: true })` (DB-001), sans fichier de migration séparé. Dans `stripe.controller.ts`, avant d'appeler `ordersService.confirmByPaymentIntent`/`cancelByPaymentIntent`, vérifier l'existence de `event.id` dans `stripe_webhook_events` ; insérer l'événement avant traitement (idempotence par contrainte UNIQUE en DB, pas par simple check applicatif pour éviter une race condition).
- **Fichiers à créer** : `apps/api/src/modules/orders/stripe-webhook-event.model.ts`
- **Fichiers à supprimer** : aucun
- **Priorité** : Critique
- **Effort** : M (0,5-1 jour)
- **Dépendances** : DB-001 (la stratégie de schéma direct-par-modèle doit être en place)
- **Risques** : s'assurer que le modèle est bien enregistré dans le module NestJS (`SequelizeModule.forFeature([StripeWebhookEvent])`) pour que `sync` le prenne en compte.
- **Critères de validation** : envoyer deux fois le même événement Stripe (via `stripe trigger` ou replay manuel) ne déclenche le traitement métier qu'une seule fois.
- **Tests à réaliser** : TEST-002 (test unitaire + test d'intégration de replay).

#### BACK-002 — Remplacer `throw new Error` natif par `HttpException` dans Stripe

- **Description** : Dans `stripe.service.ts:15`, remplacer `throw new Error('STRIPE_SECRET_KEY environment variable is not set')` par une `InternalServerErrorException` (ou équivalent NestJS) pour respecter le contrat `{success:false,error:{code,message}}`.
- **Pourquoi** : Toute erreur native échappe au `HttpExceptionFilter` global (`@Catch(HttpException)`), cassant le contrat de réponse API uniforme exigé par CLAUDE.md.
- **Fichiers concernés** : `apps/api/src/modules/orders/stripe.service.ts`
- **Dossiers concernés** : `apps/api/src/modules/orders/`
- **Modifications précises** : importer `InternalServerErrorException` depuis `@nestjs/common`, remplacer le `throw new Error(...)`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : aucun
- **Critères de validation** : démarrer l'API sans `STRIPE_SECRET_KEY` renvoie une erreur au format `{success:false,error:{code,message}}` si le chemin est atteint via une requête HTTP.
- **Tests à réaliser** : test unitaire vérifiant le type d'exception levée.

#### FRONT-001 — Intégration Stripe Elements réelle

- **Description** : Remplacer le formulaire de paiement simulé (`StripePaymentForm.vue`, carte `4242 4242 4242 4242` en dur, `setTimeout`) par une intégration Stripe.js/Elements réelle : création d'un PaymentIntent côté backend, confirmation côté client, gestion des états d'échec (carte refusée, 3D Secure, timeout réseau).
- **Pourquoi** : En l'état, aucune commande réelle ne peut être passée ni payée — c'est un bloquant absolu pour toute mise en production, masqué par une UI qui donne l'illusion d'une fonctionnalité complète.
- **Fichiers concernés** : `apps/front-office/src/components/checkout/StripePaymentForm.vue`, `apps/front-office/src/pages/commande/index.vue`, `packages/composables/src/useApi.ts` (ou nouveau composable `useCheckout.ts`)
- **Dossiers concernés** : `apps/front-office/src/components/checkout/`, `apps/front-office/src/pages/commande/`, `packages/composables/src/`
- **Modifications précises** : installer `@stripe/stripe-js`, créer un composable `useCheckout()` qui appelle `POST /api/v1/orders` (création commande + PaymentIntent côté backend), monte Stripe Elements (`CardElement` ou `PaymentElement`), confirme le paiement côté client (`stripe.confirmCardPayment`), gère les retours d'erreur Stripe (`error.message`) et redirige seulement après confirmation réelle (webhook ou `payment_intent.status === 'succeeded'`).
- **Fichiers à créer** : `packages/composables/src/useCheckout.ts`
- **Fichiers à supprimer** : le bloc de simulation (`setTimeout`, sessionStorage mock) dans `commande/index.vue`
- **Priorité** : Critique
- **Effort** : L (1-3 jours)
- **Dépendances** : BACK-001 (le webhook doit être fiable avant de brancher un vrai flux de paiement)
- **Risques** : nécessite une vraie clé Stripe de test fonctionnelle et un environnement de test webhook (`stripe listen --forward-to`) ; risque de régression sur le flux panier→commande existant si le contrat `POST /orders` change de forme.
- **Critères de validation** : un paiement test Stripe (carte de test officielle) aboutit à une commande `status=paid` en base, avec décrément réel du stock et email de confirmation envoyé une seule fois.
- **Tests à réaliser** : test manuel end-to-end avec `stripe listen`, puis test e2e automatisé (TEST-003) une fois le pipeline e2e en place.

#### SEC-001 — Corriger la configuration CORS en production

- **Description** : Lire la variable d'environnement `CORS_ORIGIN` (liste d'origines séparées par virgules) dans `main.ts` au lieu du hardcoding actuel, et supprimer le fallback `'http://localhost:5174'` qui reste actif même en production.
- **Pourquoi** : `.env.example` documente `CORS_ORIGIN` comme configurable, mais le code l'ignore totalement ; une origine de développement reste autorisée avec `credentials: true` sur l'API de production, élargissant la surface d'attaque CSRF/vol de session.
- **Fichiers concernés** : `apps/api/src/main.ts`, `.env.example`, `apps/api/src/config/env.validation.ts`
- **Dossiers concernés** : `apps/api/src/`
- **Modifications précises** : dans `main.ts`, remplacer le tableau hardcodé par `process.env.CORS_ORIGIN?.split(',') ?? [process.env.FRONTEND_URL]` ; ajouter la validation de `CORS_ORIGIN` dans `env.validation.ts` ; ne conserver aucun fallback `localhost` en dehors de `NODE_ENV=development`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Critique
- **Effort** : S (1-4h)
- **Dépendances** : aucune
- **Risques** : si la variable n'est pas correctement définie au déploiement, l'API peut refuser toutes les requêtes du front en prod — documenter clairement dans `.env.example` et `docker-compose.prod.yml`.
- **Critères de validation** : une requête depuis une origine hors `CORS_ORIGIN` est rejetée en environnement `production` ; le front-office légitime fonctionne normalement.
- **Tests à réaliser** : test d'intégration vérifiant les headers `Access-Control-Allow-Origin` selon `NODE_ENV`.

---

## Phase 2 – Refactoring structurel

### Tâches détaillées

#### SEC-002 — Ajouter un header CSP dans les configs Nginx

- **Description** : Définir un header `Content-Security-Policy` dans `docker/nginx/nginx.conf`, `nginx.prod.conf` et `spa.conf`, autorisant explicitement `js.stripe.com`, `api.stripe.com` et les origines propres du site.
- **Pourquoi** : Le site embarque (désormais réellement, après FRONT-001) Stripe Elements ; l'absence totale de CSP est un risque XSS non négligeable pour une plateforme qui manipule des données de paiement.
- **Fichiers concernés** : `docker/nginx/nginx.conf`, `docker/nginx/nginx.prod.conf`, `docker/nginx/spa.conf`
- **Dossiers concernés** : `docker/nginx/`
- **Modifications précises** : ajouter `add_header Content-Security-Policy "default-src 'self'; script-src 'self' js.stripe.com; frame-src js.stripe.com; connect-src 'self' api.stripe.com; img-src 'self' data:; style-src 'self' 'unsafe-inline';" always;` (ajuster selon les besoins réels des polices Google Fonts si utilisées).
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : S (1-4h)
- **Dépendances** : FRONT-001 (connaître les domaines Stripe réellement utilisés)
- **Risques** : une CSP trop stricte peut casser le chargement de Stripe.js ou des polices — tester en profondeur avant déploiement prod.
- **Critères de validation** : le site fonctionne intégralement (incl. paiement) avec la CSP active ; la console navigateur ne montre aucune violation CSP bloquante.
- **Tests à réaliser** : test manuel avec DevTools (onglet Security/Console) sur chaque page, en particulier `commande/index.vue`.

#### SEC-003 — Remplacer `ADMIN_PASSWORD` par un placeholder non exploitable

- **Description** : Dans `.env.example`, remplacer `ADMIN_PASSWORD=Admin1234!` par `ADMIN_PASSWORD=CHANGE_ME_BEFORE_PROD`.
- **Pourquoi** : Un déployeur copiant `.env.example` → `.env` sans modification laisserait un mot de passe admin trivial et public (visible dans tout clone du repo).
- **Fichiers concernés** : `.env.example`
- **Dossiers concernés** : racine
- **Modifications précises** : remplacement de la valeur par défaut, ajout d'un commentaire explicite `# OBLIGATOIRE: générer un mot de passe fort avant tout déploiement`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : aucun
- **Critères de validation** : `.env.example` ne contient plus aucune valeur de mot de passe plausible.
- **Tests à réaliser** : aucun (config).

#### SEC-004 — Rendre `HttpExceptionFilter` catch-all

- **Description** : Étendre `apps/api/src/common/filters/http-exception.filter.ts` pour catcher toutes les exceptions (`@Catch()` sans argument), mapper les erreurs non-`HttpException` (Sequelize, `TypeError`, etc.) vers un code générique `INTERNAL_ERROR` sans exposer la stack trace en production.
- **Pourquoi** : Actuellement, seules les `HttpException` sont catchées ; toute erreur imprévue (bug Sequelize, erreur de typage runtime) casse le contrat `{success:false,error:{code,message}}` et peut fuiter des détails techniques au client.
- **Fichiers concernés** : `apps/api/src/common/filters/http-exception.filter.ts`
- **Dossiers concernés** : `apps/api/src/common/filters/`
- **Modifications précises** : changer le décorateur en `@Catch()`, ajouter un `instanceof HttpException` check interne, logger systématiquement la stack en interne (via un logger NestJS) mais ne renvoyer au client que `{code:'INTERNAL_ERROR', message:'Une erreur est survenue'}` en production (`NODE_ENV=production`), avec le détail réel uniquement en dev.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : S (1-4h)
- **Dépendances** : aucune
- **Risques** : vérifier qu'aucun code existant ne dépend du comportement actuel (erreurs non catchées remontant telles quelles dans les logs Nest par défaut).
- **Critères de validation** : forcer une erreur Sequelize (ex. contrainte FK violée) renvoie un `500` au format `{success:false,error:{code:'INTERNAL_ERROR',...}}` sans stack trace exposée côté client.
- **Tests à réaliser** : test unitaire du filter avec une erreur native en entrée.

#### ARCH-001 — Sortir Sequelize direct d'`orders.service.ts`

- **Description** : Ajouter `decrementStock(id, quantity, transaction)` dans `ProductsRepository` et `ProductVariantsRepository`, et retirer les `@InjectModel(Product)`/`@InjectModel(ProductVariant)` directs d'`orders.service.ts`.
- **Pourquoi** : Violation du pattern Repository sur le module le plus critique du projet (gestion du stock/argent) — règle absolue n°1 de CLAUDE.md ("Pattern Repository obligatoire — jamais de Sequelize direct dans un Service").
- **Fichiers concernés** : `apps/api/src/modules/orders/orders.service.ts`, `apps/api/src/modules/products/products.repository.ts`, `apps/api/src/modules/products/product-variants.repository.ts`
- **Dossiers concernés** : `apps/api/src/modules/orders/`, `apps/api/src/modules/products/`
- **Modifications précises** : créer `decrementStock()` symétrique à l'`incrementStock()` existant (même logique de `rowsAffected===0` → `OUT_OF_STOCK`), appeler ces méthodes depuis `orders.service.ts` au lieu des `.update()` directs.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : M (0,5-1 jour)
- **Dépendances** : aucune
- **Risques** : doit conserver exactement la même sémantique transactionnelle (passage du `transaction` Sequelize en paramètre) pour ne pas casser le rollback existant.
- **Critères de validation** : `orders.service.ts` ne contient plus aucun `@InjectModel` de `Product`/`ProductVariant` ; les tests existants (`orders.service.spec.ts`) passent sans modification de comportement observable.
- **Tests à réaliser** : TEST-004 (tests dédiés aux repositories), non-régression sur `orders.service.spec.ts`.

#### ARCH-002 — Sortir l'appel Stripe de la transaction DB

- **Description** : Restructurer `orders.service.ts` pour que la création du PaymentIntent Stripe (appel réseau externe) se fasse **avant** ou **après** la transaction Sequelize de décrément de stock, jamais à l'intérieur.
- **Pourquoi** : Un appel HTTP externe tenu pendant une transaction DB prolonge les verrous (risque de contention sous charge) et peut créer un PaymentIntent Stripe orphelin sans commande correspondante si la transaction échoue après l'appel.
- **Fichiers concernés** : `apps/api/src/modules/orders/orders.service.ts`
- **Dossiers concernés** : `apps/api/src/modules/orders/`
- **Modifications précises** : séquencer en deux étapes : (1) transaction courte de réservation de stock + création de la commande en statut `pending`, (2) hors transaction, création du PaymentIntent Stripe ; en cas d'échec Stripe, annuler la réservation de stock via une transaction de compensation.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : M (0,5-1 jour)
- **Dépendances** : ARCH-001
- **Risques** : nécessite une logique de compensation propre (annulation de réservation) pour éviter de bloquer du stock indéfiniment si Stripe échoue — bien tester ce chemin d'erreur.
- **Critères de validation** : simuler un échec Stripe (clé invalide temporaire) ne laisse aucune réservation de stock orpheline en base après le délai de compensation.
- **Tests à réaliser** : test d'intégration simulant un échec de l'appel Stripe après réservation du stock.

#### ARCH-003 — Unifier les types `User`/`Order`/`Product`

- **Description** : Faire de `packages/types` la source unique des contrats API, importée à la fois par `apps/api` (DTOs) et `apps/front-office`/`packages/stores`. Corriger les divergences identifiées : `User` (manque `customerNumber`, `addressStreet/City/Zip/Country`, `isActive`, `updatedAt`), `Order.shippingAddress` (typé `object` côté API, doit être `ShippingAddress` strict), `Product.category` (sous-ensemble incohérent), `TaxRateDto` dupliqué.
- **Pourquoi** : Trois définitions divergentes de `User` coexistent actuellement (packages/types, DTO API, store Pinia `auth.store.ts`), créant un risque de champs `undefined` silencieux en runtime sans erreur de compilation.
- **Fichiers concernés** : `packages/types/src/user.types.ts`, `packages/types/src/order.types.ts`, `packages/types/src/product.types.ts`, `apps/api/src/modules/users/dto/user-response.dto.ts`, `apps/api/src/modules/orders/dto/order-response.dto.ts`, `apps/api/src/modules/products/dto/product-response.dto.ts`, `packages/stores/src/auth.store.ts`
- **Dossiers concernés** : `packages/types/src/`, `apps/api/src/modules/*/dto/`, `packages/stores/src/`
- **Modifications précises** : compléter `User` dans `packages/types` avec tous les champs réellement renvoyés par `UserResponseDto` ; typer `ShippingAddress` strictement et l'utiliser côté `OrderResponseDto` ; faire importer les DTOs API depuis `@carre-ivoire/types` au lieu de redéfinir localement (`TaxRateDto` notamment) ; supprimer la redéfinition locale de `User` dans `auth.store.ts`, importer depuis `@carre-ivoire/types`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : L (1-3 jours)
- **Dépendances** : aucune
- **Risques** : changement transversal à fort rayon d'impact (compile-time errors en cascade attendues et souhaitables) — à faire dans une branche dédiée avec build complet (`tsc --noEmit` sur tous les packages) avant merge.
- **Critères de validation** : un seul symbole `User`/`Order`/`Product` existe dans le monorepo, importé partout ; `tsc --noEmit` passe sur `apps/api`, `apps/front-office`, tous les `packages/*`.
- **Tests à réaliser** : TEST-005, plus vérification manuelle de l'affichage des champs précédemment manquants (téléphone, adresse, numéro client) dans les pages compte/admin.

#### ARCH-004 — Supprimer le triple aliasing de tokens Tailwind

- **Description** : Dans `packages/config/tailwind/preset.js`, supprimer les alias `cocoa`, `ivory`, `beige`, `gold`, `brun-cacao` et ne conserver que les noms canoniques (`cacao`, `ivoire`, `beige-doux`, `dore`) ; migrer toutes les pages admin (`apps/front-office/src/pages/admin/**`, `AdminSidebar.vue`) qui utilisent les alias.
- **Pourquoi** : Trois façons d'écrire la même couleur créent une dérive stylistique inévitable et une incohérence visuelle déjà identifiée entre le site public et le back-office, violant l'exigence CLAUDE.md de noms canoniques.
- **Fichiers concernés** : `packages/config/tailwind/preset.js`, toutes les pages sous `apps/front-office/src/pages/admin/`, `apps/front-office/src/components/layout/AdminSidebar.vue`
- **Dossiers concernés** : `packages/config/tailwind/`, `apps/front-office/src/pages/admin/`
- **Modifications précises** : retirer les clés d'alias du preset ; remplacer en masse (recherche/remplacement contrôlé, pas de `sed` à l'aveugle) `cocoa`→`cacao`, `ivory`→`ivoire`, `beige`→`beige-doux`, `gold`→`dore`, `brun-cacao`→`cacao` dans les fichiers `.vue` admin ; ajouter un token sémantique d'erreur/rupture de stock (ex. `--erreur` dans `colors-and-type.css` + `erreur` dans le preset) pour remplacer le `text-red-700`/`border-red-700` hors palette.
- **Fichiers à créer** : aucun (modification de `colors-and-type.css` existant pour ajouter le token erreur)
- **Fichiers à supprimer** : aucun
- **Priorité** : Moyenne
- **Effort** : M (0,5-1 jour)
- **Dépendances** : aucune
- **Risques** : remplacement en masse de classes Tailwind risque de casser des classes composées (ex. `border-gold/20`) si le remplacement n'est pas fait avec une regex tenant compte des suffixes d'opacité.
- **Critères de validation** : `grep -r "cocoa\|ivory\|brun-cacao\b\|gold" apps/front-office/src` ne retourne plus aucun résultat (hors commentaires) ; preset ne contient plus les alias.
- **Tests à réaliser** : revue visuelle de toutes les pages admin après migration (capture d'écran avant/après).

#### ARCH-005 — Nettoyer le code mort frontend

- **Description** : Supprimer les composants et store jamais montés/importés : `ProductDetail.vue`, `CartDrawer.vue`, `AppNav.vue` (stub vide), `ProductGrid.vue` (stub vide), `apps/front-office/src/stores/product.store.ts`, ainsi que les ré-exports vides `apps/front-office/src/stores/{auth,cart}.store.ts`.
- **Pourquoi** : ~450 lignes de code mort créent un risque de double-maintenance (quelqu'un modifie le mauvais fichier en le croyant actif) et de confusion architecturale (deux systèmes d'état produit non synchronisés).
- **Fichiers concernés** : voir liste ci-dessus
- **Dossiers concernés** : `apps/front-office/src/components/product/`, `apps/front-office/src/components/cart/`, `apps/front-office/src/components/layout/`, `apps/front-office/src/stores/`
- **Modifications précises** : supprimer les fichiers ; remplacer les imports de `apps/front-office/src/stores/{auth,cart}.store.ts` par des imports directs de `@carre-ivoire/stores` partout où ils sont utilisés.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : `apps/front-office/src/components/product/ProductDetail.vue`, `apps/front-office/src/components/cart/CartDrawer.vue`, `apps/front-office/src/components/layout/AppNav.vue`, `apps/front-office/src/components/product/ProductGrid.vue`, `apps/front-office/src/stores/product.store.ts`, `apps/front-office/src/stores/auth.store.ts`, `apps/front-office/src/stores/cart.store.ts`
- **Priorité** : Moyenne
- **Effort** : S (1-4h)
- **Dépendances** : aucune (si le panier latéral `CartDrawer` est en réalité une fonctionnalité voulue mais non finalisée, voir FRONT-006 en alternative — à trancher avec le produit avant suppression définitive)
- **Risques** : vérifier une dernière fois par `grep` global qu'aucun import caché ne subsiste avant suppression.
- **Critères de validation** : `npm run build` sur `apps/front-office` réussit après suppression, aucune route ou composant ne référence plus les fichiers supprimés.
- **Tests à réaliser** : build complet + smoke test manuel des pages panier/produit/auth.

#### ARCH-006 — Supprimer les fichiers backend morts

- **Description** : Supprimer `apps/api/src/config/jwt.config.ts` (jamais utilisé) et `apps/api/src/common/pipes/validation.pipe.ts` (fichier vide).
- **Pourquoi** : Code mort qui complique la lecture et entretient la confusion sur la configuration JWT réelle (voir ARCH-007).
- **Fichiers concernés** : `apps/api/src/config/jwt.config.ts`, `apps/api/src/common/pipes/validation.pipe.ts`
- **Dossiers concernés** : `apps/api/src/config/`, `apps/api/src/common/pipes/`
- **Modifications précises** : suppression pure, vérifier qu'aucun module ne les importe.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : `apps/api/src/config/jwt.config.ts`, `apps/api/src/common/pipes/validation.pipe.ts`
- **Priorité** : Faible
- **Effort** : XS (<1h)
- **Dépendances** : ARCH-007 (faire après l'unification des secrets JWT pour ne rien casser)
- **Risques** : aucun si `grep` de vérification fait avant suppression.
- **Critères de validation** : build réussit, aucune référence résiduelle.
- **Tests à réaliser** : build complet.

#### ARCH-007 — Unifier les secrets JWT

- **Description** : Choisir une seule variable d'environnement (`JWT_SECRET`) et l'utiliser de façon cohérente dans `auth.module.ts`, `auth.service.ts`, `jwt.strategy.ts` et `env.validation.ts`, en supprimant la référence à `JWT_ACCESS_TOKEN_SECRET` non alignée.
- **Pourquoi** : `auth.module.ts` configure une variable jamais lue ailleurs (`JWT_ACCESS_TOKEN_SECRET`) tandis que le reste du code utilise `JWT_SECRET` — latent aujourd'hui, mais dangereux si un futur appel passe par le `JwtService` mal configuré (signature avec un secret vide/différent).
- **Fichiers concernés** : `apps/api/src/modules/auth/auth.module.ts`, `apps/api/src/modules/auth/auth.service.ts`, `apps/api/src/modules/auth/strategies/jwt.strategy.ts`, `apps/api/src/config/env.validation.ts`
- **Dossiers concernés** : `apps/api/src/modules/auth/`, `apps/api/src/config/`
- **Modifications précises** : aligner toutes les références sur `JWT_SECRET`, s'assurer que `env.validation.ts` valide bien sa présence obligatoire au démarrage.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun (le nettoyage de `jwt.config.ts` est ARCH-006)
- **Priorité** : Haute
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : invalider tous les tokens JWT existants en environnement de dev/staging après changement (acceptable, à communiquer à l'équipe).
- **Critères de validation** : login/register génèrent des tokens valides vérifiables par `jwt.strategy.ts` avec la même variable partout.
- **Tests à réaliser** : TEST-001 (couvre indirectement ce point), test manuel login → accès route protégée.

#### ARCH-008 — Dédupliquer les mappings/DTOs dupliqués

- **Description** : Importer `TaxRate`/`TaxRateDto` depuis `@carre-ivoire/types` dans `product-response.dto.ts` au lieu de le redéfinir localement ; extraire un mapper partagé `toVariantResponseDto` utilisé à la fois par `products.service.ts` et `product-variants.service.ts`.
- **Pourquoi** : Deux définitions parallèles du même contrat (TaxRate) et deux implémentations dupliquées du même mapping créent un risque de divergence silencieuse si l'une évolue sans l'autre.
- **Fichiers concernés** : `apps/api/src/modules/products/dto/product-response.dto.ts`, `apps/api/src/modules/products/products.service.ts`, `apps/api/src/modules/products/product-variants.service.ts`
- **Dossiers concernés** : `apps/api/src/modules/products/`
- **Modifications précises** : supprimer la redéfinition locale de `TaxRateDto`, importer depuis `@carre-ivoire/types` ; extraire `toVariantResponseDto` dans un fichier utilitaire partagé (`apps/api/src/modules/products/mappers/variant.mapper.ts`) importé par les deux services.
- **Fichiers à créer** : `apps/api/src/modules/products/mappers/variant.mapper.ts`
- **Fichiers à supprimer** : aucun
- **Priorité** : Moyenne
- **Effort** : S (1-4h)
- **Dépendances** : ARCH-003 (le type `TaxRate` doit être finalisé dans `packages/types` avant import côté API)
- **Risques** : faible, refactor mécanique.
- **Critères de validation** : un seul symbole `TaxRate`/`TaxRateDto` dans le monorepo ; les deux services utilisent le même mapper.
- **Tests à réaliser** : non-régression sur `products.service.spec.ts` et `product-variants.service.spec.ts`.

---

## Phase 3 – Fonctionnalités manquantes

### Tâches détaillées

#### BACK-003 — Garde-fou stock produit vs variante

- **Description** : Dans `orders.service.ts`, empêcher la commande d'un produit ayant des variantes actives sans `variantId` explicite — lever une erreur métier `VARIANT_REQUIRED` plutôt que de décrémenter le stock du parent par défaut.
- **Pourquoi** : Actuellement, commander sans `variantId` un produit ayant des variantes décrémente le stock du parent au lieu de la variante réellement vendue, créant un risque réel de survente.
- **Fichiers concernés** : `apps/api/src/modules/orders/orders.service.ts`, `apps/api/src/modules/orders/dto/create-order.dto.ts`
- **Dossiers concernés** : `apps/api/src/modules/orders/`
- **Modifications précises** : avant le décrément de stock, vérifier `await productVariantsRepository.findByProductId(productId)` ; si des variantes actives existent et qu'aucun `variantId` n'est fourni dans l'item de commande, lever `BadRequestException` avec code `VARIANT_REQUIRED`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : M (0,5-1 jour)
- **Dépendances** : ARCH-001
- **Risques** : vérifier que tous les produits sans variantes ne sont pas affectés par ce garde-fou (ne doit se déclencher que si des variantes existent réellement).
- **Critères de validation** : une commande sans `variantId` sur un produit à variantes est rejetée avec `VARIANT_REQUIRED` ; une commande normale sur un produit sans variante fonctionne sans changement.
- **Tests à réaliser** : test unitaire couvrant les deux cas (produit avec/sans variantes).

#### BACK-004 — Transaction atomique sur le taux de TVA par défaut

- **Description** : Englober `clearDefault()` puis `create()`/`update()` dans une transaction Sequelize unique dans `tax-rates.repository.ts`/`tax-rates.service.ts`.
- **Pourquoi** : Actuellement non atomique — une requête concurrente entre les deux appels peut laisser deux taux de TVA marqués `isDefault=true` simultanément, ou aucun.
- **Fichiers concernés** : `apps/api/src/modules/tax-rates/tax-rates.repository.ts`, `apps/api/src/modules/tax-rates/tax-rates.service.ts`
- **Dossiers concernés** : `apps/api/src/modules/tax-rates/`
- **Modifications précises** : wrapper `clearDefault()` + `create()`/`update()` dans `sequelize.transaction(async (t) => {...})`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Moyenne
- **Effort** : S (1-4h)
- **Dépendances** : aucune
- **Risques** : faible.
- **Critères de validation** : test de concurrence (deux requêtes simultanées de changement de taux par défaut) n'aboutit jamais à zéro ou deux taux par défaut.
- **Tests à réaliser** : test d'intégration avec deux promesses concurrentes.

#### FRONT-002 — Câbler les favoris côté UI

- **Description** : Importer et utiliser le composable `useFavorites()` (déjà fonctionnel côté backend et composable) dans `apps/front-office/src/pages/compte/favoris.vue`, et ajouter un bouton "cœur" toggle favori sur `ProductCard.vue` et la page produit `produits/[slug].vue`.
- **Pourquoi** : Le backend et le composable sont complets et fonctionnels, mais la page favoris affiche un tableau vide en dur (`const favoris = []`) et aucun bouton ne permet d'ajouter un favori — fonctionnalité documentée dans `ai_docs/concept.md` mais totalement absente pour l'utilisateur final.
- **Fichiers concernés** : `apps/front-office/src/pages/compte/favoris.vue`, `apps/front-office/src/components/product/ProductCard.vue`, `apps/front-office/src/pages/produits/[slug].vue`
- **Dossiers concernés** : `apps/front-office/src/pages/compte/`, `apps/front-office/src/components/product/`, `apps/front-office/src/pages/produits/`
- **Modifications précises** : dans `favoris.vue`, remplacer le tableau vide par `const { favorites, fetchFavorites } = useFavorites()` + appel au montage ; dans `ProductCard.vue`, ajouter un bouton icône cœur avec état actif/inactif appelant `toggleFavorite(productId)`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : S (1-4h)
- **Dépendances** : aucune
- **Risques** : nécessite que l'utilisateur soit authentifié — gérer le cas non connecté (rediriger vers connexion ou désactiver le bouton avec tooltip).
- **Critères de validation** : ajouter/retirer un favori depuis une fiche produit ou la grille boutique se reflète immédiatement dans `/compte/favoris`.
- **Tests à réaliser** : test manuel du cycle complet ajout/suppression/affichage ; test composable existant `useFavorites` à étendre si nécessaire.

#### FRONT-003 — Réparer le burger menu mobile

- **Description** : Ajouter le handler `@click` et l'état de menu mobile manquants sur l'icône burger dans `AppHeader.vue`.
- **Pourquoi** : La navigation mobile est actuellement cassée — l'icône s'affiche mais ne fait rien, alors que `ai_docs/concept.md` revendique une expérience premium cross-device.
- **Fichiers concernés** : `apps/front-office/src/components/layout/AppHeader.vue`
- **Dossiers concernés** : `apps/front-office/src/components/layout/`
- **Modifications précises** : ajouter un `ref` `isMobileMenuOpen`, un `@click="isMobileMenuOpen = !isMobileMenuOpen"` sur le bouton burger, un panneau de navigation mobile conditionnel (`v-if="isMobileMenuOpen"`) avec les mêmes liens que la nav desktop, un `aria-label="Ouvrir le menu"`/`aria-expanded` dynamique.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Moyenne
- **Effort** : S (1-4h)
- **Dépendances** : aucune
- **Risques** : veiller à la cohérence avec les règles de motion CLAUDE.md (durées, easing) pour l'ouverture/fermeture du panneau.
- **Critères de validation** : sur viewport mobile, le burger ouvre/ferme un menu de navigation fonctionnel et accessible au clavier.
- **Tests à réaliser** : test manuel responsive (DevTools mobile + clavier).

#### FRONT-004 — Handler fonctionnel pour le formulaire newsletter

- **Description** : Ajouter un `@submit`/handler au formulaire newsletter dans `AppFooter.vue`, avec appel à un endpoint d'inscription (à créer côté backend si inexistant, ou intégration à un service tiers).
- **Pourquoi** : Le formulaire est actuellement purement décoratif (aucun handler), ce qui ne correspond pas à une fonctionnalité affichée comme disponible aux utilisateurs.
- **Fichiers concernés** : `apps/front-office/src/components/layout/AppFooter.vue`
- **Dossiers concernés** : `apps/front-office/src/components/layout/`
- **Modifications précises** : à clarifier avec le produit — soit créer un module backend minimal `newsletter` (table + endpoint `POST /newsletter/subscribe`), soit retirer le formulaire si la fonctionnalité n'est pas prioritaire pour le lancement.
- **Fichiers à créer** : (si implémenté) `apps/api/src/modules/newsletter/*`
- **Fichiers à supprimer** : aucun
- **Priorité** : Faible
- **Effort** : XS (<1h) si simple retrait, M si implémentation backend complète
- **Dépendances** : décision produit préalable
- **Risques** : aucun si retrait ; risque de scope creep si implémentation complète demandée hors roadmap.
- **Critères de validation** : le formulaire either fonctionne réellement, either est retiré — jamais affiché sans action associée.
- **Tests à réaliser** : test manuel de soumission si implémenté.

#### FRONT-005 — Corriger les variables CSS inexistantes

- **Description** : Remplacer `var(--ivoire-a40)` et `var(--ivoire-a15)` dans `AppFooter.vue` par des variables réellement définies dans `colors-and-type.css` (ex. `--cacao-a12` existant, ou ajouter `--ivoire-a40`/`--ivoire-a15` au fichier de tokens si la teinte ivoire-alpha est réellement voulue).
- **Pourquoi** : Ces variables n'existent pas dans le design system — les bordures concernées sont actuellement invisibles/cassées silencieusement.
- **Fichiers concernés** : `apps/front-office/src/components/layout/AppFooter.vue`, `packages/config/styles/colors-and-type.css`
- **Dossiers concernés** : `apps/front-office/src/components/layout/`, `packages/config/styles/`
- **Modifications précises** : décider si l'intention design était bien une variante ivoire-alpha (alors l'ajouter au token source `colors-and-type.css`) ou une erreur de copier-coller (alors remplacer par `--cacao-a12`/`--cacao-a8` existants).
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Faible
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : aucun
- **Critères de validation** : le rendu visuel du footer affiche les bordures attendues.
- **Tests à réaliser** : revue visuelle manuelle.

---

## Phase 4 – Qualité et robustesse

### Tâches détaillées

#### TEST-001 — Tests Guards JWT/Admin

- **Description** : Créer `jwt-auth.guard.spec.ts` et `admin.guard.spec.ts` couvrant : token absent, token invalide, token expiré, token valide rôle client sur route admin (doit être refusé), token valide rôle admin sur route admin (doit passer).
- **Pourquoi** : Le contrôle d'accès admin qui protège tout le back-office n'a actuellement aucun test — un bug de logique de rôle passerait inaperçu jusqu'en production.
- **Fichiers concernés** : `apps/api/src/modules/auth/guards/jwt-auth.guard.ts`, `apps/api/src/modules/auth/guards/admin.guard.ts`
- **Dossiers concernés** : `apps/api/src/modules/auth/guards/`
- **Modifications précises** : aucune modification du code de production attendue (sauf bug découvert) ; ajout pur de tests.
- **Fichiers à créer** : `apps/api/src/modules/auth/guards/jwt-auth.guard.spec.ts`, `apps/api/src/modules/auth/guards/admin.guard.spec.ts`
- **Fichiers à supprimer** : aucun
- **Priorité** : Critique
- **Effort** : M (0,5-1 jour)
- **Dépendances** : ARCH-007 (secrets JWT unifiés avant d'écrire les tests)
- **Risques** : peut révéler un bug réel de logique de rôle — prévoir du temps de correction en plus du temps de test.
- **Critères de validation** : couverture des 5 scénarios listés, tous verts.
- **Tests à réaliser** : les tests eux-mêmes constituent le livrable.

#### TEST-002 — Tests Stripe (signature webhook, idempotence)

- **Description** : Créer des tests unitaires pour `stripe.service.ts` (vérification de signature avec secret invalide → rejet, secret valide → acceptation) et un test d'intégration pour BACK-001 (envoi du même `event.id` deux fois → traitement métier une seule fois).
- **Pourquoi** : Le point d'entrée de l'argent réel n'a actuellement aucun test ; un bug de vérification de signature webhook serait une vulnérabilité critique (falsification de confirmation de paiement).
- **Fichiers concernés** : `apps/api/src/modules/orders/stripe.service.ts`, `apps/api/src/modules/orders/stripe.controller.ts`
- **Dossiers concernés** : `apps/api/src/modules/orders/`
- **Modifications précises** : aucune modification de production hors celles déjà prévues en BACK-001/BACK-002.
- **Fichiers à créer** : `apps/api/src/modules/orders/stripe.service.spec.ts`, `apps/api/src/modules/orders/stripe.controller.spec.ts`
- **Fichiers à supprimer** : aucun
- **Priorité** : Critique
- **Effort** : M (0,5-1 jour)
- **Dépendances** : BACK-001, BACK-002
- **Risques** : nécessite de mocker correctement le SDK Stripe (signature HMAC) — utiliser les utilitaires de test officiels Stripe (`stripe.webhooks.generateTestHeaderString`).
- **Critères de validation** : signature invalide → 400 rejeté ; replay du même event → un seul traitement métier observable.
- **Tests à réaliser** : les tests eux-mêmes.

#### TEST-003 — Tests e2e controllers

- **Description** : Mettre en place une configuration Jest e2e (`apps/api/test/jest-e2e.json`) et écrire au moins les flux critiques : inscription → connexion → ajout panier → commande → paiement (mock Stripe) → vérification stock décrémenté ; accès admin refusé à un client ; accès admin autorisé à un admin.
- **Pourquoi** : Aucun test e2e n'existe actuellement dans le repo ; les guards, pipes et décorateurs appliqués au niveau route ne sont jamais vérifiés en conditions réelles (seule la logique de service l'est).
- **Fichiers concernés** : tous les controllers de `apps/api/src/modules/`
- **Dossiers concernés** : `apps/api/test/` (à créer)
- **Modifications précises** : configurer une base MySQL de test (conteneur dédié ou SQLite in-memory si compatible Sequelize), créer les fixtures de données.
- **Fichiers à créer** : `apps/api/test/jest-e2e.json`, `apps/api/test/app.e2e-spec.ts`, `apps/api/test/checkout-flow.e2e-spec.ts`, `apps/api/test/admin-access.e2e-spec.ts`
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : L (1-3 jours)
- **Dépendances** : TEST-001, DB-001 (le schéma doit être fiabilisé pour provisionner la base de test)
- **Risques** : effort sous-estimé si la gestion de la base de test (seed/reset entre tests) n'est pas anticipée — prévoir un `beforeEach` de reset transactionnel.
- **Critères de validation** : les 3 flux e2e listés passent en local et en CI.
- **Tests à réaliser** : les tests eux-mêmes constituent le livrable, intégrés à INFRA-001.

#### TEST-004 — Tests repositories

- **Description** : Créer des tests unitaires pour `ProductsRepository.incrementStock/decrementStock` et `ProductVariantsRepository.incrementStock/decrementStock`, couvrant le cas `rowsAffected===0` (stock insuffisant) et le cas de succès.
- **Pourquoi** : Ces méthodes sont au cœur de la cohérence du stock et n'ont actuellement aucun test direct (seulement testées indirectement via `orders.service.spec.ts`).
- **Fichiers concernés** : `apps/api/src/modules/products/products.repository.ts`, `apps/api/src/modules/products/product-variants.repository.ts`
- **Dossiers concernés** : `apps/api/src/modules/products/`
- **Modifications précises** : aucune modification de production attendue.
- **Fichiers à créer** : `apps/api/src/modules/products/products.repository.spec.ts`, `apps/api/src/modules/products/product-variants.repository.spec.ts`
- **Fichiers à supprimer** : aucun
- **Priorité** : Haute
- **Effort** : S (1-4h)
- **Dépendances** : ARCH-001 (méthode `decrementStock` doit exister)
- **Risques** : aucun
- **Critères de validation** : couverture des deux méthodes (increment/decrement) × deux cas (succès/échec) sur les deux repositories.
- **Tests à réaliser** : les tests eux-mêmes.

#### TEST-005 — Tests frontend composables/stores additionnels

- **Description** : Ajouter des tests Vitest pour `auth.store.ts`, `useApi.ts` (intercepteurs axios, gestion 401), `useAuth.ts`, `useCheckout.ts` (créé en FRONT-001).
- **Pourquoi** : Seuls `cart.store.ts` et `notification.store.ts` sont testés actuellement ; l'authentification et les appels API centralisés n'ont aucune garantie automatisée.
- **Fichiers concernés** : `packages/stores/src/auth.store.ts`, `packages/composables/src/useApi.ts`, `packages/composables/src/useAuth.ts`, `packages/composables/src/useCheckout.ts`
- **Dossiers concernés** : `packages/stores/src/`, `packages/composables/src/`
- **Modifications précises** : étendre la config Vitest existante de `packages/stores` à `packages/composables` (créer `packages/composables/vitest.config.ts` si absent).
- **Fichiers à créer** : `packages/stores/src/auth.store.spec.ts`, `packages/composables/src/useApi.spec.ts`, `packages/composables/src/useAuth.spec.ts`, `packages/composables/src/useCheckout.spec.ts`, `packages/composables/vitest.config.ts`
- **Fichiers à supprimer** : aucun
- **Priorité** : Moyenne
- **Effort** : M (0,5-1 jour)
- **Dépendances** : ARCH-003, FRONT-001
- **Risques** : aucun
- **Critères de validation** : couverture des cas de login/logout/expiration token/erreur réseau.
- **Tests à réaliser** : les tests eux-mêmes.

#### INFRA-001 — Pipeline CI (lint + test + build)

- **Description** : Créer `.github/workflows/ci.yml` exécutant, sur chaque PR vers `main`/`dev` : `npm install`, lint (`eslint --workspaces`), build (`npm run build --workspaces`), tests (`npm run test --workspaces`), avec une base MySQL de service pour les tests d'intégration/e2e.
- **Pourquoi** : Aucun pipeline n'existe actuellement (`.github/` ne contient qu'un template de PR) — aucune garantie automatique avant merge, le `pull_request_template.md` repose entièrement sur l'auto-déclaration humaine.
- **Fichiers concernés** : `package.json` (scripts racine), tous les `package.json` de workspaces
- **Dossiers concernés** : `.github/workflows/` (à créer)
- **Modifications précises** : créer le workflow avec jobs séparés `lint`, `test-api`, `test-front`, `build`, déclenché sur `pull_request` et `push` vers `main`/`dev`.
- **Fichiers à créer** : `.github/workflows/ci.yml`
- **Fichiers à supprimer** : aucun
- **Priorité** : Critique
- **Effort** : M (0,5-1 jour)
- **Dépendances** : PREP-003 (les tests doivent passer en local avant d'être mis en CI)
- **Risques** : temps d'exécution CI à surveiller si la suite e2e (TEST-003) est lourde — prévoir un cache npm et une parallélisation des jobs.
- **Critères de validation** : une PR avec un test cassé ou un lint en échec est automatiquement bloquée (statut rouge GitHub).
- **Tests à réaliser** : test du pipeline lui-même (PR volontairement cassée pour vérifier le blocage).

#### INFRA-002 — Scan de vulnérabilités

- **Description** : Ajouter `npm audit --audit-level=high` comme step du pipeline CI, et configurer Dependabot (`.github/dependabot.yml`) pour les mises à jour de sécurité automatiques.
- **Pourquoi** : Aucun scan de dépendances n'est actuellement en place ; risque de vulnérabilités connues non détectées avant production.
- **Fichiers concernés** : `.github/workflows/ci.yml`
- **Dossiers concernés** : `.github/`
- **Modifications précises** : ajouter le step audit au workflow CI, créer la config Dependabot avec une fréquence hebdomadaire sur `npm` pour tous les workspaces.
- **Fichiers à créer** : `.github/dependabot.yml`
- **Fichiers à supprimer** : aucun
- **Priorité** : Moyenne
- **Effort** : XS (<1h)
- **Dépendances** : INFRA-001
- **Risques** : peut révéler des vulnérabilités existantes nécessitant des mises à jour de dépendances non planifiées — prévoir une marge de temps.
- **Critères de validation** : le step `npm audit` s'exécute et remonte un rapport ; Dependabot crée ses premières PR de mise à jour.
- **Tests à réaliser** : aucun (outillage).

#### INFRA-003 — Ajouter le champ `engines`

- **Description** : Ajouter `"engines": {"node": ">=20.0.0"}` dans `apps/api/package.json` et `apps/front-office/package.json` (et aux packages si pertinent).
- **Pourquoi** : Seul le Dockerfile fixe Node 20 actuellement ; un développeur local avec une autre version n'est averti par aucun garde-fou npm.
- **Fichiers concernés** : `apps/api/package.json`, `apps/front-office/package.json`
- **Dossiers concernés** : `apps/api/`, `apps/front-office/`
- **Modifications précises** : ajout du champ `engines`.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Faible
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : aucun
- **Critères de validation** : `npm install` avec une version Node incompatible affiche un avertissement.
- **Tests à réaliser** : aucun.

---

## Phase 5 – Finalisation et préparation à la production

### Tâches détaillées

#### DOC-001 — Mettre à jour la documentation technique

- **Description** : Corriger `ai_docs/architecture.md` (retirer la mention Turborepo inexistante, ou l'installer réellement), `ai_docs/database.md` (refléter le schéma réel post-DB-001, inclure `tax-rates`, `product-variants`), `ARCHITECTURE.md` racine (confirmer et détailler la fusion back-office → front-office/admin).
- **Pourquoi** : La documentation actuelle décrit un état du projet qui n'existe plus à plusieurs endroits, créant un risque de confusion pour l'onboarding et la maintenance future.
- **Fichiers concernés** : `ai_docs/architecture.md`, `ai_docs/database.md`, `ARCHITECTURE.md`
- **Dossiers concernés** : `ai_docs/`, racine
- **Modifications précises** : revue complète section par section, comparaison avec le code réel post-refactoring (Phases 1-4 terminées).
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Moyenne
- **Effort** : S (1-4h)
- **Dépendances** : DB-001, ARCH-003 (documenter l'état final, pas l'état intermédiaire)
- **Risques** : aucun
- **Critères de validation** : chaque affirmation de la doc est vérifiable dans le code au moment de la relecture.
- **Tests à réaliser** : aucun (documentation).

#### DOC-002 — Harmoniser les messages de commit

- **Description** : Adopter et documenter (dans un `CONTRIBUTING.md` ou section CLAUDE.md) une convention stricte Conventional Commits en français (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`), avec un commit-lint en CI si possible.
- **Pourquoi** : 89% des commits récents suivent un format conventionnel mais avec une sur-utilisation de `feat:` même pour des changements de config/test, et au moins un commit en anglais sans préfixe rompant la convention française du projet.
- **Fichiers concernés** : aucun fichier de code
- **Dossiers concernés** : racine (nouveau fichier `CONTRIBUTING.md` ou section CLAUDE.md)
- **Modifications précises** : documenter la convention, optionnellement ajouter `commitlint` + hook `husky` pour la faire respecter automatiquement.
- **Fichiers à créer** : `CONTRIBUTING.md` (ou section ajoutée à `CLAUDE.md`)
- **Fichiers à supprimer** : aucun
- **Priorité** : Faible
- **Effort** : XS (<1h)
- **Dépendances** : aucune
- **Risques** : aucun
- **Critères de validation** : les futurs commits respectent la convention documentée.
- **Tests à réaliser** : aucun.

#### ARCH-009 — Adoption de `packages/ui`

- **Description** : Remplacer progressivement les boutons/badges/cards Tailwind brut dupliqués dans les pages front-office par les composants `Button.vue`/`Badge.vue`/`Card.vue` de `packages/ui`, en commençant par les pages publiques à fort trafic (boutique, fiche produit).
- **Pourquoi** : `packages/ui` est documenté comme "cible finale du design" mais n'est utilisé que dans 4 fichiers sur tout le frontend — la quasi-totalité des pages réimplémentent leur propre style, à l'opposé de l'objectif de cohérence/réutilisabilité du design system.
- **Fichiers concernés** : `packages/ui/src/components/{Button,Badge,Card,Modal}.vue`, toutes les pages/composants front-office réimplémentant ces patterns
- **Dossiers concernés** : `apps/front-office/src/pages/`, `apps/front-office/src/components/`, `packages/ui/src/components/`
- **Modifications précises** : avant migration, corriger `Card.vue`/`Modal.vue` pour utiliser `var(--cacao-a12)` au lieu de la valeur rgba dupliquée en dur (cohérence avec les tokens) ; puis migrer page par page.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun (suppression du code dupliqué au fur et à mesure de la migration)
- **Priorité** : Moyenne
- **Effort** : L (1-3 jours, étalé)
- **Dépendances** : ARCH-004 (tokens nettoyés avant la migration de composants)
- **Risques** : risque de régression visuelle page par page — accompagner de captures d'écran avant/après par page migrée.
- **Critères de validation** : taux d'usage de `packages/ui` mesurable en hausse (grep des imports), pages migrées visuellement identiques ou améliorées.
- **Tests à réaliser** : revue visuelle systématique par page migrée.

#### FINAL-001 — Checklist production ready et smoke test complet

- **Description** : Exécuter formellement la checklist de fin de document (section suivante) et un smoke test manuel complet du parcours client (navigation → recherche → ajout panier → connexion → paiement réel test → confirmation) et du parcours admin (connexion admin → gestion produits/stock/commandes).
- **Pourquoi** : Dernière étape de validation avant tout déploiement réel, garantissant que l'ensemble des corrections des phases précédentes fonctionne en conditions intégrées.
- **Fichiers concernés** : aucun (validation transverse)
- **Dossiers concernés** : ensemble du projet
- **Modifications précises** : aucune, sauf corrections de bugs découverts lors du smoke test.
- **Fichiers à créer** : aucun
- **Fichiers à supprimer** : aucun
- **Priorité** : Critique
- **Effort** : M (0,5-1 jour)
- **Dépendances** : toutes les phases précédentes
- **Risques** : peut révéler des problèmes d'intégration non visibles tâche par tâche — prévoir une marge de correction.
- **Critères de validation** : toutes les cases de la checklist Production Ready sont cochées.
- **Tests à réaliser** : smoke test manuel complet, documenté avec captures d'écran/vidéo pour archivage.

---

## Diagramme de dépendances

```
DB-001 ──> BACK-001 ──> TEST-002
DB-001 ──> TEST-003
PREP-003 ──> INFRA-001 ──> INFRA-002
                │
BACK-001 ──> FRONT-001 ──> SEC-002
   │              │
   └──> TEST-002   └──> TEST-005 (avec ARCH-003)

ARCH-001 ──> ARCH-002
   │            │
   ├──> BACK-003
   ├──> TEST-004
   └──> ARCH-006 (via ARCH-007)

ARCH-007 ──> TEST-001 ──> TEST-003
ARCH-007 ──> ARCH-006

ARCH-003 ──> ARCH-008
   │
   └──> TEST-005
   └──> DOC-001 (avec DB-001)

ARCH-004 ──> ARCH-009

(SEC-001, SEC-003, SEC-004, BACK-002, BACK-004, FRONT-002,
 FRONT-003, FRONT-004, FRONT-005, INFRA-003, DOC-002 : indépendantes,
 exécutables en parallèle dès que la capacité le permet)

[Toutes les tâches] ──> FINAL-001
```

---

## Plan d'exécution recommandé

Hypothèse : 1 développeur senior à temps plein (ajuster en divisant par l'équipe disponible et en parallélisant les branches indépendantes du diagramme ci-dessus).

| Sprint    | Durée   | Contenu                                                             |
| --------- | ------- | ------------------------------------------------------------------- |
| Sprint 0  | 2 jours | PREP-002, PREP-003, SEC-001, SEC-003, BACK-002, INFRA-003           |
| Sprint 1  | 5 jours | DB-001 (cœur du sprint), DOC-001 (partiel, schéma)                  |
| Sprint 2  | 5 jours | BACK-001, TEST-002, ARCH-007, SEC-004                               |
| Sprint 3  | 5 jours | FRONT-001 (intégration Stripe réelle)                               |
| Sprint 4  | 5 jours | ARCH-001, ARCH-002, BACK-003, TEST-004, SEC-002                     |
| Sprint 5  | 5 jours | ARCH-003 (unification types — sprint dédié, fort impact transverse) |
| Sprint 6  | 5 jours | ARCH-008, ARCH-004, ARCH-005, ARCH-006, FRONT-002 à FRONT-005       |
| Sprint 7  | 5 jours | TEST-001, TEST-005, INFRA-001, INFRA-002                            |
| Sprint 8  | 5 jours | TEST-003 (e2e — sprint dédié)                                       |
| Sprint 9  | 3 jours | ARCH-009 (démarrage), DOC-002, DOC-001 (finalisation)               |
| Sprint 10 | 2 jours | FINAL-001 (checklist + smoke test complet)                          |

**Durée totale estimée : ~9-10 semaines avec un développeur senior à temps plein**, réductible à 5-6 semaines avec 2 développeurs travaillant en parallèle sur les branches backend/frontend du diagramme de dépendances (ex. un dev sur DB-001/BACK-\*/ARCH-001-002, un autre sur FRONT-001/ARCH-004-005/ARCH-009).

---

## Checklist Production Ready

- [ ] Architecture cohérente — `ARCH-001` à `ARCH-008` complétées, plus aucun Sequelize direct dans un service, types unifiés
- [ ] Sécurité validée — `SEC-001` à `SEC-004` complétées, CORS/CSP en place, secrets non prévisibles
- [ ] Gestion des erreurs complète — `HttpExceptionFilter` catch-all (`SEC-004`), aucune erreur native non catchée
- [ ] Tests suffisants — `TEST-001` à `TEST-005` complétées, couverture sur Guards/Stripe/repositories/e2e critique
- [ ] Documentation à jour — `DOC-001`, `DOC-002` complétées, CLAUDE.md et ai_docs reflètent l'état réel du code
- [ ] Monitoring en place — _(hors périmètre de cette roadmap, à ajouter : logs structurés, alerting sur échecs de paiement/webhook — recommandation pour une roadmap V2)_
- [ ] Performance validée — `ARCH-009` en cours/terminée (réduction duplication), smoke test de charge basique sur le tunnel de commande
- [ ] Déploiement sécurisé — schéma DB fiabilisé localement (`DB-001`) avec stratégie de migrations à réintroduire avant tout déploiement réel, pipeline CI actif (`INFRA-001`/`INFRA-002`), paiement réel fonctionnel et testé (`FRONT-001`/`TEST-002`)
