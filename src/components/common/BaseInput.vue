<template>
  <div class="input-group">
    <label :for="name" class="input-label">{{ label }}</label>
    <div class="input-wrapper" :class="{ 'password-wrapper': type === 'password' }">
      <input
        :id="name"
        :type="actualInputType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input-field"
        :class="{ 'input-error': displayError, 'password-input': type === 'password' }"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="password-toggle"
        :disabled="disabled"
      >
        <i class="bi" :class="passwordVisible ? 'bi-eye' : 'bi-eye-slash'"></i>
      </button>
    </div>
    <span v-if="displayError" class="error-message">
      {{ displayError }}
    </span>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const passwordVisible = ref(false)
    
    const displayError = computed(() => props.error)
    
    const actualInputType = computed(() => {
      if (props.type === 'password') {
        return passwordVisible.value ? 'text' : 'password'
      }
      return props.type
    })
    
    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value
    }

    return { 
      displayError, 
      actualInputType, 
      passwordVisible, 
      togglePasswordVisibility 
    }
  },
}
</script>

<style scoped>
.input-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  text-align: right;
  direction: rtl;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.input-error {
  border-color: #f87171;
}

.input-error:focus {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

.error-message {
  display: block;
  margin-top: 0.25rem;
  color: #f87171;
  font-size: 0.75rem;
}

/* Password toggle specific styles */
.password-wrapper {
  position: relative;
}

.password-input {
  padding-right: 45px;
}

.password-toggle {
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
  font-size: 16px;
}

.password-toggle:hover:not(:disabled) {
  color: #6b7280;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* RTL Support */
@media (prefers-direction: rtl) {
  .input-field {
    direction: rtl;
    text-align: right;
  }

  .password-input {
    padding-right: 0.75rem;
    padding-left: 45px;
  }

  .password-toggle {
    right: auto;
    left: 12px;
  }
}
</style>