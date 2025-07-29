<script lang="ts" setup>
const { isDesktop } = useBreakpoints();
const { t } = useI18n();
</script>

<template>
  <header class="sticky top-0 left-0 navbar bg-primary text-primary-content z-[1000]">
    <div class="navbar-start">
      <NuxtLink class="flex items-center gap-3 sm:px-4 text-md md:text-xl" to="/">
        <Icon name="tabler:map" size="21" />

        <h1 class="font-bold">
          {{ t('COMPONENTS.NAVBAR.TRAVEL_LOG') }}
        </h1>
      </NuxtLink>
    </div>

    <div class="flex items-center gap-6 navbar-end">
      <UiThemeToggle />
      <UiLocaleToggle />
      <AppAuthButton :show-label="isDesktop" />
    </div>
  </header>
</template>
