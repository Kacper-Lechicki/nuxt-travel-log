<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="hero bg-base-300 container mx-auto md:mt-6 rounded">
    <div class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-3xl font-bold">
          {{ $t('PAGES.INDEX.TITLE') }}
        </h1>

        <p class="py-6">
          <span>{{ $t('PAGES.INDEX.DESCRIPTION_1') }}</span>
          <span>{{ $t('PAGES.INDEX.DESCRIPTION_2') }}</span>
        </p>

        <AppAuthButton v-if="!authStore.user" class="mx-auto" />

        <NuxtLink
          v-else
          class="btn btn-primary mx-auto"
          to="/dashboard"
        >
          <span>{{ $t('PAGES.INDEX.START_LOGGING_BUTTON') }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
