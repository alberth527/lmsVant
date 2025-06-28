import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/ProductList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/exchange/:id',
    name: 'ExchangeConfirm',
    component: () => import('../views/ExchangeConfirm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'ExchangeHistory',
    component: () => import('../views/ExchangeHistory.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router