# AUDIT TECHNIQUE — CARRÉ IVOIRE

## Plan d'action complet

**Date :** 26 juin 2026 | **Branche :** `dev` | **Score global : 71/100**

---

## RÉSUMÉ EXÉCUTIF

Le projet a une architecture backend solide (pattern Repository strict, transactions atomiques, idempotence Stripe) et un design system cohérent. Les problèmes critiques sont concentrés sur la couche frontend : des pages déconnectées de l'API, des frais de livraison absents du paiement réel, et l'absence de HTTPS. Ces points doivent être résolus avant tout déploiement en production.

| Priorité                           | Nb points | Estimation | Avancement  |
| ---------------------------------- | --------- | ---------- | ----------- |
| 🔴 Critique (bloquant fonctionnel) | 5         | ~14h       | ✅ 5/5 fait |
| 🟠 Important (avant production)    | 8         | ~32h       | ✅ 8/8 fait |
| 🟡 Amélioration (prochainement)    | 8         | ~28h       | ✅ 8/8 fait |
| 🟢 Optimisation (non bloquant)     | 5         | ~16h       |
| **Total**                          | **26**    | **~90h**   |

---

## 🔴 CRITIQUE — À corriger en priorité absolue ✅ TERMINÉ

---

### ✅ C1 — Page "Mes commandes" : données hardcodées

**Fichier :** `apps/front-office/src/pages/compte/commandes/index.vue`  
**Problème :** `const orders = [{ id: "CI-2026-0142", ... }]` — liste statique inchangeable.  
**Impact :** Un utilisateur réel ne voit jamais ses vraies commandes.  
**Temps estimé :** 2h

**Ce qu'il faut faire :**

1. Créer le composable `packages/composables/src/useUserOrders.ts` :

2. Exporter depuis `packages/composables/src/index.ts` : ajouter `export * from './useUserOrders'`

3. Remplacer le contenu de `apps/front-office/src/pages/compte/commandes/index.vue` :

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useUserOrders } from "@carre-ivoire/composables";

const { orders, isLoading, error, fetchOrders } = useUserOrders();

onMounted(() => fetchOrders());

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: "En attente",
    payment_pending: "Paiement en cours",
    confirmed: "Confirmée",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée",
  };
  return map[status] ?? status;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace(".", ",")} €`;
}
</script>
```

---

### ✅ C2 — Page "Mes informations" : bouton Enregistrer sans effet

**Fichier :** `apps/front-office/src/pages/compte/informations.vue`  
**Problème :** `function save() { /* Intégration API à brancher ici */ saved.value = true }` — aucune requête envoyée.  
**Impact :** Toute modification du profil (nom, adresse, téléphone) est perdue au rechargement.  
**Temps estimé :** 2h

**Ce qu'il faut faire :**

1. Importer `useApi` et `useAuthStore` dans le script setup

2. Remplacer la fonction `save()` :

```typescript
import { useApi } from "@carre-ivoire/composables";
import { useAuthStore } from "@carre-ivoire/stores";

const api = useApi();
const authStore = useAuthStore();
const saveError = ref<string | null>(null);

async function save() {
  saveError.value = null;
  try {
    const res = await api.patch("/users/me", {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    });
    // Mettre à jour le store si le backend renvoie l'utilisateur mis à jour
    if (res.data?.data) {
      authStore.setAuth(authStore.token!, res.data.data);
    }
    saved.value = true;
    setTimeout(() => {
      saved.value = false;
    }, 2000);
  } catch {
    saveError.value = "Une erreur est survenue. Veuillez réessayer.";
  }
}
```

3. Vérifier que `UpdateUserDto` dans `apps/api/src/modules/users/dto/update-user.dto.ts` accepte `firstName`, `lastName`, `phone`

---

### ✅ C3 — Frais de livraison absents du montant Stripe

**Fichier backend :** `apps/api/src/modules/orders/dto/create-order.dto.ts` + `orders.service.ts`  
**Fichier frontend :** `apps/front-office/src/pages/commande/index.vue`  
**Problème :** L'utilisateur voit `grandTotal = items + livraison` mais Stripe facture seulement `items`. La livraison n'est jamais prélevée.  
**Impact :** Perte financière réelle pour chaque commande avec livraison payante.  
**Temps estimé :** 3h

