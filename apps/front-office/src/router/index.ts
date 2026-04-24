import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/index.vue'),
      },
      {
        path: 'boutique',
        name: 'boutique',
        component: () => import('@/pages/boutique/index.vue'),
      },
      {
        path: 'boutique/:categorie',
        name: 'boutique-categorie',
        component: () => import('@/pages/boutique/[categorie].vue'),
      },
      {
        path: 'produits/:slug',
        name: 'produit',
        component: () => import('@/pages/produits/[slug].vue'),
      },
      {
        path: 'histoire',
        name: 'histoire',
        component: () => import('@/pages/histoire.vue'),
      },
      {
        path: 'engagements',
        name: 'engagements',
        component: () => import('@/pages/engagements.vue'),
      },
      {
        path: 'evenements',
        name: 'evenements',
        component: () => import('@/pages/evenements.vue'),
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/pages/contact.vue'),
      },
      {
        path: 'panier',
        name: 'panier',
        component: () => import('@/pages/panier.vue'),
      },
    ],
  },
  {
    path: '/connexion',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'connexion',
        component: () => import('@/pages/connexion.vue'),
      },
    ],
  },
  {
    path: '/compte',
    component: () => import('@/layouts/AccountLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'compte',
        component: () => import('@/pages/compte/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'informations',
        name: 'compte-informations',
        component: () => import('@/pages/compte/informations.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'commandes',
        name: 'compte-commandes',
        component: () => import('@/pages/compte/commandes/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'commandes/:id',
        name: 'compte-commande-detail',
        component: () => import('@/pages/compte/commandes/[id].vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'favoris',
        name: 'compte-favoris',
        component: () => import('@/pages/compte/favoris.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/commande',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'checkout',
        component: () => import('@/pages/commande/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'confirmation',
        name: 'checkout-confirmation',
        component: () => import('@/pages/commande/confirmation.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(authGuard)

export default router
