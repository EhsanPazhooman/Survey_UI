import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginView from '@/views/auth/Login.vue'
import TokenReceiver from '@/views/auth/TokenReceiver.vue'

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
    // Redirect root to login
    {
      path: '/',
      redirect: '/auth/login',
    },
    // Catch all route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/auth/login',
    },
  ],
})

export default router
