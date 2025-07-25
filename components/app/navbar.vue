<script lang="ts" setup>
import AuthButton from '~/components/auth-button.vue';
</script>

<template>
  <div class=" sticky top-0 left-0 navbar bg-primary text-primary-content z-[1000]">
    <div class="navbar-start">
      <NuxtLink class="flex items-center gap-3 btn btn-ghost text-xl" to="/">
        <Icon name="tabler:map" size="21" />
        <span>Travel Log</span>
      </NuxtLink>
    </div>

    <div class="flex items-center md:gap-2 navbar-end">
      <AppThemeToggle />
      <AuthButton />
    </div>
  </div>
</template>
