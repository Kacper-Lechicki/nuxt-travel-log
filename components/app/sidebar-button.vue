<script lang="ts" setup>
import type { RouteLocationRaw } from '#vue-router';

import { computed, ref } from 'vue';

type Props = {
  name: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  onlyIcon?: boolean;
  accent?: boolean;
};

type Emits = {
  click: [event: MouseEvent];
  mouseenter: [];
  mouseleave: [];
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  onlyIcon: false,
});

const emits = defineEmits<Emits>();

const route = useRoute();

const showTooltip = ref(false);
const buttonRef = ref<HTMLElement | null>(null);

const isActive = computed(() => route.path === props.href);

const linkClasses = computed(() => ({
  'bg-base-100 border-gray-700': isActive.value,
  'justify-center': props.onlyIcon,
  'bg-accent/30': props.accent,
  'hover:bg-base-content/5': !props.accent,
}));

function handleClick(event: MouseEvent) {
  emits('click', event);
}

function handleMouseEnter() {
  emits('mouseenter');

  if (!props.onlyIcon)
    return;

  showTooltip.value = true;
}

function handleMouseLeave() {
  emits('mouseleave');

  if (!props.onlyIcon)
    return;

  showTooltip.value = false;
}
</script>

<template>
  <div
    ref="buttonRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <NuxtLink
      :class="linkClasses"
      :to="props.href || props.to"
      class="flex flex-nowrap justify-start font-medium gap-3 p-2 border border-gray-700/30 rounded h-11 hover:cursor-pointer overflow-hidden transition-colors duration-200"
      @click="handleClick"
    >
      <Icon
        :name="props.icon"
        class="flex-shrink-0"
        size="21"
      />

      <Transition name="grow">
        <span v-if="!props.onlyIcon" class="flex-shrink-0">{{ props.name }}</span>
      </Transition>
    </NuxtLink>
  </div>

  <UiTooltip
    :show="showTooltip"
    :target-element="buttonRef"
    :text="props.name"
  />
</template>

<style scoped>
.grow-enter-active,
.grow-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
}

.grow-enter-from,
.grow-leave-to {
  opacity: 0;
  transform: scaleX(0);
  width: 0;
}
</style>
