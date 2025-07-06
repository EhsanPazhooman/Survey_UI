<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo Section -->
      <div class="logo-container">
        <img :src="logo" alt="Logo" class="logo" />
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <BaseInput
          v-model="loginForm.username"
          name="username"
          type="text"
          label="نام کاربری"
          placeholder="admin"
          :disabled="isLoading"
          :error="fieldErrors.username"
          required
        />

        <BaseInput
          v-model="loginForm.password"
          type="password"
          name="password"
          label="رمز عبور"
          placeholder="••••••"
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
          {{ isLoading ? 'در حال ورود...' : 'ورود به سامانه' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseToastBox from '@/components/common/BaseToastBox.vue'
import logo from '@/assets/logos/WeinnoLogo.png'

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
      authStore.error = null
    }

    const clearFieldErrors = () => {
      fieldErrors.username = ''
      fieldErrors.password = ''
    }

    const validateForm = () => {
      clearFieldErrors()
      let isValid = true

      if (!loginForm.username.trim()) {
        fieldErrors.username = 'نام کاربری الزامی است'
        isValid = false
      }

      if (!loginForm.password.trim()) {
        fieldErrors.password = 'رمز عبور الزامی است'
        isValid = false
      } else if (loginForm.password.length < 6) {
        fieldErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
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
        // Redirect is handled in the auth store
        console.log('Login successful, redirecting...')
      } else {
        errorMessage.value = result.error || 'ورود ناموفق بود'
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
      logo,
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
  background-color: #f8f9fa;
  padding: 20px;
  font-family: 'IranYekan';
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e9ecef;
  padding: 25px 60px;
  width: 100%;
  max-width: 450px;
}

/* Logo Section */
.logo-container {
  text-align: center;
  margin-bottom: 15px;
}

.logo {
  width: 200px;
  height: 120px;
  object-fit: contain;
}

/* Form Styles */
.login-form {
  width: 100%;
}

.login-form :deep(.password-wrapper) {
  position: relative;
}

.login-form :deep(.password-input) {
  padding-right: 45px;
}

.login-form :deep(.password-toggle) {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form :deep(.password-toggle:hover) {
  color: #6b7280;
}

/* Submit Button */
.login-button {
  width: 100%;
  padding: 16px 20px;
  background-color: #0e256e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'IranYekan';
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
}

.login-button:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

/* Toast positioning */
.login-form :deep(.toast-container) {
  margin-bottom: 20px;
}

/* RTL Support */
@media (prefers-direction: rtl) {
  .login-form :deep(.form-input) {
    direction: rtl;
    text-align: right;
  }

  .login-form :deep(.password-input) {
    padding-right: 16px;
    padding-left: 45px;
  }
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-card {
    padding: 30px 20px;
  }

  .logo {
    width: 70px;
    height: 70px;
  }

  .login-form :deep(.form-input) {
    padding: 12px 14px;
  }

  .login-button {
    padding: 14px 20px;
  }
}
</style>
