<script lang="ts" setup>
import { useBreakpoints } from '~/composables/use-breakpoints';

const route = useRoute();
const locationsStore = useLocationsStore();

const { isDesktop } = useBreakpoints();

onMounted(() => {
  locationsStore.fetch();
});
</script>

<template>
  <div :class="{ 'flex-row': isDesktop }" class="flex-1 flex flex-col">
    <AppNavbarMobile />

    <AppSidebar />

    <div
      :class="{
        'flex-col': route.path !== '/dashboard/add',
      }"
      class="flex gap-12 flex-1 px-6 lg:px-12 py-12 container mx-auto min-w-0 top-[56px] overflow-y-auto"
    >
      <NuxtPage />
    </div>
  </div>
</template>
