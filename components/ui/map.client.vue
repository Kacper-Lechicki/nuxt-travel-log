<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useBreakpoints } from '~/composables/use-breakpoints';
import { useMapTooltips } from '~/composables/use-map-tooltips';
import { CENTER_USA } from '~/lib/constants';

const mapStore = useMapStore();
const colorMode = useColorMode();

const { isDesktop } = useBreakpoints();
const { tooltipStates, handleMouseEnter, handleMouseLeave } = useMapTooltips();

const zoom = 2;

const mapRef = ref();
const locationModals = ref<{ [key: number]: HTMLDialogElement }>({});

const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty',
);

function fitMapToBounds() {
  const map = mapRef.value?.map;
  const bounds = mapStore.mapBounds;

  if (!map || !bounds) {
    console.warn('Map or bounds not available');
    return;
  }

  try {
    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 10,
      duration: 1000,
    });
  }
  catch (error) {
    console.error('Error fitting bounds:', error);
  }
}

function openModal(pointId: number) {
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

watch(
  () => mapStore.mapBounds,
  async (newBounds) => {
    if (!newBounds)
      return;

    await nextTick();

    const map = mapRef.value?.map;

    if (map) {
      map.fitBounds(newBounds, {
        padding: 50,
        maxZoom: 10,
      });
    }
  },
  { immediate: true },
);

watch(
  () => mapStore.activePoint,
  async (activePoint) => {
    const map = mapRef.value?.map;

    if (map) {
      if (!activePoint)
        return;

      await nextTick();

      map.flyTo({
        center: [activePoint.long, activePoint.lat],
        speed: 0.8,
      });
    }
  },
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

    <MglCustomControl position="top-left">
      <button
        :disabled="!mapStore.mapPoints.length"
        class="text-black"
        @click="fitMapToBounds"
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
