<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'style-selected'])

const availableSources = ref(
  [
    'https://map-api.gensokyo.dn42',
    'https://osm.cowgl.dn42',
    'https://map-raster-api.gensokyo.dn42'
  ]
)
const selectedSource = ref('https://map-api.gensokyo.dn42')
const availableStyles = ref<string[]>([])
const selectedStyle = ref('osm-bright')
const loading = ref(false)
const error = ref('')

async function fetchCatalog() {
  if (!selectedSource.value) return
  loading.value = true
  error.value = ''
  try {
    const baseUrl = selectedSource.value.replace(/\/$/, '')
    const res = await fetch(`${baseUrl}/catalog`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.styles && typeof data.styles === 'object') {
      availableStyles.value = Object.keys(data.styles)
      if (
        !availableStyles.value.includes(selectedStyle.value) &&
        availableStyles.value.length > 0
      ) {
        if (availableStyles.value[0]) selectedStyle.value = availableStyles.value[0]
      }
    } else {
      throw new Error('No styles found in catalog')
    }
  } catch (err) {
    console.log(err)
    error.value = 'Failed to fetch catalog'
    availableStyles.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val && availableStyles.value.length === 0) {
      fetchCatalog()
    }
  },
)

function applyStyle() {
  const baseUrl = selectedSource.value.replace(/\/$/, '')
  const url = `${baseUrl}/style/${selectedStyle.value}`
  emit('style-selected', url)
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <div class="form-group">
        <label>Data Source URL</label>
        <div class="input-row">
          <select v-model="selectedSource">
            <option v-for="s in availableSources" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
          <datalist id="datasources">
            <option value="https://map-api.gensokyo.dn42"></option>
          </datalist>
          <button @click="fetchCatalog" :disabled="loading">
            {{ loading ? 'Loading...' : 'Fetch' }}
          </button>
        </div>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <div class="form-group" v-if="availableStyles.length > 0">
        <label>Select Style</label>
        <select v-model="selectedStyle">
          <option v-for="s in availableStyles" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>

      <div class="dialog-actions">
        <button @click="close" class="btn-cancel">Cancel</button>
        <button
          @click="applyStyle"
          :disabled="!availableStyles.includes(selectedStyle)"
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
