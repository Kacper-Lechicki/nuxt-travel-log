import type { Ref } from 'vue';

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
type ActualPlacement = Exclude<TooltipPlacement, 'auto'>;

type UseTooltipOptions = {
  placement?: TooltipPlacement;
  offset?: number;
  autoFlip?: boolean;
};

export function useTooltip(options: UseTooltipOptions = {}) {
  const { placement = 'auto', offset = 8, autoFlip = true } = options;

  const position = ref({ x: 0, y: 0 });
  const actualPlacement = ref<ActualPlacement>('top');
  const tooltipRef = ref<HTMLElement>();

  const VIEWPORT_PADDING = 8;
  const PLACEMENTS: ActualPlacement[] = ['top', 'bottom', 'left', 'right'];

  function getViewport() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  function getAvailableSpace(targetRect: DOMRect) {
    const viewport = getViewport();
    return {
      top: targetRect.top,
      bottom: viewport.height - targetRect.bottom,
      left: targetRect.left,
      right: viewport.width - targetRect.right,
    };
  }

  function findBestPlacement(targetRect: DOMRect, tooltipRect: DOMRect): ActualPlacement {
    const space = getAvailableSpace(targetRect);

    if (placement !== 'auto') {
      const isVertical = placement === 'top' || placement === 'bottom';
      const requiredSpace = (isVertical ? tooltipRect.height : tooltipRect.width) + offset;

      if (space[placement] >= requiredSpace || !autoFlip) {
        return placement;
      }
    }

    return PLACEMENTS.reduce((best, current) => {
      const isVertical = current === 'top' || current === 'bottom';
      const requiredSpace = (isVertical ? tooltipRect.height : tooltipRect.width) + offset;
      const currentSpace = space[current];

      return (currentSpace >= requiredSpace && currentSpace > space[best]) ? current : best;
    }, 'top');
  }

  function calculatePosition(targetRect: DOMRect, tooltipRect: DOMRect, placement: ActualPlacement) {
    const positions = {
      top: {
        x: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
        y: targetRect.top - tooltipRect.height - offset,
      },
      bottom: {
        x: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
        y: targetRect.bottom + offset,
      },
      left: {
        x: targetRect.left - tooltipRect.width - offset,
        y: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
      },
      right: {
        x: targetRect.right + offset,
        y: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
      },
    };

    const { x, y } = positions[placement];
    const viewport = getViewport();

    return {
      x: Math.max(VIEWPORT_PADDING, Math.min(x, viewport.width - tooltipRect.width - VIEWPORT_PADDING)),
      y: Math.max(VIEWPORT_PADDING, Math.min(y, viewport.height - tooltipRect.height - VIEWPORT_PADDING)),
    };
  }

  function updatePosition(targetElement: HTMLElement | null) {
    if (!targetElement || !tooltipRef.value)
      return;

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.value.getBoundingClientRect();

    actualPlacement.value = placement === 'auto'
      ? findBestPlacement(targetRect, tooltipRect)
      : placement;

    position.value = calculatePosition(targetRect, tooltipRect, actualPlacement.value);
  }

  const arrowClasses = computed(() => {
    const base = 'absolute w-2 h-2 bg-base-300 transform rotate-45';
    const positions = {
      top: '-bottom-1 left-1/2 -translate-x-1/2',
      bottom: '-top-1 left-1/2 -translate-x-1/2',
      left: '-right-1 top-1/2 -translate-y-1/2',
      right: '-left-1 top-1/2 -translate-y-1/2',
    };
    return `${base} ${positions[actualPlacement.value]}`;
  });

  function setupTooltip(show: Ref<boolean>, targetElement: Ref<HTMLElement | null>) {
    const updateRAF = () => requestAnimationFrame(() => updatePosition(targetElement.value));

    watch(
      [show, targetElement, () => placement],
      () => show.value && targetElement.value && nextTick(() => updatePosition(targetElement.value)),
      { immediate: true },
    );

    onMounted(() => {
      window.addEventListener('scroll', updateRAF, true);
      window.addEventListener('resize', updateRAF);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', updateRAF, true);
      window.removeEventListener('resize', updateRAF);
    });
  }

  return {
    position,
    actualPlacement,
    tooltipRef,
    arrowClasses,
    setupTooltip,
    updatePosition,
  };
}
