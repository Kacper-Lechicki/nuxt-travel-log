<script lang="ts" setup>
import AuthButton from '~/components/auth-button.vue';
</script>

<template>
  <div class=" sticky top-0 left-0 navbar bg-primary text-primary-content z-[1000]">
    <div class="navbar-start">
      <NuxtLink class="btn btn-ghost text-xl" to="/">
        Travel Log
      </NuxtLink>
    </div>

    <div class="flex items-center md:gap-2 navbar-end">
      <AppThemeToggle />
      <AuthButton />
    </div>
  </div>
</template>