**Ce qu'il faut faire côté backend :**

1. Ajouter `shippingAmount` au DTO :

```typescript
// apps/api/src/modules/orders/dto/create-order.dto.ts
import { IsInt, Min, IsOptional } from "class-validator";

export class CreateOrderDto {
  // ... champs existants ...

  @IsOptional()
  @IsInt()
  @Min(0)
  shippingAmount?: number; // en centimes
}
```

2. Modifier `orders.service.ts` pour inclure `shippingAmount` dans `totalAmount` :

```typescript
// Dans createOrder(), après le calcul de totalAmount depuis les items
const itemsTotal = /* calcul existant */
const shippingAmount = dto.shippingAmount ?? 0
const totalAmount = itemsTotal + shippingAmount
```

3. Stocker `shippingAmount` dans le modèle Order (ajouter la colonne via migration ou `alter: true`)

**Ce qu'il faut faire côté frontend :**

```typescript
// apps/front-office/src/pages/commande/index.vue
// Dans submitOrder(), ajouter shippingAmount à la requête
await api.post("/orders", {
  items: cartStore.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    format: item.format,
  })),
  shippingAddress,
  shippingAmount: deliveryPrice * 100, // en centimes
});
```

---

### ✅ C4 — Absence de page d'inscription

**Problème :** `POST /auth/register` fonctionne mais aucune page frontend ne permet de créer un compte. Les nouveaux utilisateurs sont bloqués.  
**Temps estimé :** 3h

**Ce qu'il faut faire :**

1. Créer `apps/front-office/src/pages/inscription.vue` :

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "@carre-ivoire/composables";
import { useAuthStore } from "@carre-ivoire/stores";
import { Button } from "@carre-ivoire/ui";

const router = useRouter();
const api = useApi();
const authStore = useAuthStore();

const form = ref({ firstName: "", lastName: "", email: "", password: "" });
const error = ref<string | null>(null);
const isLoading = ref(false);

async function submit() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await api.post("/auth/register", form.value);
    authStore.setAuth(res.data.data.token, res.data.data.user);
    router.push("/compte/commandes");
  } catch (e: any) {
    error.value =
      e.response?.data?.error?.message ?? "Erreur lors de l'inscription.";
  } finally {
    isLoading.value = false;
  }
}
</script>
```

2. Ajouter la route dans `apps/front-office/src/router/index.ts` :

```typescript
{ path: '/inscription', component: () => import('@/pages/inscription.vue') }
```

3. Ajouter un lien "Créer un compte" sur `connexion.vue`

---

### ✅ C5 — `useAdminProducts.fetchOne()` : route inexistante

**Fichier :** `packages/composables/src/useAdminProducts.ts`, ligne 23  
**Problème :** `api.get('/products/by-id/${id}')` — cette route n'existe pas dans l'API. Le backend expose `GET /products/:slug` uniquement.  
**Temps estimé :** 30min

**Option A (recommandée) — Supprimer la méthode si non utilisée :**

Vérifier si `fetchOne` est appelé dans les pages admin. Si ce n'est pas le cas, supprimer la méthode de `useAdminProducts.ts`.

**Option B — Ajouter l'endpoint dans l'API :**

```typescript
// apps/api/src/modules/products/products.controller.ts
@Get('by-id/:id')
@UseGuards(JwtAuthGuard, AdminGuard)
async findById(@Param('id', ParseIntPipe) id: number) {
  const product = await this.productsService.findById(id)
  return product
}
```

Et dans `products.service.ts` :

```typescript
async findById(id: number): Promise<Product> {
  const product = await this.productsRepository.findById(id)
  if (!product) throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND' })
  return product
}
```

---

## 🟠 IMPORTANT — Avant mise en production ✅ TERMINÉ

---

### ✅ I1 — HTTPS en production

**Fichiers :** `docker/nginx/nginx.conf`, `docker-compose.prod.yml`  
**Problème :** Port 80 uniquement. Tokens JWT, données de commande et cookies transitent en clair.  
**Temps estimé :** 4h

**Ce qu'il faut faire :**

1. Créer `docker/nginx/nginx.prod.conf` avec SSL :

```nginx
server {
    listen 80;
    server_name carre-ivoire.fr www.carre-ivoire.fr;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name carre-ivoire.fr www.carre-ivoire.fr;

    ssl_certificate     /etc/letsencrypt/live/carre-ivoire.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/carre-ivoire.fr/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    # ... reste de la config existante ...
}
```

2. Ajouter Certbot dans `docker-compose.prod.yml` :

```yaml
certbot:
  image: certbot/certbot
  volumes:
    - ./certbot/conf:/etc/letsencrypt
    - ./certbot/www:/var/www/certbot
  command: certonly --webroot -w /var/www/certbot -d carre-ivoire.fr --email sarahotmane02@gmail.com --agree-tos --no-eff-email
