<template>
  <div class="admin-layout">
    <!-- Admin Header -->
    <AdminHeaderLayout />
    
    <div class="content-wrapper">
      <!-- Main Content Area -->
      <main class="main_content">
        <router-view />
      </main>
      
      <!-- Admin Sidebar - Moved to right -->
      <AdminSidebarLayout />
    </div>
  </div>
</template>

<script setup>
import AdminHeaderLayout from '@/components/layout/AdminHeaderLayout.vue'
import AdminSidebarLayout from '@/components/layout/AdminSidebarLayout.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  direction: rtl; /* RTL direction for proper right-to-left layout */
}

.content-wrapper {
  display: flex;
  flex: 1;
  flex-direction: row-reverse;
}

.main_content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Ensure sidebar has proper width and styling */
.content-wrapper :deep(.sidebar_content) {
  min-width: 250px;
  border-left: 1px solid #dee2e6; /* Border on left instead of right */
}

/* Ensure header spans full width */
.admin-layout :deep(.admin_header) {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>