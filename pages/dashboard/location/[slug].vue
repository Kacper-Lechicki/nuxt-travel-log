<script lang="ts" setup>
const route = useRoute();

const { t } = useI18n();
const { slug } = route.params;

const { data: location, status, error } = await useFetch(`/api/locations/${slug}`, {
  lazy: true,
});
</script>

<template>
  <div class="container mx-auto px-6 lg:px-12 py-12">
    <div
      v-if="status === 'pending'"
    >
      <span class="loading loading-spinner loading-xl" />
    </div>

    <div
      v-if="error && status !== 'pending'"
      class="alert alert-error break-all"
      role="alert"
    >
      <span>{{ error }}</span>
    </div>

    <div v-if="location && status !== 'pending'">
      <UiTitleWithDescription :title="location.name" has-description>
        <template #description>
          {{ location.description || t('PAGES.LOCATION_PAGE.EMPTY_DESCRIPTION') }}
        </template>
      </UiTitleWithDescription>
    </div>
  </div>
</template>
