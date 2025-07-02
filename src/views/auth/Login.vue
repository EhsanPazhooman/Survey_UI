<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Login to Survey Manager</h2>
        <p>Please enter your credentials to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <BaseInput
          name="username"
          type="text"
          label="Username"
          placeholder="Enter your username"
          :disabled="isLoading"
          :error="fieldErrors.username"
          required
        />

        <BaseInput
          v-model="loginForm.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :disabled="isLoading"
          :error="fieldErrors.password"
          required
        />

        <BaseToastBox
          v-if="errorMessage"
          type="error"
          :message="errorMessage"
          @close="clearError"
        />

        <button type="submit" :disabled="isLoading || !isFormValid" class="login-button">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store' // import the Pinia auth store
import BaseInput from '@/components/common/BaseInput.vue'
import BaseToastBox from '@/components/common/BaseToastBox.vue'

export default {
  name: 'LoginComponent',
  components: {
    BaseInput,
    BaseToastBox,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Form data
    const loginForm = reactive({
      username: '',
      password: '',
    })

    // Local error message and field errors
    const errorMessage = ref('')
    const fieldErrors = reactive({
      username: '',
      password: '',
    })

    // Use loading state from store
    const isLoading = computed(() => authStore.isLoading)

    // Computed form validity
    const isFormValid = computed(() => {
      return (
        loginForm.username.trim() !== '' &&
        loginForm.password.trim() !== '' &&
        !Object.values(fieldErrors).some((error) => error !== '')
      )
    })

    // Clear errors
    const clearError = () => {
      errorMessage.value = ''
      authStore.error = null // clear store error too
    }

    const clearFieldErrors = () => {
      fieldErrors.username = ''
      fieldErrors.password = ''
    }

    const validateForm = () => {
      clearFieldErrors()
      let isValid = true

      if (!loginForm.username.trim()) {
        fieldErrors.username = 'Username is required'
        isValid = false
      }

      if (!loginForm.password.trim()) {
        fieldErrors.password = 'Password is required'
        isValid = false
      } else if (loginForm.password.length < 6) {
        fieldErrors.password = 'Password must be at least 6 characters'
        isValid = false
      }

      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      clearError()

      const result = await authStore.login({
        username: loginForm.username.trim(),
        password: loginForm.password,
      })

      if (result.success) {
        // Optionally show a toast here if you keep useToast composable
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      } else {
        // Show error from store or fallback
        errorMessage.value = result.error || 'Login failed'
      }
    }

    // Watch store error to display in component
    watch(
      () => authStore.error,
      (newError) => {
        if (newError) errorMessage.value = newError
      },
    )

    return {
      loginForm,
      isLoading,
      errorMessage,
      fieldErrors,
      isFormValid,
      handleLogin,
      clearError,
    }
  },
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;
}

.login-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.login-form {
  padding: 30px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive design */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-header {
    padding: 20px;
  }

  .login-form {
    padding: 20px;
  }
}
</style>
