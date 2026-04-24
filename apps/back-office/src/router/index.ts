import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { adminGuard } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin',
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/login.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/admin/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'produits',
        name: 'admin-produits',
        component: () => import('@/pages/admin/produits/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'produits/nouveau',
        name: 'admin-produits-nouveau',
        component: () => import('@/pages/admin/produits/nouveau.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'produits/:id/modifier',
        name: 'admin-produits-modifier',
        component: () => import('@/pages/admin/produits/[id]/modifier.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'commandes',
        name: 'admin-commandes',
        component: () => import('@/pages/admin/commandes/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'commandes/:id',
        name: 'admin-commandes-detail',
        component: () => import('@/pages/admin/commandes/[id].vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'stocks',
        name: 'admin-stocks',
        component: () => import('@/pages/admin/stocks/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'pages',
        name: 'admin-pages',
        component: () => import('@/pages/admin/pages/index.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(adminGuard)

export default router