```

---

### ✅ I2 — Endpoint changement de mot de passe

**Problème :** La page `/compte/informations` propose un formulaire de changement de mot de passe mais aucun endpoint API ne le supporte.  
**Temps estimé :** 4h

**Ce qu'il faut faire côté backend :**

1. Créer le DTO :

```typescript
// apps/api/src/modules/users/dto/change-password.dto.ts
import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
```

2. Ajouter la route dans `users.controller.ts` :

```typescript
@Patch('me/password')
@UseGuards(JwtAuthGuard)
async changePassword(
  @CurrentUser() user: AuthUser,
  @Body() dto: ChangePasswordDto,
) {
  await this.usersService.changePassword(user.id, dto)
  return { success: true }
}
```

3. Implémenter dans `users.service.ts` :

```typescript
async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
  const user = await this.usersRepository.findById(userId)
  const valid = await bcrypt.compare(dto.currentPassword, user.password_hash)
  if (!valid) throw new UnauthorizedException({ code: 'INVALID_PASSWORD' })
  const hash = await bcrypt.hash(dto.newPassword, 12)
  await this.usersRepository.update(userId, { password_hash: hash })
}
```

4. Connecter le formulaire dans `informations.vue` :

```typescript
async function changePassword() {
  await api.patch("/users/me/password", {
    currentPassword: passwordForm.current,
    newPassword: passwordForm.new,
  });
}
```

---

### ✅ I3 — Access token hors localStorage

**Fichier :** `packages/stores/src/auth.store.ts`  
**Problème :** `{ persist: true }` stocke le token JWT dans `localStorage`. Un XSS peut le voler.  
**Temps estimé :** 8h

**Ce qu'il faut faire :**

1. Modifier le store pour ne PAS persister le token :

```typescript
// packages/stores/src/auth.store.ts
export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null); // en mémoire uniquement
    const user = ref<User | null>(null);
    // ... reste identique ...
  },
  {
    persist: {
      paths: ["user"], // Persist seulement les infos utilisateur, pas le token
    },
  },
);
```

2. Créer un composable `useTokenRefresh` appelé au démarrage de l'app :

```typescript
// packages/composables/src/useTokenRefresh.ts
import { useApi } from "./useApi";
import { useAuthStore } from "@carre-ivoire/stores";

