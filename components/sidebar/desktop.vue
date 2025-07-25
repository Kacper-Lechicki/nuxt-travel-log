<script lang="ts" setup>
const sidebarStore = useSidebarStore();

onMounted(() => {
  sidebarStore.setSidebarValueFromLocalStorage();
});
</script>

<template>
  <aside
    :class="{ 'lg:w-80': sidebarStore.isSidebarOpen, 'lg:w-17': !sidebarStore.isSidebarOpen }"
    class="hidden lg:flex flex-col bg-base-300 transition-all duration-300 sticky top-[56px] h-[calc(100vh-56px)] z-[100]"
  >
    <div class="px-3 py-6 flex-shrink-0">
      <div
        :class="{ 'mx-auto': !sidebarStore.isSidebarOpen, 'ml-auto': sidebarStore.isSidebarOpen }"
        class="rounded mb-4 hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center flex-shrink-0"
        @click="sidebarStore.toggleSidebar"
      >
        <Icon
          v-if="sidebarStore.isSidebarOpen"
          name="tabler:chevron-left"
          size="28"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="28"
        />
      </div>
    </div>

    <div class="flex-1 px-3 relative">
      <div class="flex flex-col gap-4 pb-6">
        <SidebarButton
          :only-icon="!sidebarStore.isSidebarOpen"
          href="/dashboard"
          icon="tabler:map"
          label="Locations"
        />

        <SidebarButton
          :only-icon="!sidebarStore.isSidebarOpen"
          href="/dashboard/add"
          icon="tabler:circle-plus-filled"
          label="Add Location"
        />

        <div class="divider" />

        <SidebarButton
          :only-icon="!sidebarStore.isSidebarOpen"
          href="/sign-out"
          icon="tabler:logout-2"
          label="Sign Out"
        />
      </div>
    </div>
  </aside>
</template>
