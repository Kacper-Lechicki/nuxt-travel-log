<script lang="ts" setup>
const locationsStore = useLocationsStore();

onMounted(() => {
  locationsStore.fetch();
});
</script>

<template>
  <div class="flex-1 flex flex-col lg:flex-row">
    <NavbarMobile />
    <SidebarMobile />
    <SidebarDesktop />

    <div class="flex-1 px-6 py-12">
      <NuxtPage />
    </div>
  </div>
</template>
