<template>
  <header class="header">
    <nav class="navbar navbar-expand-lg admin_header">
      <div class="container-fluid">
        <div class="header_logo">
          <h5>نظرسنجی وینو</h5>
        </div>
        <div class="header_icon">
          <ul>
            <li title="پروفایل کاربر">
              <i class="bi bi-person"></i>
            </li>
            <li title="اعلانات">
              <i class="bi bi-bell"></i>
            </li>
            <li @click="handleLogout" title="خروج از سیستم" class="logout-btn">
              <i class="bi bi-box-arrow-left"></i>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    // Show confirmation dialog
    const confirmed = confirm('آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟')
    
    if (confirmed) {
      // Call logout from auth store
      await authStore.logout()
      
      // Redirect to login page
      router.push('/auth/login')
      
      // Optional: Show success message
      console.log('User logged out successfully')
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Even if logout API fails, clear local auth and redirect
    authStore.clearAuth()
    router.push('/auth/login')
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.admin_header {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #b173ef 100%);
  padding: 8px 0;
  border: none;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.2);
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  direction: rtl;
}

.header_logo h5 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  font-family: 'IranYekan', Tahoma, sans-serif;
}

.header_icon ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 15px;
}

.header_icon li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.header_icon li:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.header_icon i {
  color: white;
  font-size: 16px;
}

/* Special styling for logout button */
.logout-btn:hover {
  background: rgba(239, 68, 68, 0.3) !important;
  transform: translateY(-1px);
}

.logout-btn:hover i {
  color: #fef2f2 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .container-fluid {
    padding: 0 15px;
  }
  
  .header_logo h5 {
    font-size: 16px;
  }
  
  .header_icon ul {
    gap: 10px;
  }
  
  .header_icon li {
    width: 32px;
    height: 32px;
  }
}
</style>