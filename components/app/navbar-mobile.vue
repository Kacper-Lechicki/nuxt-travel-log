<script lang="ts" setup>
const sidebarStore = useSidebarStore();

const { isDesktop } = useBreakpoints();
</script>

<template>
  <div v-if="!isDesktop" class="bg-base-300 p-4 sticky top-[56px] z-40">
    <button
      class="rounded hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center"
      @click="sidebarStore.toggleSidebar"
    >
      <Icon
        v-if="!sidebarStore.isSidebarOpen"
        name="tabler:menu-2"
        size="28"
      />

      <Icon
        v-else
        name="tabler:x"
        size="28"
      />
    </button>
  </div>
</template>
