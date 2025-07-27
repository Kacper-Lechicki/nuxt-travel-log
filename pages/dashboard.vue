<script lang="ts" setup>
const locationsStore = useLocationsStore();

onMounted(() => {
  locationsStore.fetch();
});
</script>

<template>
  <div class="flex-1 flex flex-col lg:flex-row">
    <NavbarMobile />

    <Sidebar variant="desktop" />
    <Sidebar variant="mobile" />

    <div
      class="flex flex-col gap-12 flex-1 px-6 md:px-12 pt-12 pb-24 container mx-auto min-w-0 top-[56px] overflow-y-auto"
    >
      <NuxtPage />

      <div class="rounded overflow-hidden h-[320px] md:h-[500px]">
        <UiMap />
      </div>
    </div>
  </div>
</template>
