import { defineStore } from 'pinia'
import AuthApi from '@/services/api/AuthApi'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    tokenExpiry: null,
  }),

  getters: {
    currentUser: (state) => state.user,
    userId: (state) => state.user?.id || 0,
    username: (state) => state.user?.username || '',
    isLoggedIn: (state) => state.isAuthenticated,
    authToken: (state) => state.token,
    authError: (state) => state.error,
    isAuthLoading: (state) => state.isLoading,

    //Check if token is expired or expiring soon
    isTokenValid: (state) => {
      if (!state.token || !state.tokenExpiry) return false
      return new Date() < new Date(state.tokenExpiry)
    },

    isTokenExpiringSoon: (state) => {
      if (!state.tokenExpiry) return false
      const now = new Date()
      const expiry = new Date(state.tokenExpiry)
      const timeUntilExpiry = expiry - now
      // Return true if token expires in less than 5 minutes
      return timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0
    },
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null

      try {
        console.log('Starting login process...')
        const response = await AuthApi.Login(credentials)
        console.log('Login API response:', response)

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Login failed')
        }

        const { token, user_name, expire_time } = response.data
        console.log('Token received:', token ? 'Yes' : 'No')

        // Calculate expiry time
        const expiryDate = new Date(Date.now() + expire_time * 1000)

        // Extract additional user info from JWT token
        const userInfoFromToken = AuthApi.getUserFromToken(token)
        console.log('User info from token:', userInfoFromToken)

        // Create user object
        const user = {
          id: userInfoFromToken?.id || null,
          username: user_name,
          group: userInfoFromToken?.group || 'Admin',
          role: 'admin', // Since only admins use the system
          isActive: true,
        }

        // Store auth data in state
        this.token = token
        this.user = user
        this.isAuthenticated = true
        this.tokenExpiry = expiryDate.toISOString()

        console.log('Auth state updated:', {
          isAuthenticated: this.isAuthenticated,
          user: this.user,
          token: this.token ? 'Present' : 'Missing',
        })

        // Persist to localStorage
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify(user))
        localStorage.setItem('token_expiry', this.tokenExpiry)

        // Update API service with token
        this.updateApiToken(token)

        // Redirect to admin dashboard
        console.log('Attempting redirect to /admin/dashboard...')
        await router.push('/admin/dashboard')
        console.log('Redirect completed')

        return { success: true, user }
      } catch (error) {
        this.error = error.message || 'Login failed'
        this.clearAuth()

        return {
          success: false,
          error: this.error,
          status: error.status,
        }
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      this.isLoading = true

      try {
        // Call backend logout if available
        if (AuthApi.logout) {
          await AuthApi.logout()
        }
      } catch (error) {
        console.warn('Logout API call failed:', error.message)
        // Continue with local logout even if API fails
      } finally {
        this.clearAuth()
        this.isLoading = false
        await router.push('/login')
      }
    },

    clearAuth() {
      // Clear store state
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
      this.tokenExpiry = null

      // Clear localStorage
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      localStorage.removeItem('token_expiry')

      // Clear API token
      this.updateApiToken(null)
    },

    // Initialize auth from localStorage on app start
    initializeAuth() {
      const token = localStorage.getItem('admin_token')
      const userStr = localStorage.getItem('admin_user')
      const tokenExpiry = localStorage.getItem('token_expiry')

      if (token && userStr && tokenExpiry) {
        try {
          // Check if token is still valid
          if (new Date() < new Date(tokenExpiry)) {
            this.token = token
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true
            this.tokenExpiry = tokenExpiry

            // Validate token structure
            const userFromToken = AuthApi.getUserFromToken(token)
            if (!userFromToken) {
              this.clearAuth()
              return
            }

            // Update API service with stored token
            this.updateApiToken(token)
          } else {
            // Token expired, clear auth
            this.clearAuth()
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          // If parsing fails, clear invalid data
          this.clearAuth()
        }
      }
    },

    // Update API service with auth token
    updateApiToken(token) {
      // Update BaseAxios with token
      import('@/services/api/BaseAxios')
        .then(({ default: BaseAxios }) => {
          if (BaseAxios.updateAuthToken) {
            BaseAxios.updateAuthToken(token)
          }
        })
        .catch((error) => {
          console.warn('Failed to update API token:', error)
        })
    },

    // Check token expiry and handle accordingly
    checkTokenExpiry() {
      if (!this.isTokenValid) {
        this.clearAuth()
        router.push('/login')
        return false
      }
      return true
    },

    // Refresh user data from token
    refreshUserData() {
      if (this.token) {
        const userInfo = AuthApi.getUserFromToken(this.token)
        if (userInfo && this.user) {
          this.user = {
            ...this.user,
            id: userInfo.id,
            group: userInfo.group,
          }
          localStorage.setItem('admin_user', JSON.stringify(this.user))
        }
      }
    },

    // Clear error state
    clearError() {
      this.error = null
    },

    // Force logout (for expired tokens, etc.)
    forceLogout(reason = 'Session expired') {
      this.error = reason
      this.clearAuth()
      router.push('/login')
    },

    // filepath: d:\Vue\Survey_Admin_UI\Survey_UI\src\stores\auth.store.js
    // ...existing code...
    setAccessToken(token) {
      this.token = token
      this.isAuthenticated = true
      // Optionally, extract user info from token if needed
      localStorage.setItem('admin_token', token)
      this.updateApiToken(token)
    },
  },

  // Auto-persist important auth data
  persist: {
    key: 'survey-auth-state',
    storage: localStorage,
    paths: ['user', 'token', 'isAuthenticated', 'tokenExpiry'],
  },
})

// Export helper functions for route guards and API interceptors
export const useAuthGuard = () => {
  const authStore = useAuthStore()

  return {
    requireAuth: () => {
      if (!authStore.checkTokenExpiry()) {
        throw new Error('Authentication required')
      }
      return true
    },

    getAuthHeader: () => {
      if (authStore.isAuthenticated && authStore.token) {
        return {
          Authorization: `Bearer ${authStore.token}`,
        }
      }
      return {}
    },

    handleAuthError: (error) => {
      if (error.response?.status === 401) {
        authStore.forceLogout('Session expired. Please login again.')
      }
    },
  }
}



