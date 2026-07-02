<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useAdminProducts,
  useAdminCategories,
  useAdminTaxRates,
  useImageUpload,
  useAdminProductVariants,
} from "@carre-ivoire/composables";

const route = useRoute();
const router = useRouter();
const { products, fetchAll, update, remove, isLoading } = useAdminProducts();
const { categories } = useAdminCategories();
const { taxRates } = useAdminTaxRates();
const { upload, isUploading } = useImageUpload();
const {
  variants,
  fetchAll: fetchVariants,
  create: createVariant,
  update: updateVariant,
  remove: removeVariant,
} = useAdminProductVariants();

const productId = computed(() => Number(route.params.id));

const newVariant = ref({ label: "", weightGrams: 0, price: 0, stock: 0 });

async function addVariant() {
  if (!newVariant.value.label.trim() || newVariant.value.price <= 0) return;
  await createVariant(productId.value, {
    label: newVariant.value.label,
    weightGrams: newVariant.value.weightGrams || undefined,
    price: Math.round(newVariant.value.price * 100),
    stock: newVariant.value.stock,
  });
  newVariant.value = { label: "", weightGrams: 0, price: 0, stock: 0 };
}

function onVariantStockStatusChange(variantId: number, stockStatus: "in_stock" | "out_of_stock") {
  updateVariant(productId.value, variantId, { stockStatus });
}

function onVariantStockChange(variantId: number, stock: number) {
  updateVariant(productId.value, variantId, { stock });
}

async function deleteVariant(variantId: number) {
  if (!confirm("Supprimer cette variante ?")) return;
  await removeVariant(productId.value, variantId);
}

const draft = ref({
  name: "",
  slug: "",
  categoryId: 0,
  price: 0,
  stockStatus: 'in_stock' as 'in_stock' | 'out_of_stock',
  taxRateId: null as number | null,
  shortDescription: "",
  description: "",
  isActive: true,
  ingredients: "",
  allergens: "",
  weightGrams: 0,
  imageUrl: "",
});

const found = ref(false);

onMounted(async () => {
  await fetchAll();
  await fetchVariants(productId.value);
});

watch(
  [products, productId],
  ([list, id]) => {
    const product = list.find((p) => p.id === id);
    if (product) {
      found.value = true;
      draft.value = {
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        price: product.price / 100,
        stockStatus: product.stockStatus === 'out_of_stock' ? 'out_of_stock' : 'in_stock',
        taxRateId: product.taxRateId ?? null,
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        isActive: product.isActive,
        ingredients: product.ingredients ?? "",
        allergens: product.allergens ?? "",
        weightGrams: product.weightGrams ?? 0,
        imageUrl: product.imageUrl ?? "",
      };
    }
  },
  { immediate: true },
);

async function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await upload(file);
  if (url) draft.value.imageUrl = url;
}

async function save() {
  if (!draft.value.name.trim() || !draft.value.slug.trim()) return;
  await update(productId.value, {
    name: draft.value.name,
    slug: draft.value.slug,
    categoryId: draft.value.categoryId,
    price: Math.round(draft.value.price * 100),
    stockStatus: draft.value.stockStatus,
    taxRateId: draft.value.taxRateId,
    shortDescription: draft.value.shortDescription || undefined,
    description: draft.value.description || undefined,
    isActive: draft.value.isActive,
    ingredients: draft.value.ingredients || undefined,
    allergens: draft.value.allergens || undefined,
    weightGrams: draft.value.weightGrams || undefined,
    imageUrl: draft.value.imageUrl || undefined,
  });
  router.push({ name: "admin-produits" });
}

async function archive() {
  if (!confirm("Désactiver ce produit ?")) return;
  await update(productId.value, { isActive: false });
  router.push({ name: "admin-produits" });
}

