<script lang="ts" setup>
const sidebarStore = useSidebarStore();
</script>

<template>
  <div v-if="!sidebarStore.isSidebarOpen" class="lg:hidden bg-base-300 p-4 sticky top-[56px] z-40">
    <button
      class="rounded hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center"
      @click="sidebarStore.toggleSidebar"
    >
      <Icon name="tabler:menu-2" size="28" />
    </button>
  </div>

  <div v-else class="lg:hidden bg-base-300 p-4 sticky top-[56px] z-40">
    <button
      class="rounded hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center"
      @click="sidebarStore.toggleSidebar"
    >
      <Icon name="tabler:x" size="28" />
    </button>
  </div>
</template>
