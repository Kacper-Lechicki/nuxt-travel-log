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
      <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        <div
          v-for="location in locationsStore.locations"
          :key="location.id"
          class="card card-compact bg-base-200 border border-gray-700/30 h-42"
        >
          <div class="card-body flex flex-col h-full">
            <h3
              :title="location.name"
              class="text-xl font-bold truncate flex-shrink-0"
            >
              {{ location.name }}
            </h3>

            <div class="flex-1 overflow-hidden">
              <p
                :title="location.description"
                class="font-light text-base-content/70 text-sm leading-relaxed description-text"
              >
                {{ location.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped>
.description-text {
  display: -webkit-box;
  max-height: calc(1.5rem * 3);
  line-clamp: 3;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
