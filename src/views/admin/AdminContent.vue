<template>
  <div class="admin-content">
    <!-- Page Title -->
    <div class="page-header">
      <h1>داشبورد مدیریت</h1>
      <p>مدیریت قالب‌ها و نظرسنجی‌ها</p>
    </div>

    <!-- Templates Section -->
    <section class="templates-section">
      <div class="section-header">
        <h2>قالب‌ها</h2>
        <button class="btn-primary">افزودن قالب جدید</button>
      </div>
      
      <div class="content-grid">
        <!-- Placeholder for template cards -->
        <div class="placeholder-card">
          <h3>قالب نمونه ۱</h3>
          <p>این یک قالب نمونه است</p>
          <span class="participant-count">۱۵ شرکت‌کننده</span>
        </div>
        
        <div class="placeholder-card">
          <h3>قالب نمونه ۲</h3>
          <p>این یک قالب نمونه است</p>
          <span class="participant-count">۱۲ شرکت‌کننده</span>
        </div>
        
        <div class="placeholder-card">
          <h3>قالب نمونه ۳</h3>
          <p>این یک قالب نمونه است</p>
          <span class="participant-count">۸ شرکت‌کننده</span>
        </div>
      </div>
    </section>

    <!-- Add Survey Without Template Section -->
    <section class="add-survey-section">
      <div class="section-header">
        <h2>نظرسنجی‌ها</h2>
      </div>
      
      <div class="add-survey-card">
        <h3>افزودن نظرسنجی بدون قالب</h3>
        <p>ایجاد نظرسنجی جدید بدون استفاده از قالب آماده</p>
        <button class="btn-secondary">شروع کنید</button>
      </div>
    </section>

    <!-- Surveys Section -->
    <section class="surveys-section">
      <div class="content-grid">
        <!-- Placeholder for survey cards -->
        <div class="placeholder-card">
          <h3>نظرسنجی نمونه ۱</h3>
          <p>نظرسنجی رضایت کارکنان</p>
          <span class="participant-count">۲۳ شرکت‌کننده</span>
        </div>
        
        <div class="placeholder-card">
          <h3>نظرسنجی نمونه ۲</h3>
          <p>بررسی کیفیت خدمات</p>
          <span class="participant-count">۱۸ شرکت‌کننده</span>
        </div>
        
        <div class="placeholder-card">
          <h3>نظرسنجی نمونه ۳</h3>
          <p>ارزیابی محیط کار</p>
          <span class="participant-count">۳۱ شرکت‌کننده</span>
        </div>
        
        <div class="placeholder-card">
          <h3>نظرسنجی نمونه ۴</h3>
          <p>نظرسنجی آموزش</p>
          <span class="participant-count">۹ شرکت‌کننده</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Empty for now - just for testing rendering
console.log('AdminContent component loaded successfully!')
</script>

<style scoped>
.admin-content {
  padding: 20px;
  direction: rtl;
  font-family: 'IranYekan', Tahoma, sans-serif;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #5855eb;
}

.btn-secondary {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #059669;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.placeholder-card {
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s;
}

.placeholder-card:hover {
  border-color: #6366f1;
  background: #f1f5f9;
}

.placeholder-card h3 {
  font-size: 16px;
  color: #334155;
  margin: 0 0 8px 0;
}

.placeholder-card p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.participant-count {
  background: #ddd6fe;
  color: #6d28d9;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.add-survey-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  margin-bottom: 40px;
}

.add-survey-card h3 {
  font-size: 18px;
  color: #92400e;
  margin: 0 0 8px 0;
}

.add-survey-card p {
  font-size: 14px;
  color: #a16207;
  margin: 0 0 20px 0;
}

.templates-section {
  margin-bottom: 40px;
}

.surveys-section {
  margin-bottom: 40px;
}

.add-survey-section {
  margin-bottom: 40px;
}

/* Responsive */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>