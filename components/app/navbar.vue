<script lang="ts" setup>
</script>

<template>
  <header class="sticky top-0 left-0 navbar dark:bg-primary text-primary-content z-[1000]">
    <div class="navbar-start">
      <NuxtLink class="flex items-center gap-3 sm:px-4 texl-md md:text-xl" to="/">
        <Icon name="tabler:map" size="21" />

        <h1 class="font-bold">
          {{ $t('COMPONENTS.NAVBAR.TRAVEL_LOG') }}
        </h1>
      </NuxtLink>
    </div>

    <div class="flex items-center gap-6 navbar-end">
      <UiThemeToggle />
      <UiLocaleToggle />
      <AppAuthButton />
    </div>
  </header>
</template>
