<script lang="ts">
import { useControl } from '@indoorequal/vue-maplibre-gl'
import '@maplibre/maplibre-gl-inspect/dist/maplibre-gl-inspect.css'
import MaplibreInspect from '@maplibre/maplibre-gl-inspect'
import maplibregl from 'maplibre-gl'

export default {
  setup() {
    return useControl(
      () => {
        return new MaplibreInspect({
          popup: new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
          }),
        })
      },
      {
        position: 'top-right',
      },
    )
  },

  render() {
    return null
  },
}
</script>
