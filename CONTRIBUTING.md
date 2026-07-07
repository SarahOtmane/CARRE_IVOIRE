# Guide de contribution — Carré Ivoire

## Convention des messages de commit

Ce projet utilise **Conventional Commits** en français. Chaque commit doit respecter le format :

```
<type>(<périmètre optionnel>): <description courte en français>
```

### Types autorisés

| Type       | Usage                                                                 |
| ---------- | --------------------------------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité visible pour l'utilisateur ou l'admin         |
| `fix`      | Correction d'un bug                                                   |
| `refactor` | Refactoring sans changement de comportement observable                |
| `test`     | Ajout ou modification de tests uniquement                             |
| `docs`     | Modification de documentation uniquement (md, commentaires)           |
| `chore`    | Tâches techniques : dépendances, config, scripts, CI, build           |
| `style`    | Mise en forme, tokens, CSS — sans changement de logique               |
| `perf`     | Amélioration de performance sans changement fonctionnel               |

### Exemples corrects

```
feat(orders): ajouter la garde-fou VARIANT_REQUIRED avant décrément de stock
fix(stripe): remplacer throw Error natif par InternalServerErrorException
refactor(products): extraire toVariantResponseDto dans un mapper partagé
test(guards): couvrir les scénarios token absent, expiré et rôle admin
docs(architecture): corriger la structure monorepo post-fusion back-office
chore(ci): ajouter pipeline GitHub Actions lint + test + build
```

### Règles

- **Langue** : français obligatoire dans la description (le type reste en anglais)
- **Impératif présent** : "ajouter" et non "ajouté" ni "j'ai ajouté"
- **Longueur** : description ≤ 72 caractères ; détails dans le corps du commit si nécessaire
- **`feat:` pour les fonctionnalités, pas pour les corrections de config** : préférer `chore:` ou `refactor:` pour les changements techniques sans valeur métier directe
- **Un commit = une intention** : ne pas mélanger un fix et un refactor dans le même commit

### Périmètre (scope) optionnel

Préciser le module concerné entre parenthèses quand c'est pertinent :

```
fix(auth): corriger la validation du token expiré
feat(newsletter): ajouter endpoint POST /newsletter/subscribe
chore(deps): mettre à jour stripe vers 14.x
```

---

## Branches

| Branche   | Usage                                                   |
| --------- | ------------------------------------------------------- |
| `main`    | Code stable, prêt pour la production                    |
| `dev`     | Branche d'intégration — cible des PR de features        |
| `phase/*` | Branches de phase (phases 1–5 de la roadmap technique)  |
| `fix/*`   | Hotfixes urgents depuis `main`                          |

---

## Pull Requests

- Toujours ouvrir une PR vers `dev` (sauf hotfix critique → `main`)
- Remplir le template de PR : contexte, changements, plan de test
- La CI (lint + test + build) doit être verte avant merge
- Au moins une relecture avant merge

---

## Tests

Avant d'ouvrir une PR :

```bash
# Backend (Jest)
cd apps/api && npm test

# Frontend stores et composables (Vitest)
npm run test --workspaces --if-present

# E2E backend
cd apps/api && npm run test:e2e
```

---

## Design system

Toujours lire `packages/config/styles/colors-and-type.css` avant de toucher au CSS.
Ne jamais utiliser de valeurs rgba en dur — utiliser les tokens CSS (`--cacao-a12`, `--scrim`, etc.).
Voir `CLAUDE.md` pour les règles design non négociables.
