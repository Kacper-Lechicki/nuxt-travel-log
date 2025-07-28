<script lang="ts" setup>
import type { MenuItem } from '~/stores/sidebar';

type Props = {
  isOpen: boolean;
  topItems: MenuItem[];
  bottomItems: MenuItem[];
  showToggle?: boolean;
  mobileMode?: boolean;
};

type Emits = {
  toggle: [];
  itemClick: [];
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

function handleItemClick() {
  emits('itemClick');
}
</script>

<template>
  <div v-if="props.showToggle" class="px-3 py-6 flex-shrink-0">
    <button
      :class="{
        'mx-auto': !props.isOpen,
        'ml-auto': props.isOpen,
      }"
      class="rounded hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center flex-shrink-0"
      @click="emits('toggle')"
    >
      <Icon
        :name="props.isOpen ? 'tabler:chevron-left' : 'tabler:chevron-right'"
        size="28"
      />
    </button>
  </div>

  <div
    :class="{
      'border-t border-r border-gray-700/30': props.mobileMode,
    }"
    class="flex-1 px-3 py-6 flex flex-col gap-3 overflow-hidden"
  >
    <div class="flex flex-col gap-3 flex-shrink-0">
      <AppSidebarButton
        v-for="item in props.topItems"
        :key="item.href"
        :href="item.href"
        :icon="item.icon"
        :name="item.name"
        :only-icon="!props.isOpen && !props.mobileMode"
        @click="handleItemClick"
      />

      <div class="divider m-0" />
    </div>

    <AppSidebarLocationsList
      :is-open="props.isOpen"
      :mobile-mode="props.mobileMode"
      @item-click="handleItemClick"
    />

    <div class="flex flex-col gap-3 flex-shrink-0">
      <div class="divider m-0" />

      <AppSidebarButton
        v-for="item in props.bottomItems"
        :key="item.href"
        :href="item.href"
        :icon="item.icon"
        :name="item.name"
        :only-icon="!props.isOpen && !props.mobileMode"
        @click="handleItemClick"
      />
    </div>
  </div>
</template>