export async function refreshTokenOnMount() {
  const api = useApi();
  const authStore = useAuthStore();

  // Si l'utilisateur est connu (user en localStorage) mais token absent (mémoire),
  // tenter de renouveler via le cookie refresh_token
  if (authStore.user && !authStore.token) {
    try {
      const res = await api.post("/auth/refresh");
      authStore.setAuth(res.data.data.token, res.data.data.user);
    } catch {
      authStore.logout();
    }
  }
}
```

3. Appeler dans `apps/front-office/src/App.vue` au `onMounted`

---

### ✅ I4 — Index FULLTEXT pour la recherche

**Problème :** `MATCH() AGAINST()` dans `products.repository.findAll()` sans index FULLTEXT = scan complet à chaque recherche.  
**Temps estimé :** 30min

**Ce qu'il faut faire :**

Option A — Script SQL à exécuter une seule fois :

```sql
ALTER TABLE products ADD FULLTEXT INDEX ft_search (name, short_description, description);
```

Option B — Dans le modèle Sequelize :

```typescript
// apps/api/src/modules/products/product.model.ts
@Table({
  tableName: "products",
  indexes: [
    { type: "FULLTEXT", fields: ["name", "short_description", "description"] },
  ],
})
export class Product extends Model {
  /* ... */
}
```

---

### ✅ I5 — Validation des formulaires frontend

**Fichiers :** `apps/front-office/src/components/checkout/CheckoutForm.vue`, `connexion.vue`, `informations.vue`  
**Problème :** Aucune validation côté client. L'utilisateur peut soumettre des champs vides.  
**Temps estimé :** 4h

**Ce qu'il faut faire (exemple sur CheckoutForm) :**

```typescript
// Ajouter dans CheckoutForm.vue
const errors = ref<Record<string, string>>({});

function validate(): boolean {
  errors.value = {};
  if (!form.firstName?.trim()) errors.value.firstName = "Prénom requis";
  if (!form.lastName?.trim()) errors.value.lastName = "Nom requis";
  if (!form.email?.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
    errors.value.email = "Email invalide";
  if (!form.address?.trim()) errors.value.address = "Adresse requise";
  if (!form.postalCode?.trim() || !/^\d{5}$/.test(form.postalCode))
    errors.value.postalCode = "Code postal invalide (5 chiffres)";
  if (!form.city?.trim()) errors.value.city = "Ville requise";
  return Object.keys(errors.value).length === 0;
}

async function submit() {
  if (!validate()) return;
  // ... reste du submit
}
```

Afficher `errors.firstName` etc. sous chaque input dans le template.

---

### ✅ I6 — DTOs inline dans `auth.controller.ts`

**Fichier :** `apps/api/src/modules/auth/auth.controller.ts`, lignes 13–25  
**Problème :** `ForgotPasswordDto` et `ResetPasswordDto` déclarés dans le controller.  
**Temps estimé :** 1h

**Ce qu'il faut faire :**

1. Créer `apps/api/src/modules/auth/dto/forgot-password.dto.ts` :

```typescript
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
```

2. Créer `apps/api/src/modules/auth/dto/reset-password.dto.ts` :

```typescript
import { IsString, MinLength, Matches } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: "Le mot de passe doit contenir une majuscule et un chiffre",
  })
  password: string;
}
```

3. Importer ces classes dans `auth.controller.ts` et supprimer les déclarations inline

---

### ✅ I7 — `useApi()` → instance singleton

**Fichier :** `packages/composables/src/useApi.ts`  
**Problème :** Nouvelle instance Axios créée à chaque appel. Intercepteurs re-enregistrés × N.  
**Temps estimé :** 1h

**Ce qu'il faut faire :**

```typescript
// packages/composables/src/useApi.ts
import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@carre-ivoire/stores";

let _instance: AxiosInstance | null = null;

export function useApi(): AxiosInstance {
  if (_instance) return _instance;

  _instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
    withCredentials: true,
  });

  _instance.interceptors.request.use((config) => {
    // Lire le store LORS de la requête, pas à la création du singleton
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  });

  _instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore();
        authStore.logout();
      }
      return Promise.reject(error);
    },
  );

  return _instance;
}
```

**Important :** Tester que le token est bien relu depuis le store à chaque requête et pas capturé dans la closure du singleton.

---

### ✅ I8 — CI audit ne doit pas être ignoré

**Fichier :** `.github/workflows/ci.yml`  
**Problème :** `continue-on-error: true` sur `npm audit` — les vulnérabilités high/critical ne bloquent pas le pipeline.  
**Temps estimé :** 15min

```yaml
# .github/workflows/ci.yml
- name: Security audit
  run: npm audit --audit-level=high
  # Supprimer : continue-on-error: true
