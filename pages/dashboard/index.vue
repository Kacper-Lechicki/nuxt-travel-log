<script lang="ts" setup>
const locationsStore = useLocationsStore();
</script>

<template>
  <div class="container mx-auto flex flex-col gap-9">
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

      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <UiLocationCard
          v-for="location in locationsStore.locations"
          :key="location.id"
          :location="location"
        />
      </div>
    </div>
  </div>
</template>