async function deleteProduct() {
  if (!confirm("Supprimer définitivement ce produit ?")) return;
  await remove(productId.value);
  router.push({ name: "admin-produits" });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cacao pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cacao/45">
          02 — Produits
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cacao sm:text-6xl">
          Modifier le produit,
          <span class="italic text-cacao/55">sans perdre la main.</span>
        </h2>
      </div>
    </section>

    <div v-if="isLoading && !found" class="py-16 text-center font-body text-sm italic text-cacao/45">
      Chargement…
    </div>

    <div
      v-else-if="found"
      class="grid gap-8 border border-cacao bg-ivoire p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
    >
      <div class="grid gap-6">
        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Nom du produit</span>
          <input
            v-model="draft.name"
            type="text"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Slug (URL)</span>
          <input
            v-model="draft.slug"
            type="text"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
          />
        </label>

        <div class="grid gap-6 lg:grid-cols-2">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Catégorie</span>
            <select
              v-model.number="draft.categoryId"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Statut</span>
            <select
              v-model="draft.isActive"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            >
              <option :value="true">Actif</option>
              <option :value="false">Inactif</option>
            </select>
          </label>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Prix (€)</span>
            <input
              v-model.number="draft.price"
              type="number"
              min="0"
              step="0.01"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Disponibilité</span>
            <select
              v-model="draft.stockStatus"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            >
              <option value="in_stock">En stock</option>
              <option value="out_of_stock">Rupture de stock</option>
            </select>
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Poids (g)</span>
            <input
              v-model.number="draft.weightGrams"
              type="number"
              min="0"
              step="1"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">TVA applicable</span>
          <select
            v-model.number="draft.taxRateId"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
          >
            <option :value="null">Aucune TVA</option>
            <option v-for="tva in taxRates" :key="tva.id" :value="tva.id">
              {{ tva.label }} — {{ tva.rate }} %
            </option>
          </select>
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Accroche courte</span>
          <input
            v-model="draft.shortDescription"
            type="text"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Description</span>
          <textarea
            v-model="draft.description"
            rows="4"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base leading-7 text-cacao outline-none focus:border-cacao/60"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Ingrédients</span>
          <input
            v-model="draft.ingredients"
            type="text"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Allergènes</span>
          <input
            v-model="draft.allergens"
            type="text"
            placeholder="Contient : fruits à coque, lait, soja…"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
          />
        </label>

        <div class="grid gap-4 border-t border-cacao pt-6">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Variantes (poids / prix)</span>

          <div v-if="variants.length" class="grid gap-3">
            <div
              v-for="variant in variants"
              :key="variant.id"
              class="flex flex-wrap items-center gap-3 border border-cacao bg-beige-doux/20 p-3"
            >
              <span class="min-w-0 flex-1 truncate font-body text-sm text-cacao">{{ variant.label }}</span>
              <span class="shrink-0 font-body text-sm text-cacao/70">{{ (variant.price / 100).toFixed(2).replace(".", ",") }} €</span>
              <input
                type="number"
                min="0"
                :value="variant.stock"
                class="w-[90px] shrink-0 border border-cacao bg-ivoire px-2 py-1.5 font-body text-sm text-cacao outline-none focus:border-cacao/60"
                @change="onVariantStockChange(variant.id, Number(($event.target as HTMLInputElement).value))"
              />
              <select
                :value="variant.stockStatus"
                class="w-[130px] shrink-0 border border-cacao bg-ivoire px-2 py-1.5 font-body text-sm text-cacao outline-none focus:border-cacao/60"
                @change="onVariantStockStatusChange(variant.id, ($event.target as HTMLSelectElement).value as 'in_stock' | 'out_of_stock')"
              >
                <option value="in_stock">En stock</option>
                <option value="out_of_stock">Rupture</option>
              </select>
              <button
                type="button"
                class="shrink-0 font-body text-[11px] uppercase tracking-[0.14em] text-red-700"
                @click="deleteVariant(variant.id)"
              >
                Supprimer
              </button>
            </div>
          </div>
          <p v-else class="font-body text-sm italic text-cacao/45">Aucune variante — le produit utilise son prix unique.</p>

          <div class="flex flex-wrap items-end gap-3">
            <label class="grid min-w-[140px] flex-1 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cacao/45">Libellé</span>
              <input
                v-model="newVariant.label"
                type="text"
                placeholder="Ex. 250g"
                class="w-full border border-cacao bg-beige-doux/20 px-2 py-1.5 font-body text-sm text-cacao outline-none focus:border-cacao/60"
              />
            </label>
            <label class="grid w-[90px] shrink-0 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cacao/45">Poids (g)</span>
              <input
                v-model.number="newVariant.weightGrams"
                type="number"
                min="0"
                class="w-full border border-cacao bg-beige-doux/20 px-2 py-1.5 font-body text-sm text-cacao outline-none focus:border-cacao/60"
              />
            </label>
            <label class="grid w-[90px] shrink-0 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cacao/45">Prix (€)</span>
              <input
                v-model.number="newVariant.price"
                type="number"
                min="0"
                step="0.01"
                class="w-full border border-cacao bg-beige-doux/20 px-2 py-1.5 font-body text-sm text-cacao outline-none focus:border-cacao/60"
              />
            </label>
            <label class="grid w-[90px] shrink-0 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cacao/45">Stock</span>
              <input
                v-model.number="newVariant.stock"
                type="number"
                min="0"
                class="w-full border border-cacao bg-beige-doux/20 px-2 py-1.5 font-body text-sm text-cacao outline-none focus:border-cacao/60"
              />
            </label>
            <button
              type="button"
              class="shrink-0 border border-cacao px-3 py-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-cacao"
              @click="addVariant"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      <aside class="space-y-6 border-t border-cacao pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <!-- Image -->
        <div class="space-y-3">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45">Image du produit</div>
          <div
            v-if="draft.imageUrl"
            class="relative aspect-square w-full max-w-[200px] border border-cacao bg-beige-doux/30"
          >
            <img :src="draft.imageUrl" alt="" class="h-full w-full object-cover" />
          </div>
          <div
            v-else
            class="flex aspect-square w-full max-w-[200px] items-center justify-center border border-dashed border-cacao bg-beige-doux/10"
          >
            <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cacao/35">Aucune image</span>
          </div>
          <div class="flex items-center gap-3">
            <label class="cursor-pointer border border-cacao px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-cacao transition-colors hover:border-cacao">
              <span>{{ isUploading ? "Envoi…" : draft.imageUrl ? "Changer" : "Choisir" }}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="sr-only"
                :disabled="isUploading"
                @change="onImageChange"
              />
            </label>
            <button
              v-if="draft.imageUrl"
              type="button"
              class="font-body text-[10px] uppercase tracking-[0.14em] text-cacao/40 hover:text-cacao"
              @click="draft.imageUrl = ''"
            >
              Retirer
            </button>
          </div>
        </div>

        <div class="border border-cacao bg-beige-doux/50 p-5">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45">Aperçu prix</div>
          <div class="mt-3 font-display text-4xl text-dore">
            {{ draft.price.toFixed(2).replace(".", ",") }} €
          </div>
          <div class="mt-2 font-body text-sm text-cacao/60">
            {{ categories.find((c) => c.id === draft.categoryId)?.name ?? "—" }}
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="border border-cacao px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cacao"
            @click="router.push({ name: 'admin-produits' })"
          >
            Annuler
          </button>
          <button
            type="button"
            class="border border-cacao px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cacao"
            @click="archive"
          >
            Désactiver
          </button>
          <button
            type="button"
            class="border border-red-700/50 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-red-700"
            @click="deleteProduct"
          >
            Supprimer
          </button>
          <button
            type="button"
            :disabled="isLoading || isUploading"
            class="border border-cacao bg-cacao px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivoire disabled:opacity-50"
            @click="save"
          >
            {{ isLoading ? "Enregistrement…" : "Enregistrer" }}
          </button>
        </div>
      </aside>
    </div>

    <div v-else class="border border-cacao bg-ivoire px-8 py-12 text-center">
      <div class="font-display text-3xl text-cacao">Produit introuvable.</div>
      <button
        type="button"
        class="mt-6 border border-cacao bg-cacao px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivoire"
        @click="router.push({ name: 'admin-produits' })"
      >
        Retour au catalogue
      </button>
    </div>
  </div>
</template>
