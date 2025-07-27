<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useMapTooltips } from '~/composables/use-map-tooltips';
import { CENTER_USA } from '~/lib/constants';

const colorMode = useColorMode();
const mapStore = useMapStore();

const mapRef = ref();

const { tooltipStates, handleMouseEnter, handleMouseLeave } = useMapTooltips();

const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty',
);

const zoom = 2;

watch(
  () => mapStore.mapBounds,
  (newBounds) => {
    const map = mapRef.value?.map;

    if (map && newBounds) {
      map.fitBounds(newBounds, {
        padding: 50,
        maxZoom: 10,
      });
    }
  },
  { deep: true },
);
</script>

<template>
  <MglMap
    ref="mapRef"
    :center="CENTER_USA"
    :map-style="style"
    :zoom="zoom"
  >
    <MglNavigationControl />

    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
          class="cursor-pointer"
          @mouseenter="(e) => handleMouseEnter(point.id, e)"
          @mouseleave="() => handleMouseLeave(point.id)"
        >
          <Icon
            class="text-secondary"
            name="tabler:map-pin-filled"
            size="28"
          />
        </div>
      </template>

      <UiTooltip
        v-if="tooltipStates[point.id]"
        :show="tooltipStates[point.id].visible"
        :target-element="tooltipStates[point.id].element"
        :text="point.label"
        placement="top"
      />
    </MglMarker>
  </MglMap>
</template>
