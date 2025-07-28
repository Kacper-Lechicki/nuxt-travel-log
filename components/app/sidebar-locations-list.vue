<script lang="ts" setup>
import { useLocationsStore } from '@/stores/locations';

type Props = {
  isOpen: boolean;
  mobileMode?: boolean;
};

type Emits = {
  itemClick: [];
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const locationsStore = useLocationsStore();
const mapStore = useMapStore();
</script>

<template>
  <div
    :class="{
      'scrollbar-hidden': !props.isOpen && !props.mobileMode,
      'scrollbar-normal': props.isOpen && !props.mobileMode,
      'scrollbar-thin': props.mobileMode,
    }"
    class="flex-1 carousel carousel-vertical min-h-0"
  >
    <div :class="{ 'pr-2': props.mobileMode }" class="flex flex-col gap-3">
      <div v-if="locationsStore.isLoading" class="skeleton w-full h-6" />

      <AppSidebarButton
        v-for="item in locationsStore.sidebarItems"
        v-else
        :key="item.id"
        :accent="mapStore.activePoint?.id === item.location?.id"
        :href="item.href"
        :icon="item.icon"
        :name="item.name"
        :only-icon="!props.isOpen && !props.mobileMode"
        @click="emits('itemClick')"
        @mouseenter="mapStore.activePoint = (item.location || null)"
        @mouseleave="mapStore.activePoint = null"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