```

Si des vulnérabilités actuelles empêchent cela, les documenter dans `.nsprc` ou utiliser `npm audit --audit-level=critical` temporairement.

---

## 🟡 AMÉLIORATION — Prochainement ✅ TERMINÉ

---

### ✅ A1 — Newsletter : connecter le frontend

**Endpoint existant :** `POST /newsletter/subscribe`  
**Temps estimé :** 3h

Ajouter un composant `packages/ui/src/NewsletterForm.vue` :

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "@carre-ivoire/composables";

const api = useApi();
const email = ref("");
const submitted = ref(false);
const error = ref<string | null>(null);

async function subscribe() {
  if (!email.value.trim()) return;
  try {
    await api.post("/newsletter/subscribe", { email: email.value });
    submitted.value = true;
  } catch {
    error.value = "Erreur lors de l'inscription. Veuillez réessayer.";
  }
}
</script>
```

Intégrer dans le footer de `AppFooter.vue` ou dans la page boutique (état vide).

---

### ✅ A2 — Recherche produits : ajouter l'UI

**Endpoint existant :** `GET /products?search=terme`  
**Temps estimé :** 4h

1. Ajouter un input de recherche dans `boutique/index.vue`
2. Passer le terme à `fetch({ search: searchTerm, limit: 12 })`
3. L'API fulltext gère le reste

Note : Ajouter l'index FULLTEXT (point I4) avant de brancher la recherche.

---

### ✅ A3 — Endpoint admin : liste des clients

**Temps estimé :** 6h

**Backend — ajouter `GET /users` (admin) :**

```typescript
// users.controller.ts
@Get()
@UseGuards(JwtAuthGuard, AdminGuard)
async findAll(@Query() query: UserQueryDto) {
  return this.usersService.findAll(query)
}
```

Avec `UserQueryDto` : `page`, `limit`, `search` (email, nom).

**Frontend — implémenter `/admin/clients/index.vue`** avec tableau paginé.

---

### ✅ A4 — Tri des produits côté serveur

**Fichier :** `apps/api/src/modules/products/dto/product-query.dto.ts` + `products.repository.ts`  
**Temps estimé :** 3h

1. Ajouter `sort: 'price_asc' | 'price_desc' | 'newest'` dans `ProductQueryDto`
2. Appliquer dans `products.repository.findAll()` : `ORDER BY price ASC`
3. Dans `boutique/index.vue` : passer le sort en param API plutôt que `computed()`

---

### ✅ A5 — Champs legacy `address_*` dans orders

**Temps estimé :** 2h

Ces colonnes (`address_street`, `address_city`, `address_zip`, `address_country`) dupliquent `shipping_address` JSON. Migration recommandée :

```sql
ALTER TABLE orders
  DROP COLUMN address_street,
  DROP COLUMN address_city,
  DROP COLUMN address_zip,
  DROP COLUMN address_country;
```

Coordonner avec `order.model.ts` pour supprimer les champs correspondants.

---

### ✅ A6 — Mettre à jour le SDK Stripe

**Fichier :** `apps/api/package.json`  
**Temps estimé :** 2h

```bash
npm install stripe@^17.0.0 --workspace=apps/api
```

Vérifier les changements breaking dans le changelog Stripe SDK v14 → v17.  
Mettre à jour `apiVersion` dans `stripe.service.ts`.

---

### ✅ A7 — Rate limiting par email sur le login

**Fichier :** `apps/api/src/modules/auth/auth.controller.ts`  
**Temps estimé :** 4h

Utiliser un store en mémoire (ou Redis si disponible) pour compter les tentatives par email :

```typescript
// apps/api/src/modules/auth/guards/login-attempts.guard.ts
// Bloquer temporairement (5min) si > 5 tentatives échouées sur le même email
```

---

### ✅ A8 — Paramètres généraux admin : sauvegarder

**Fichier :** `apps/front-office/src/pages/admin/parametres/index.vue`  
**Temps estimé :** 4h

Les paramètres (frais de livraison, email BCC, adresse) ne sont pas sauvegardés. Deux options :

