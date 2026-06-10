import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBackendStore = defineStore(
  'backend',
  () => {
    const backend = ref(
      import.meta.env.VITE_DEFAULT_BACKEND || 'https://map-api.gensokyo.dn42/style/osm-openmaptiles',
    )

    return { backend }
  },
  {
    persist: true,
  },
)
