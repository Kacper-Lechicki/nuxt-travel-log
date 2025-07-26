<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Props = {
  text: string;
  show: boolean;
  targetElement: HTMLElement | null;
};

const props = defineProps<Props>();

const tooltipPosition = ref({ top: 0, left: 0 });
let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null;

function updateTooltipPosition() {
  if (!props.targetElement)
    return;

  const rect = props.targetElement.getBoundingClientRect();
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

watch(() => props.show, (newShow) => {
  if (newShow) {
    updateTooltipPosition();
  }
});

watch(() => props.targetElement, () => {
  if (props.show) {
    updateTooltipPosition();
  }
});

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
});
</script>

<template>
  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="show"
        :style="{
          'position': 'fixed',
          'top': `${tooltipPosition.top}px`,
          'left': `${tooltipPosition.left}px`,
          'transform': 'translateY(-50%)',
          'z-index': '9999',
        }"
        class="bg-base-200 text-base-content text-sm px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none"
      >
        {{ text }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.9);
}
</style>
