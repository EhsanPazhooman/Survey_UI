<template>
  <div>
    <h1>Token Receiver</h1>
    <p v-if="token">Token received and saved in store: {{ token }}</p>
    <p v-else>Token not found in URL!</p>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.store'

export default {
  data() {
    return {
      token: null,
    }
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      this.token = token
      // Use Pinia store instead of Vuex
      const authStore = useAuthStore()
      authStore.setAccessToken(token) // Make sure this action exists in your store
    }
  },
}
</script>
