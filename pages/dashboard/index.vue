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
  <div>
    <div v-if="locationsStore.isLoading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-xl" />
    </div>

    <UiTitleWithDescription
      v-else-if="locationsStore.isEmpty"
      :title="$t('PAGES.DASHBOARD.EMPTY_STATE_TITLE')"
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

    <div v-else-if="locationsStore.hasLocations" class="flex flex-col gap-9 h-full">
      <UiTitleWithDescription :title="$t('PAGES.DASHBOARD.TITLE')" />

      <div
        :class="{
          'h-[calc(100vh-56px-84px-32px-2.25rem)]': isDesktop,
          'h-[calc(100vh-112px-84px-32px-2.25rem)]': !isDesktop,
        }"
        class="rounded overflow-hidden"
      >
        <UiMap ref="mapRef" />
      </div>
    </div>
  </div>
</template>