- Option A : Endpoint `GET/PATCH /settings` dans l'API (table `settings` clé/valeur)
- Option B : Fichier de configuration en DB via table dédiée

Recommandation : Option A, simple et extensible.

---

## 🟢 OPTIMISATION — Non bloquant

---

### O1 — Cache HTTP sur les produits publics

```typescript
// products.controller.ts
@Get()
@Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=30')
async findAll(@Query() query: ProductQueryDto) { /* ... */ }
```

---

### O2 — Update optimiste sur les favoris

```typescript
// packages/composables/src/useFavorites.ts
async function add(productId: number) {
  favoriteIds.value.add(productId); // Optimiste
  try {
    await api.post(`/favorites/${productId}`);
  } catch {
    favoriteIds.value.delete(productId); // Rollback
  }
}
```

---

### O3 — Index MySQL complémentaires

```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX idx_products_category_active ON products (category_id, is_active, display_order);
CREATE INDEX idx_products_active_order ON products (is_active, display_order);
```

---

### O4 — Tests composants Vue

Ajouter `@vue/test-utils` + `vitest` dans `apps/front-office` et écrire des tests pour :

- `produits/[slug].vue` : ajout panier, sélection variante, toggle favori
- `commande/index.vue` : validation formulaire, soumission
- `ProductCard.vue` : rendu avec et sans variante

---

### O5 — Rotation du refresh token

À chaque appel `POST /auth/refresh`, émettre un nouveau refresh token et stocker les tokens émis (table `refresh_tokens` avec contrainte UNIQUE). Invalider l'ancien à la rotation.

---

## VARIABLES D'ENVIRONNEMENT À VÉRIFIER AVANT PRODUCTION

```bash
# apps/api/.env — OBLIGATOIRE à modifier avant production
JWT_SECRET=<générer 64 chars aléatoires — jamais réutiliser le secret de dev>
REFRESH_TOKEN_SECRET=<générer 64 chars aléatoires — la valeur par défaut est invalide>
DB_PASSWORD=<mot de passe fort — changer "changeme123">
STRIPE_SECRET_KEY=<clé Stripe live — pas la clé de test>
STRIPE_WEBHOOK_SECRET=<secret du webhook live>
ADMIN_PASSWORD=<mot de passe fort — changer "Admin1234!">
CORS_ORIGIN=https://carre-ivoire.fr
FRONTEND_URL=https://carre-ivoire.fr

# apps/front-office/.env
VITE_API_URL=https://carre-ivoire.fr/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=<clé publique Stripe live>
```

---

## ORDRE D'EXÉCUTION RECOMMANDÉ

```
Semaine 1 : Bloqueants fonctionnels + sécurité data
  └─ C1 : Page commandes → API
  └─ C2 : Page informations → API
  └─ C3 : Frais de livraison dans Stripe
  └─ C5 : fetchOne() URL correcte ou supprimée

Semaine 2 : Avant toute URL publique
  └─ I1 : HTTPS + SSL
  └─ I3 : Token en mémoire (pas localStorage)
  └─ I4 : Index FULLTEXT
  └─ I8 : CI audit bloquant

Semaine 3 : Complétion fonctionnelle
  └─ C4 : Page inscription
  └─ I2 : Changement mot de passe
  └─ I5 : Validation formulaires
  └─ I6 : DTOs dans fichiers dédiés
  └─ I7 : useApi singleton

Semaine 4+ : Amélioration et optimisation
  └─ A1–A8 dans l'ordre des priorités métier
  └─ O1–O5 en parallèle des features
```

---

## BUGS À CORRIGER DANS BOUTIQUE/INDEX.VUE

La variable CSS `--border` utilisée à deux endroits (lignes 59 et 124) n'existe pas dans le design system. Remplacer par `var(--cacao-a12)` :

```diff
- style="border-bottom: 1px solid var(--border)"
+ style="border-bottom: 1px solid var(--cacao-a12)"

- style="border: 1px solid var(--border); min-width: 172px"
+ style="border: 1px solid var(--cacao-a12); min-width: 172px"
```

---

_Généré le 26 juin 2026 — Audit Carré Ivoire v1.0_
