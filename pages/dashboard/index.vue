<script lang="ts" setup>
const locationsStore = useLocationsStore();
const mounted = ref(false);

const showEmptyState = computed(() =>
  mounted.value && locationsStore.shouldShowEmptyState,
);

const showLocations = computed(() =>
  mounted.value && locationsStore.isSuccess && locationsStore.locationsCount > 0,
);

const showTitle = computed(() =>
  mounted.value && (showEmptyState.value || showLocations.value),
);

onMounted(() => {
  mounted.value = true;
  locationsStore.clearError();
  locationsStore.fetchLocations();
});
</script>

<template>
  <div class="container mx-auto flex flex-col gap-8">
    <UiTitleWithDescription
      v-if="showTitle"
      :has-additional="showEmptyState"
      :has-description="showEmptyState"
      title="Locations"
    >
      <template v-if="showEmptyState" #description>
        <span>Add a location to get started.</span>
      </template>

      <template v-if="showEmptyState" #additional>
        <NuxtLink
          class="btn btn-primary mt-3"
          to="/dashboard/add"
        >
          <span>Add Location</span>
          <Icon name="tabler:circle-plus-filled" size="21" />
        </NuxtLink>
      </template>
    </UiTitleWithDescription>

    <template v-if="locationsStore.isLoading">
      <span class="loading loading-spinner loading-xl mx-auto" />
    </template>

    <template v-else-if="locationsStore.hasError">
      <div class="alert alert-error" role="alert">
        <span>{{ locationsStore.error }}</span>
      </div>
    </template>

    <template v-else-if="showLocations">
      <div
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        <UiLocationCard
          v-for="location in locationsStore.locations"
          :key="location.id"
          :location="location"
        />
      </div>
    </template>
  </div>
</template>
