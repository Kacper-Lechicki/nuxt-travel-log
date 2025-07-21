<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
    <div
      class="btn mt-1 flex gap-3"
      role="button"
      tabindex="0"
    >
      <div v-if="authStore.user.image" class="avatar">
        <div class="w-6 rounded-full">
          <img :src="authStore.user.image" alt="User avatar">
        </div>
      </div>

      <span>{{ authStore.user.name }}</span>
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
    class="btn btn-accent"
    @click="authStore.signIn"
  >
    <span>Sign In With Github</span>
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />

    <Icon
      v-else
      name="tabler:brand-github"
      size="24"
    />
  </button>
</template>
