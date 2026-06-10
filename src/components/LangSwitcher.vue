<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'lang-selected'])

const availableLangs = ref([
  { key: '', value: 'Default' },
  { key: 'native', value: 'Native' },
  { key: 'en', value: 'en' },
  { key: 'zh', value: 'zh' },
  { key: 'ja', value: 'ja' },
])
const selectedLang = ref('')

function applyLang() {
  emit('lang-selected', selectedLang.value)
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <div class="form-group" v-if="availableLangs.length > 0">
        <label>Select Language</label>
        <select v-model="selectedLang">
          <option v-for="s in availableLangs" :key="s.key" :value="s.key">
            {{ s.value }}
          </option>
        </select>
      </div>

      <div class="dialog-actions">
        <button @click="close" class="btn-cancel">Cancel</button>
        <button
          @click="applyLang"
          class="btn-apply"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.dialog-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  color: #333;
}
.form-group {
  margin-bottom: 16px;
}
.input-row {
  display: flex;
  gap: 8px;
}
.error {
  color: #d32f2f;
  font-size: 0.9em;
  margin-bottom: 16px;
  word-break: break-all;
}
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.95rem;
}
button {
  cursor: pointer;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.95rem;
}
button:hover:not(:disabled) {
  background: #e0e0e0;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-apply {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
.btn-apply:hover:not(:disabled) {
  background: #0069d9;
}
</style>
