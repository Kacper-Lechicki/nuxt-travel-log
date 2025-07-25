<script lang="ts" setup>
defineProps<{
  label: string;
  icon: string;
  href: string;
  onlyIcon: boolean;
}>();

const route = useRoute();
</script>

<template>
  <div
    :class="{ 'lg:tooltip lg:tooltip-right': $props.onlyIcon }"
    :data-tip="$props.onlyIcon ? $props.label : undefined"
  >
    <NuxtLink
      :class="{ 'bg-base-100 border-gray-700/100': route.path === $props.href, 'justify-center': $props.onlyIcon }"
      :to="$props.href"
      class="flex flex-nowrap justify-start font-medium gap-3 p-2 border border-gray-700/30 rounded hover:bg-base-content/5 h-11  hover:cursor-pointer overflow-hidden"
    >
      <Icon
        :name="$props.icon"
        class="flex-shrink-0"
        size="21"
      />

      <Transition name="grow">
        <span v-if="!$props.onlyIcon" class="flex-shrink-0">{{ $props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style lang="css" scoped>
.grow-enter-active {
  animation: grow 0.3s;
}

.grow-leave-active {
  animation: grow 0.3s reverse;
}

@keyframes grow {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
