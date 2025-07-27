<script lang="ts" setup>
const locationsStore = useLocationsStore();
</script>

<template>
  <div>
    <div v-if="locationsStore.isLoading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-xl" />
    </div>

    <UiTitleWithDescription
      v-else-if="locationsStore.isEmpty"
      has-additional
      has-description
      title="Locations"
    >
      <template #description>
        <span>Add a location to get started.</span>
      </template>

      <template #additional>
        <NuxtLink
          class="btn btn-primary mt-3"
          to="/dashboard/add"
        >
          <span>Add Location</span>
          <Icon name="tabler:circle-plus-filled" size="21" />
        </NuxtLink>
      </template>
    </UiTitleWithDescription>

    <div v-else-if="locationsStore.hasLocations" class="flex flex-col gap-9">
      <UiTitleWithDescription title="Locations" />

      <UiCarousel :offset="350">
        <div class="flex gap-6 w-max">
          <div
            v-for="location in locationsStore.locations"
            :key="location.id"
            class="flex-shrink-0 w-80"
          >
            <UiLocationCard :location="location" />
          </div>
        </div>
      </UiCarousel>
    </div>
  </div>
</template>
