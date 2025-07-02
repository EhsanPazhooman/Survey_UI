<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.store'

onMounted(() => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
})
</script>

<template>
  <router-view />
</template>
