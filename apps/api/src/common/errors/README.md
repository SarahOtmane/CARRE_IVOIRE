# throwApiError utility

Cette petite utilité standardise le lancer d'erreurs API.

Usage

- `throwApiError(code, message?)` lance une `HttpException` avec le `code` et le `message` fourni.
- Le statut HTTP est dérivé depuis `getHttpStatusFromErrorCode(code)`.

Exemples

```ts
import { ErrorCodes } from "@/common/constants";
import throwApiError from "@/common/errors/throw-api-error";

if (!product)
  throwApiError(ErrorCodes.PRODUCT_NOT_FOUND, "Produit introuvable");
```

Migration

- Préférez `throwApiError(...)` dans les services, guards et repositories.
- Le filtre global `HttpExceptionFilter` s'appuie maintenant sur le `code` pour normaliser les réponses.

Tests

- Ajoutez des tests unitaires visant `getHttpStatusFromErrorCode` et `throwApiError`.
