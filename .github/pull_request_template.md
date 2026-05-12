## Description

[Brève description du changement]

## Motivation et contexte

[Pourquoi ce changement ? Quel problème résout-il ? Référence à une issue si applicable.]

## Comment tester

[Étapes pour reproduire et valider le changement]

```bash
# Exemple
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
# Naviguer sur http://localhost:5173/...
```

## Type de changement

- [ ] Correction de bug (non-breaking)
- [ ] Nouvelle feature (non-breaking)
- [ ] Breaking change
- [ ] Documentation uniquement
- [ ] Refactoring (pas de changement fonctionnel)

## Checklist

- [ ] Build réussit : `npm run build --workspaces`
- [ ] Linters passent : `npm run lint --workspaces`
- [ ] Pas de duplication de code entre front-office et back-office
- [ ] Code partagé extrait vers `packages/` si pertinent
- [ ] Commits en Conventional Format (`feat:`, `fix:`, `docs:`...)
- [ ] Documentation mise à jour si le comportement change
- [ ] Variables d'environnement ajoutées dans `.env.example` si nécessaire
