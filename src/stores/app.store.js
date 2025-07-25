// src/stores/app.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
    loading: false,
    appVersion: '0.0.1',
    appTitle: 'نظرسنجی',
    companyTitle: 'شرکت ویرا نوین نیک آمد',
    // Fix the API URL - should point to your actual backend
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7032', 
    selectedAdminMasterPage: 'feed',
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    setLoading(value) {
      this.loading = value
    },
    setSelectedAdminPage(page) {
      this.selectedAdminMasterPage = page
    },
  },
  getters: {
    isLoading: (state) => state.loading,
    isDarkMode: (state) => state.darkMode,
    apiUrl: (state) => state.apiBaseUrl,
  },
})