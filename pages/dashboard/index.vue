<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div
      :class="{ 'w-70': isSidebarOpen, 'w-17': !isSidebarOpen }"
      class="flex flex-col gap-4 bg-base-300 px-3 py-6 transition-all duration-300"
    >
      <div
        :class="{ 'mx-auto': !isSidebarOpen, 'ml-auto': isSidebarOpen }"
        class="rounded mb-4 hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px]"
        @click="toggleSidebar"
      >
        <Icon :name="isSidebarOpen ? 'tabler:chevron-left' : 'tabler:chevron-right'" size="28" />
      </div>

      <div class="flex flex-col gap-2">
        <SidebarButton
          :only-icon="!isSidebarOpen"
          href="/dashboard"
          icon="tabler:map"
          label="Locations"
        />

        <SidebarButton
          :only-icon="!isSidebarOpen"
          href="/dashboard/add"
          icon="tabler:circle-plus-filled"
          label="Add Location"
        />

        <div class="divider" />

        <SidebarButton
          :only-icon="!isSidebarOpen"
          href="/sign-out"
          icon="tabler:logout-2"
          label="Sign Out"
        />
      </div>
    </div>

    <div class="flex-1" />
  </div>
</template>
