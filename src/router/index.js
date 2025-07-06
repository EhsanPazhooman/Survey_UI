import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginView from '@/views/auth/Login.vue'
import TokenReceiver from '@/views/auth/TokenReceiver.vue'
import { useAuthStore } from '@/stores/auth.store'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout.vue'
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
    // Admin routes - Updated structure
    {
      path: '/admin',
      component: AdminLayout, // This provides header + sidebar + router-view
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: AdminDashboardLayout, // This contains AdminContentLayout
        },
        // You can add more admin pages here in the future:
        // {
        //   path: 'surveys',
        //   name: 'Surveys',
        //   component: AdminSurveysLayout,
        // },
        // {
        //   path: 'settings',
        //   name: 'Settings',
        //   component: AdminSettingsLayout,
        // },
        // {
        //   path: 'reports',
        //   name: 'Reports',
        //   component: AdminReportsLayout,
        // },
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

  console.log('Router guard - to:', to.path, 'from:', from.path)
  console.log('Auth state:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
  })

  // TEMPORARY: Bypass authentication for development
  // Remove this block when backend is ready
  if (to.path.startsWith('/admin')) {
    console.log('Bypassing auth for admin routes - development mode')
    next()
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Redirecting to login - auth required but not authenticated')
    next('/auth/login')
  } else if (to.path === '/auth/login' && authStore.isAuthenticated) {
    console.log('Redirecting to dashboard - already authenticated')
    next('/admin/dashboard')
  } else {
    console.log('Proceeding to:', to.path)
    next()
  }
})

export default router