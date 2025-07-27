<script lang="ts" setup>
import { useTooltip } from '@/composables/use-tooltip';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

type Props = {
  show: boolean;
  targetElement: HTMLElement | null;
  text: string;
  placement?: TooltipPlacement;
  offset?: number;
  autoFlip?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  placement: 'auto',
  offset: 8,
  autoFlip: true,
});

const {
  position,
  actualPlacement,
  tooltipRef,
  arrowClasses,
  setupTooltip,
} = useTooltip({
  placement: props.placement,
  offset: props.offset,
  autoFlip: props.autoFlip,
});

setupTooltip(
  toRef(props, 'show'),
  toRef(props, 'targetElement'),
);
</script>

<template>
  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="show && targetElement"
        ref="tooltipRef"
        :class="[
          `tooltip-${actualPlacement}`,
        ]"
        :style="{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
        }"
        class="px-3 py-2 text-sm font-medium bg-base-300 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
      >
        <span>{{ text }}</span>
        <div :class="arrowClasses" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.tooltip-top.tooltip-enter-from,
.tooltip-top.tooltip-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.tooltip-bottom.tooltip-enter-from,
.tooltip-bottom.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.tooltip-left.tooltip-enter-from,
.tooltip-left.tooltip-leave-to {
  opacity: 0;
  transform: translateX(4px);
}

.tooltip-right.tooltip-enter-from,
.tooltip-right.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
