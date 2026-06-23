<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  useAdminProducts,
  useAdminCategories,
  useAdminTaxRates,
  useImageUpload,
  useAdminProductVariants,
} from "@carre-ivoire/composables";

const router = useRouter();
const { create, isLoading } = useAdminProducts();
const { categories } = useAdminCategories();
const { taxRates } = useAdminTaxRates();
const { upload, isUploading } = useImageUpload();
const { create: createVariant } = useAdminProductVariants();

interface VariantDraft {
  label: string;
  weightGrams: number;
  price: number;
  stock: number;
}

const variantDrafts = ref<VariantDraft[]>([]);
const newVariant = ref<VariantDraft>({ label: "", weightGrams: 0, price: 0, stock: 0 });

function addVariantDraft() {
  if (!newVariant.value.label.trim() || newVariant.value.price <= 0) return;
  variantDrafts.value.push({ ...newVariant.value });
  newVariant.value = { label: "", weightGrams: 0, price: 0, stock: 0 };
}

function removeVariantDraft(index: number) {
  variantDrafts.value.splice(index, 1);
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

function autoSlug() {
  if (!draft.value.slug) {
    draft.value.slug = draft.value.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

async function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await upload(file);
  if (url) draft.value.imageUrl = url;
}

async function save() {
  if (!draft.value.name.trim() || !draft.value.slug.trim() || !draft.value.categoryId) return;
  const product = await create({
    name: draft.value.name,
    slug: draft.value.slug,
    categoryId: draft.value.categoryId,
    price: Math.round(draft.value.price * 100),
    stockStatus: draft.value.stockStatus,
    taxRateId: draft.value.taxRateId ?? undefined,
    shortDescription: draft.value.shortDescription || undefined,
    description: draft.value.description || undefined,
    isActive: draft.value.isActive,
    ingredients: draft.value.ingredients || undefined,
    allergens: draft.value.allergens || undefined,
    weightGrams: draft.value.weightGrams || undefined,
    imageUrl: draft.value.imageUrl || undefined,
  });

  if (product) {
    for (const variant of variantDrafts.value) {
      await createVariant(product.id, {
        label: variant.label,
        weightGrams: variant.weightGrams || undefined,
        price: Math.round(variant.price * 100),
        stock: variant.stock,
      });
    }
  }

  router.push({ name: "admin-produits" });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
          02 — Produits
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
          Nouveau produit,
          <span class="italic text-cocoa/55">au catalogue.</span>
        </h2>
      </div>
    </section>

    <form
      class="grid gap-8 border border-cocoa bg-ivory p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
      @submit.prevent="save"
    >
      <div class="grid gap-6">
        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Nom du produit</span>
          <input
            v-model="draft.name"
            type="text"
            placeholder="Ex. Noir Pur 72%"
            required
            class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            @blur="autoSlug"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Slug (URL)</span>
          <input
            v-model="draft.slug"
            type="text"
            placeholder="noir-pur-72"
            required
            class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
          />
        </label>

        <div class="grid gap-6 lg:grid-cols-2">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Catégorie</span>
            <select
              v-model.number="draft.categoryId"
              required
              class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            >
              <option value="0" disabled>Choisir…</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Statut</span>
            <select
              v-model="draft.isActive"
              class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            >
              <option :value="true">Actif</option>
              <option :value="false">Inactif</option>
            </select>
          </label>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Prix (€)</span>
            <input
              v-model.number="draft.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Disponibilité</span>
            <select
              v-model="draft.stockStatus"
              class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            >
              <option value="in_stock">En stock</option>
              <option value="out_of_stock">Rupture de stock</option>
            </select>
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Poids (g)</span>
            <input
              v-model.number="draft.weightGrams"
              type="number"
              min="0"
              step="1"
              class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">TVA applicable</span>
          <select
            v-model.number="draft.taxRateId"
            class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
          >
            <option :value="null">Aucune TVA</option>
            <option v-for="tva in taxRates" :key="tva.id" :value="tva.id">
              {{ tva.label }} — {{ tva.rate }} %
            </option>
          </select>
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Accroche courte</span>
          <input
            v-model="draft.shortDescription"
            type="text"
            placeholder="Ganache grand cru, éclat de sel…"
            class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Description</span>
          <textarea
            v-model="draft.description"
            rows="4"
            class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base leading-7 text-cocoa outline-none focus:border-cocoa/60"
            placeholder="Quelques mots sensoriels…"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Ingrédients</span>
          <input
            v-model="draft.ingredients"
            type="text"
            placeholder="Pâte de cacao, sucre, beurre de cacao…"
            class="border border-cocoa bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
          />
        </label>

        <div class="grid gap-4 border-t border-cocoa pt-6">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Variantes (poids / prix)</span>
          <p class="font-body text-[12px] italic text-cocoa/45">
            Facultatif — laissez vide pour un produit à prix unique. Les variantes seront créées avec le produit.
          </p>

          <div v-if="variantDrafts.length" class="grid gap-3">
            <div
              v-for="(variant, index) in variantDrafts"
              :key="index"
              class="flex flex-wrap items-center gap-3 border border-cocoa bg-beige/20 p-3"
            >
              <span class="min-w-0 flex-1 truncate font-body text-sm text-cocoa">{{ variant.label }}</span>
              <span class="shrink-0 font-body text-sm text-cocoa/70">{{ variant.weightGrams || "—" }} g</span>
              <span class="shrink-0 font-body text-sm text-cocoa/70">{{ variant.price.toFixed(2).replace(".", ",") }} €</span>
              <span class="shrink-0 font-body text-sm text-cocoa/70">Stock {{ variant.stock }}</span>
              <button
                type="button"
                class="shrink-0 font-body text-[11px] uppercase tracking-[0.14em] text-red-700"
                @click="removeVariantDraft(index)"
              >
                Supprimer
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-end gap-3">
            <label class="grid min-w-[140px] flex-1 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/45">Libellé</span>
              <input
                v-model="newVariant.label"
                type="text"
                placeholder="Ex. 250g"
                class="w-full border border-cocoa bg-beige/20 px-2 py-1.5 font-body text-sm text-cocoa outline-none focus:border-cocoa/60"
              />
            </label>
            <label class="grid w-[90px] shrink-0 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/45">Poids (g)</span>
              <input
                v-model.number="newVariant.weightGrams"
                type="number"
                min="0"
                class="w-full border border-cocoa bg-beige/20 px-2 py-1.5 font-body text-sm text-cocoa outline-none focus:border-cocoa/60"
              />
            </label>
            <label class="grid w-[90px] shrink-0 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/45">Prix (€)</span>
              <input
                v-model.number="newVariant.price"
                type="number"
                min="0"
                step="0.01"
                class="w-full border border-cocoa bg-beige/20 px-2 py-1.5 font-body text-sm text-cocoa outline-none focus:border-cocoa/60"
              />
            </label>
            <label class="grid w-[90px] shrink-0 gap-1.5">
              <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/45">Stock</span>
              <input
                v-model.number="newVariant.stock"
                type="number"
                min="0"
                class="w-full border border-cocoa bg-beige/20 px-2 py-1.5 font-body text-sm text-cocoa outline-none focus:border-cocoa/60"
              />
            </label>
            <button
              type="button"
              class="shrink-0 border border-cocoa px-3 py-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-cocoa"
              @click="addVariantDraft"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      <aside class="space-y-6 border-t border-cocoa pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <!-- Image -->
        <div class="space-y-3">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Image du produit</div>
          <div
            v-if="draft.imageUrl"
            class="relative aspect-square w-full max-w-[200px] border border-cocoa bg-beige/30"
          >
            <img :src="draft.imageUrl" alt="" class="h-full w-full object-cover" />
          </div>
          <div
            v-else
            class="flex aspect-square w-full max-w-[200px] items-center justify-center border border-dashed border-cocoa bg-beige/10"
          >
            <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/35">Aucune image</span>
          </div>
          <div class="flex items-center gap-3">
            <label class="cursor-pointer border border-cocoa px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-cocoa transition-colors hover:border-cocoa">
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
              class="font-body text-[10px] uppercase tracking-[0.14em] text-cocoa/40 hover:text-cocoa"
              @click="draft.imageUrl = ''"
            >
              Retirer
            </button>
          </div>
        </div>

        <div class="border border-cocoa bg-beige/50 p-5">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Aperçu prix</div>
          <div class="mt-3 font-display text-4xl text-gold">
            {{ draft.price.toFixed(2).replace(".", ",") }} €
          </div>
          <div class="mt-2 font-body text-sm text-cocoa/60">
            {{ draft.categoryId ? categories.find((c) => c.id === draft.categoryId)?.name ?? "—" : "—" }}
          </div>
        </div>

        <div class="border border-cocoa bg-ivory p-5">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Slug généré</div>
          <div class="mt-3 font-display text-2xl text-cocoa">
            {{ draft.slug || "—" }}
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="border border-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa"
            @click="router.push({ name: 'admin-produits' })"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="isLoading || isUploading"
            class="border border-cocoa bg-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivory disabled:opacity-50"
          >
            {{ isLoading ? "Enregistrement…" : "Enregistrer" }}
          </button>
        </div>
      </aside>
    </form>
  </div>
</template>
