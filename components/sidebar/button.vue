<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  onlyIcon: boolean;
}>();

const route = useRoute();
const buttonRef = ref<HTMLElement | null>(null);
const tooltipPosition = ref({ top: 0, left: 0 });
const showTooltip = ref(false);

let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null;

const showTooltipTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const isActive = computed(() => route.path === props.href);

const linkClasses = computed(() => ({
  'bg-base-100 border-gray-700/100': isActive.value,
  'justify-center': props.onlyIcon,
}));

function updateTooltipPosition() {
  if (!buttonRef.value)
    return;

  const rect = buttonRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const tooltipWidth = 200;

  let left = rect.right + 8;

  if (left + tooltipWidth > viewportWidth) {
    left = rect.left - tooltipWidth - 8;
  }

  tooltipPosition.value = {
    top: rect.top + rect.height / 2,
    left: Math.max(8, left),
  };
}

function debouncedUpdateTooltip() {
  if (scrollTimeoutId)
    clearTimeout(scrollTimeoutId);

  scrollTimeoutId = setTimeout(updateTooltipPosition, 16);
}

function handleMouseEnter() {
  if (!props.onlyIcon)
    return;

  updateTooltipPosition();

  showTooltipTimeout.value = setTimeout(() => {
    showTooltip.value = true;
  }, 300);
}

function handleMouseLeave() {
  if (showTooltipTimeout.value) {
    clearTimeout(showTooltipTimeout.value);
    showTooltipTimeout.value = null;
  }

  showTooltip.value = false;
}

onMounted(() => {
  window.addEventListener('scroll', debouncedUpdateTooltip, {
    passive: true,
    capture: true,
  });

  window.addEventListener('resize', updateTooltipPosition, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', debouncedUpdateTooltip, { capture: true });
  window.removeEventListener('resize', updateTooltipPosition);

  if (scrollTimeoutId)
    clearTimeout(scrollTimeoutId);

  if (showTooltipTimeout.value)
    clearTimeout(showTooltipTimeout.value);
});
</script>

<template>
  <div
    ref="buttonRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <NuxtLink
      :class="linkClasses"
      :to="props.href"
      class="flex flex-nowrap justify-start font-medium gap-3 p-2 border border-gray-700/30 rounded hover:bg-base-content/5 h-11 hover:cursor-pointer overflow-hidden transition-colors duration-200"
    >
      <Icon
        :name="props.icon"
        class="flex-shrink-0"
        size="21"
      />

      <Transition name="grow">
        <span v-if="!props.onlyIcon" class="flex-shrink-0">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>

  <Teleport to="body">
    <UiTooltip
      :show="showTooltip"
      :target-element="buttonRef"
      :text="props.label"
    />
  </Teleport>
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
