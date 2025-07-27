<script lang="ts" setup>
import { useLocationsStore } from '@/stores/locations';

const props = defineProps<{
  isOpen: boolean;
  mobileMode?: boolean;
}>();

const emit = defineEmits<{
  itemClick: [];
}>();

const locationsStore = useLocationsStore();
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

      <SidebarButton
        v-for="item in locationsStore.sidebarItems"
        v-else
        :key="item.id"
        :href="item.href"
        :icon="item.icon"
        :label="item.label"
        :only-icon="!props.isOpen && !props.mobileMode"
        @click="emit('itemClick')"
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
