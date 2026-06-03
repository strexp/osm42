<script lang="ts">
import { useControl } from '@indoorequal/vue-maplibre-gl'
import { GlobeControl } from 'maplibre-gl';

export default {
  setup() {
    return useControl(
      () => {
        return new GlobeControl()
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
