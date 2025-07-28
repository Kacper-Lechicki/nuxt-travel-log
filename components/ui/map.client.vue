<script lang="ts" setup>
import type { MglEvent } from '@indoorequal/vue-maplibre-gl';
import type { LngLat } from 'maplibre-gl';

import { computed, ref } from 'vue';

import { useBreakpoints } from '~/composables/use-breakpoints';
import { useMapTooltips } from '~/composables/use-map-tooltips';
import { CENTER_USA } from '~/lib/constants';

const mapStore = useMapStore();
const colorMode = useColorMode();

const { isDesktop } = useBreakpoints();

const {
  tooltipStates,
  draggableTooltipState,
  handleMouseEnter,
  handleMouseLeave,
  handleDraggableMouseEnter,
  handleDraggableMouseLeave,
} = useMapTooltips();

const zoom = 2;

const mapRef = ref();
const locationModals = ref<{ [key: number]: HTMLDialogElement }>({});

const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty',
);

async function fitBounds(bounds: any, options = {}) {
  await nextTick();

  const map = mapRef.value?.map;

  if (!map) {
    console.warn('Map instance not available');
    return;
  }

  try {
    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 10,
      duration: 1000,
      ...options,
    });
  }
  catch (error) {
    console.error('Error fitting bounds:', error);
  }
}

async function flyTo(coordinates: [number, number], options = {}) {
  await nextTick();

  const map = mapRef.value?.map;

  if (!map) {
    console.warn('Map instance not available');
    return;
  }

  map.flyTo({
    center: coordinates,
    speed: 0.8,
    ...options,
  });
}

function getMap() {
  return mapRef.value?.map;
}

function openModal(pointId: number) {
  if (mapStore.addedPoint)
    return;

  const modal = locationModals.value[pointId];

  if (modal) {
    modal.showModal();
  }
}

function setModalRef(pointId: number, el: HTMLDialogElement | null) {
  if (el) {
    locationModals.value[pointId] = el;
  }
}

function onMouseEnter(point: MapPoint, event: MouseEvent) {
  handleMouseEnter(point, event);
}

function onMouseLeave(point: MapPoint) {
  handleMouseLeave(point);
}

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat;
    mapStore.addedPoint.long = location.lng;
  }
}

function onDoubleClick(mglEvent: MglEvent<'dblclick'>) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
  }
}

defineExpose({
  fitBounds,
  flyTo,
  getMap,
});
</script>

<template>
  <MglMap
    ref="mapRef"
    :center="CENTER_USA"
    :map-style="style"
    :zoom="zoom"
    @map:dblclick="onDoubleClick($event)"
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
          @click="openModal(point.id)"
          @mouseenter="(e) => onMouseEnter(point, e)"
          @mouseleave="() => onMouseLeave(point)"
        >
          <Icon
            :class="mapStore.activePoint === point ? 'text-accent' : 'text-secondary'"
            name="tabler:map-pin-filled"
            size="28"
          />
        </div>
      </template>

      <UiTooltip
        v-if="tooltipStates[point.id] && isDesktop"
        :show="tooltipStates[point.id].visible"
        :target-element="tooltipStates[point.id].element"
        :text="point.name"
        placement="top"
      />
    </MglMarker>

    <MglMarker
      v-if="mapStore.addedPoint"
      :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
      draggable
      @update:coordinates="updateAddedPoint($event)"
    >
      <template #marker>
        <div
          class="cursor-pointer"
          @mouseenter="(e) => handleDraggableMouseEnter(e)"
          @mouseleave="handleDraggableMouseLeave"
        >
          <Icon
            class="text-warning"
            name="tabler:map-pin-filled"
            size="35"
          />
        </div>
      </template>

      <UiTooltip
        v-if="draggableTooltipState.visible && isDesktop"
        :show="draggableTooltipState.visible"
        :target-element="draggableTooltipState.element"
        :text="$t('COMPONENTS.MAP.DRAG_TO_DESIRED_LOCATION')"
        placement="top"
      />
    </MglMarker>

    <MglCustomControl v-if="!mapStore.addedPoint" position="top-left">
      <button
        :disabled="!mapStore.mapPoints.length"
        class="text-black"
        @click="() => fitBounds(mapStore.mapBounds)"
      >
        <span class="h-full flex justify-center items-center">
          <Icon
            name="tabler:focus-2"
            size="21"
          />
        </span>
      </button>
    </MglCustomControl>
  </MglMap>

  <dialog
    v-for="point in mapStore.mapPoints"
    :key="`modal-${point.id}`"
    :ref="(el) => setModalRef(point.id, el as HTMLDialogElement)"
    class="modal"
  >
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ point.name }}
      </h3>

      <div v-if="point.description" class="mt-3">
        <p>{{ point.description }}</p>
      </div>
    </div>

    <form class="modal-backdrop" method="dialog">
      <button>close</button>
    </form>
  </dialog>
</template>
