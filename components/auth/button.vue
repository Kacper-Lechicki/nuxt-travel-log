<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
    <div
      class="btn flex gap-3 max-w-55"
      role="button"
      tabindex="0"
    >
      <div v-if="authStore.user.image" class="avatar flex-shrink-0">
        <div class="w-6 rounded-full">
          <img :src="authStore.user.image" alt="User avatar">
        </div>
      </div>

      <span class="truncate min-w-0 hidden sm:inline">{{ authStore.user.name }}</span>
    </div>

    <ul class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-md" tabindex="0">
      <li>
        <NuxtLink to="/sign-out">
          <Icon name="tabler:logout-2" size="18" />
          <span>Sign out</span>
        </NuxtLink>
      </li>
    </ul>
  </div>

  <button
    v-else
    :disabled="authStore.loading"
    class="btn btn-accent flex gap-2 max-w-55"
    @click="authStore.signIn"
  >
    <span class="truncate min-w-0">
      Sign In<span class="hidden md:inline"> With Github</span>
    </span>

    <span v-if="authStore.loading" class="loading loading-spinner loading-sm flex-shrink-0" />

    <Icon
      v-else
      class="flex-shrink-0"
      name="tabler:brand-github"
      size="21"
    />
  </button>
</template>
