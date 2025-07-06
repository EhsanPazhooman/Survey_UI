<template>
  <aside ref="sidebarHeight" class="sidebar_content d-flex" :style="{ minHeight: adjustedHeight + 'px' }">
    <ul>
      <li :class="{ 'active-menu': router.path === '/admin/dashboard' }">
        <RouterLink to="/admin/dashboard">داشبورد</RouterLink>
      </li>
      <li
        :class="{
          'active-menu':
            checkRoutePath('/admin/survey') || checkRoutePath('/admin/template'),
        }"
      >
        <RouterLink to="/admin/survey">نظرسنجی </RouterLink>
      </li>
      <li :class="{ 'active-menu': checkRoutePath('/admin/targetAudience') }">
        <RouterLink to="/admin/targetAudience">جامعه هدف</RouterLink>
      </li>
      <li :class="{ 'active-menu': checkRoutePath('/admin/reports') }">
        <RouterLink to="/admin/reports">گزارشات</RouterLink>
      </li>
      <li :class="{ 'active-menu': checkRoutePath('/admin/settings') }">
        <RouterLink to="/admin/settings">تنظیمات</RouterLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const router = useRoute();
const sidebarHeight = ref(null);
const adjustedHeight = ref(null);

onMounted(() => {
  if (sidebarHeight.value) {
    const elementHeight = sidebarHeight.value.offsetHeight;
    const viewportHeight = window.innerHeight;
    adjustedHeight.value = elementHeight < viewportHeight ? viewportHeight : elementHeight;
  }
});

const checkRoutePath = (name) => {
  return router.path.startsWith(name);
};
</script>

<style scoped>
.sidebar_content {
  width: 350px;
  min-width: 250px;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
  padding: 0;
  margin: 0;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar_content ul {
  list-style: none;
  margin: 0;
  padding: 20px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar_content li {
  width: 100%;
  padding: 0 20px;
}

.sidebar_content li a {
  display: block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: 'IranYekan', Tahoma, sans-serif;
  text-align: right;
  direction: rtl;
}

.sidebar_content li a:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-2px);
}

/* Active menu styling - Orange/Yellow background */
.active-menu a {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%) !important;
  color: #030697 !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.active-menu a:hover {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%) !important;
  transform: translateX(-3px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar_content {
    width: 200px;
    min-width: 200px;
  }
  
  .sidebar_content li {
    padding: 0 15px;
  }
  
  .sidebar_content li a {
    padding: 12px 15px;
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .sidebar_content {
    width: 180px;
    min-width: 180px;
  }
  
  .sidebar_content li a {
    font-size: 13px;
  }
}
</style>