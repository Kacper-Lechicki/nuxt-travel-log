<script lang="ts" setup>
const locationsStore = useLocationsStore();

const { isDesktop } = useBreakpoints();

const mapRef = ref();

const { initializeBounds, enableAllWatchers } = useMapWatchers(mapRef);

const stopWatchers = enableAllWatchers();

onMounted(() => {
  watch(
    mapRef,
    (value) => {
      if (value) {
        initializeBounds();
      }
    },
    { immediate: true },
  );
});

onBeforeUnmount(() => {
  stopWatchers();
});
</script>

<template>
  <div
    v-if="locationsStore.isLoading"
    :class="{
      'h-[calc(100vh-56px)]': isDesktop,
      'h-[calc(100vh-112px)]': !isDesktop,
    }"
    class="flex justify-center items-center px-6 lg:px-12 py-12 container"
  >
    <span class="loading loading-spinner loading-xl" />
  </div>

  <UiTitleWithDescription
    v-else-if="locationsStore.isEmpty"
    :title="$t('PAGES.DASHBOARD.EMPTY_STATE_TITLE')"
    class="px-6 lg:px-12 py-12 container"
    has-additional
    has-description
  >
    <template #description>
      <span>{{ $t('PAGES.DASHBOARD.EMPTY_STATE_DESCRIPTION') }}</span>
    </template>

    <template #additional>
      <NuxtLink
        class="btn btn-primary mt-3"
        to="/dashboard/add"
      >
        <span>{{ $t('PAGES.DASHBOARD.EMPTY_STATE_BUTTON_TITLE') }}</span>
        <Icon name="tabler:circle-plus-filled" size="21" />
      </NuxtLink>
    </template>
  </UiTitleWithDescription>

  <div
    v-else-if="locationsStore.hasLocations"
    :class="{
      'h-[calc(100vh-56px)]': isDesktop,
      'h-[calc(100vh-112px)]': !isDesktop,
    }"
    class="w-full"
  >
    <UiMap ref="mapRef" />
  </div>
</template>
