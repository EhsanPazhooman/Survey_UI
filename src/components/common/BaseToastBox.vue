<template>
  <div
    v-if="message"
    :class="['toast-box', type === 'error' ? 'toast-error' : 'toast-success']"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="toast-content">
      <div class="toast-message">{{ message }}</div>
      <button type="button" class="toast-close" aria-label="Close" @click="closeToast">×</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'success', // or 'error'
    },
  },
  methods: {
    closeToast() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.toast-box {
  position: relative;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  animation: slideIn 0.3s ease-out;
}

.toast-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.toast-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.toast-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toast-message {
  flex: 1;
  margin-right: 0.5rem;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.15s ease-in-out;
}

.toast-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
