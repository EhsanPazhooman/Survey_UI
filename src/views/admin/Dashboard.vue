<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Welcome to Survey Manager Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ username }}</span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Surveys</h3>
          <p class="stat-number">0</p>
        </div>
        <div class="stat-card">
          <h3>Active Surveys</h3>
          <p class="stat-number">0</p>
        </div>
        <div class="stat-card">
          <h3>Responses</h3>
          <p class="stat-number">0</p>
        </div>
        <div class="stat-card">
          <h3>Users</h3>
          <p class="stat-number">0</p>
        </div>
      </div>
      
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <p>No recent activity</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const username = computed(() => authStore.username)
    
    const handleLogout = async () => {
      await authStore.logout()
      router.push('/auth/login')
    }
    
    return {
      username,
      handleLogout
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-header h1 {
  color: #1f2937;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.recent-activity {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.recent-activity h2 {
  margin: 0 0 15px 0;
  color: #1f2937;
}
</style>