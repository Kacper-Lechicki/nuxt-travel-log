<script lang="ts" setup>
type Props = {
  showLabel?: boolean;
};

const props = withDefaults(
  defineProps<Props>(),
  {
    showLabel: true,
  },
);

const authStore = useAuthStore();

const { t } = useI18n();
</script>

<template>
  <div v-if="!authStore.isLoading && authStore.user" class="dropdown dropdown-end">
    <div
      class="sm:btn flex gap-3 max-w-55"
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
          <span>{{ t('COMPONENTS.AUTH_BUTTON.SIGN_OUT') }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>

  <button
    v-else
    :disabled="authStore.isLoading"
    class="btn btn-accent flex gap-2 max-w-55"
    @click="authStore.signIn"
  >
    <span v-if="props.showLabel" class="truncate min-w-0">
      <span class="md:hidden">{{ t('COMPONENTS.AUTH_BUTTON.SIGN_IN_SHORT') }}</span>
      <span class="hidden md:inline">{{ t('COMPONENTS.AUTH_BUTTON.SIGN_IN_WITH_GITHUB') }}</span>
    </span>

    <span v-if="authStore.isLoading" class="loading loading-spinner loading-sm flex-shrink-0" />

    <Icon
      v-else
      class="flex-shrink-0"
      name="tabler:brand-github"
      size="21"
    />
  </button>
</template>
