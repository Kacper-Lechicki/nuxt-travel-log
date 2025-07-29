<script lang="ts" setup>
import type { MglEvent } from '@indoorequal/vue-maplibre-gl';
import type { LngLat } from 'maplibre-gl';

import { CENTER_USA } from '~/lib/constants';

const mapStore = useMapStore();
const colorMode = useColorMode();

const { isDesktop } = useBreakpoints();
const { t } = useI18n();

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

function forceMapResize() {
  const map = mapRef.value?.map;

  if (map) {
    requestAnimationFrame(() => {
      map.resize();
    });
  }
}

async function fitBounds(bounds: any, options = {}) {
  await nextTick();

  const map = mapRef.value?.map;

  if (!map) {
    return;
  }

  try {
    map.fitBounds(bounds, {
      padding: 100,
      maxZoom: 10,
      duration: 1000,
      ...options,
    });
  }
  catch (error) {
    console.error('Error fitting bounds:', error);
  }
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

function onMapLoad() {
  forceMapResize();

  const mapContainer = mapRef.value?.$el;

  if (mapContainer) {
    forceMapResize();
  }
}

defineExpose({
  fitBounds,
  getMap,
});
</script>

<template>
  <div class="w-full h-full inset-0">
    <MglMap
      ref="mapRef"
      :center="CENTER_USA"
      :double-click-zoom="false"
      :map-style="style"
      :render-world-copies="false"
      :zoom="zoom"
      @map:load="onMapLoad"
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
        class-name="z-50"
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
          :text="t('COMPONENTS.MAP.DRAG_TO_DESIRED_LOCATION')"
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
      <div class="modal-box flex flex-col max-h-[250px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div class="max-w-[275px]">
          <h3 class="text-lg font-bold truncate">
            {{ point.name }}
          </h3>
        </div>

        <div class="mt-3 whitespace-pre-wrap break-all overflow-y-auto">
          <p>
            {{ point.description || t('COMPONENTS.MAP.EMPTY_DESCRIPTION') }}
          </p>
        </div>
      </div>
    </dialog>
  </div>
</template>
