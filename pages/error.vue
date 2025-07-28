<script lang="ts" setup>
const route = useRoute();

const error = route.query.error || 'An unknown error occured.';
</script>

<template>
  <div
    class="card bg-base-300 container mt-4 min-h-72 text-center mx-auto flex flex-col justify-center items-center gap-8"
  >
    <div class="alert alert-error min-w-1/2 text-center" role="alert">
      <span>{{ $t('PAGES.ERROR.TITLE') }} {{ error }}</span>
    </div>

    <NuxtLink class="btn btn-primary" to="/">
      <span>{{ $t('PAGES.ERROR.HOME_BUTTON') }}</span>
      <Icon name="tabler:arrow-left" size="21" />
    </NuxtLink>
  </div>
</template>
