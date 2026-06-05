<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  MglFullscreenControl,
  MglMap,
  MglNavigationControl,
  MglScaleControl,
  MglGeolocateControl,
  useMap,
  MglCustomControl,
} from '@indoorequal/vue-maplibre-gl'
import StyleSwitcher from './StyleSwitcher.vue'
import InspectControl from './InspectControl.vue'
import GlobeControl from './GlobeControl.vue'
import { useBackendStore } from '@/stores/backend'

const map = useMap()
const isStyleDialogOpen = ref(false)
const isLoading = ref(false)
const isPWA = ref(false)
const backendStore = useBackendStore()

onMounted(() => {
  const mq = window.matchMedia(
    '(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)',
  )
  const navi = navigator as unknown as { standalone: boolean }
  isPWA.value = mq.matches || ('standalone' in navigator && navi.standalone === true)

  mq.addEventListener('change', (e) => {
    isPWA.value = e.matches
  })
})

function onStyleSelected(url: string) {
  backendStore.backend = url
  if (map.map) {
    map.map.setStyle(url)
  }
}
</script>

<template>
  <div class="map-main">
    <MglMap
      :mapStyle="backendStore.backend"
      hash
      width="100vw"
      height="100vh"
      :attributionControl="{ customAttribution: 'OpenStreetMap@dn42', compact: true }"
      @map:dataloading="isLoading = true"
      @map:idle="isLoading = false"
      @map:error="isLoading = false"
    >
      <MglFullscreenControl v-if="!isPWA" />
      <MglNavigationControl position="top-right" />
      <GlobeControl />
      <MglCustomControl position="top-right">
        <button
          class="maplibregl-ctrl-icon"
          title="Style Settings"
          @click="isStyleDialogOpen = true"
        >
          🗺️
        </button>
      </MglCustomControl>
      <InspectControl />
      <MglCustomControl v-if="isLoading" position="bottom-right">
        <button disabled class="maplibregl-ctrl-icon">
          <span class="spinner"></span>
        </button>
      </MglCustomControl>
      <MglGeolocateControl />
      <MglScaleControl />
    </MglMap>

    <StyleSwitcher v-model="isStyleDialogOpen" @style-selected="onStyleSelected" />
  </div>
</template>

<style lang="css">
@import 'maplibre-theme/icons.default.css';
@import 'maplibre-theme/modern.css';

.map-main {
  height: 100vh;
  width: 100vw;
  background-color: 'blue';
}

.maplibregl-canvas {
  background-color: #444444;
}

.maplibregl-ctrl-icon {
  font-size: 1.2rem;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #444;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
