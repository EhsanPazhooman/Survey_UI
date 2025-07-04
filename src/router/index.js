import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginView from '@/views/auth/Login.vue'
import TokenReceiver from '@/views/auth/TokenReceiver.vue'
import { useAuthStore } from '@/stores/auth.store'
import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { pinia } from '@/main'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth routes
    {
      path: '/auth',
      component: AuthLayout,
      meta: { requiresAuth: false },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: LoginView,
        },
        {
          path: 'token-receiver',
          name: 'TokenReceiver',
          component: TokenReceiver,
        },
      ],
    },
    // Admin routes (add these)
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: AdminDashboard
        },
      ],
    },
    // Redirect root to login
    {
      path: '/',
      redirect: '/auth/login',
    },
    // Redirect login to auth/login
    {
      path: '/login',
      redirect: '/auth/login',
    },
    // Catch all route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/auth/login',
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(pinia)
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (to.path === '/auth/login' && authStore.isAuthenticated) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router