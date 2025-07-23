<script lang="ts" setup>
import AuthButton from '~/components/auth-button.vue';
</script>

<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink class="btn btn-ghost text-xl" to="/">
        Travel Log
      </NuxtLink>
    </div>

    <div class="flex items-center gap-2 navbar-end">
      <AppThemeToggle />
      <AuthButton />
    </div>
  </div>
</template>
