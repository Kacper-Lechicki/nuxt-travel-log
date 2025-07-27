type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

type UseTooltipOptions = {
  placement?: TooltipPlacement;
  offset?: number;
  autoFlip?: boolean;
};

type TooltipPosition = {
  x: number;
  y: number;
};

export function useTooltip(options: UseTooltipOptions = {}) {
  const {
    placement = 'auto',
    offset = 8,
    autoFlip = true,
  } = options;

  const position = ref<TooltipPosition>({ x: 0, y: 0 });
  const actualPlacement = ref<Exclude<TooltipPlacement, 'auto'>>('top');
  const tooltipRef = ref<HTMLElement>();

  function calculateBestPlacement(
    targetRect: DOMRect,
    tooltipRect: DOMRect,
  ): Exclude<TooltipPlacement, 'auto'> {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const space = {
      top: targetRect.top,
      bottom: viewport.height - targetRect.bottom,
      left: targetRect.left,
      right: viewport.width - targetRect.right,
    };

    if (placement !== 'auto') {
      const hasSpace = {
        top: space.top >= tooltipRect.height + offset,
        bottom: space.bottom >= tooltipRect.height + offset,
        left: space.left >= tooltipRect.width + offset,
        right: space.right >= tooltipRect.width + offset,
      };

      if (hasSpace[placement]) {
        return placement;
      }

      if (!autoFlip) {
        return placement;
      }
    }

    const placements: Array<Exclude<TooltipPlacement, 'auto'>> = ['top', 'bottom', 'left', 'right'];

    let bestPlacement: Exclude<TooltipPlacement, 'auto'> = 'top';
    let maxSpace = 0;

    for (const currentPlacement of placements) {
      const currentSpace = space[currentPlacement];

      const requiredSpace = currentPlacement === 'top' || currentPlacement === 'bottom'
        ? tooltipRect.height + offset
        : tooltipRect.width + offset;

      if (currentSpace >= requiredSpace && currentSpace > maxSpace) {
        maxSpace = currentSpace;
        bestPlacement = currentPlacement;
      }
    }

    return bestPlacement;
  }

  function calculatePosition(
    targetRect: DOMRect,
    tooltipRect: DOMRect,
    currentPlacement: Exclude<TooltipPlacement, 'auto'>,
  ): TooltipPosition {
    let x = 0;
    let y = 0;

    switch (currentPlacement) {
      case 'top':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.bottom + offset;
        break;
      case 'left':
        x = targetRect.left - tooltipRect.width - offset;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = targetRect.right + offset;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (x < 8) {
      x = 8;
    }
    else if (x + tooltipRect.width > viewport.width - 8) {
      x = viewport.width - tooltipRect.width - 8;
    }

    if (y < 8) {
      y = 8;
    }
    else if (y + tooltipRect.height > viewport.height - 8) {
      y = viewport.height - tooltipRect.height - 8;
    }

    return { x, y };
  }

  function updatePosition(targetElement: HTMLElement | null) {
    if (!targetElement || !tooltipRef.value)
      return;

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.value.getBoundingClientRect();

    const currentPlacement = placement === 'auto'
      ? calculateBestPlacement(targetRect, tooltipRect)
      : placement;

    actualPlacement.value = currentPlacement;
    position.value = calculatePosition(targetRect, tooltipRect, currentPlacement);
  }

  function updatePositionRAF(targetElement: HTMLElement | null) {
    requestAnimationFrame(() => updatePosition(targetElement));
  }

  const arrowClasses = computed(() => {
    const base = 'absolute w-2 h-2 bg-base-300 transform rotate-45';

    switch (actualPlacement.value) {
      case 'top':
        return `${base} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${base} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${base} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${base} -left-1 top-1/2 -translate-y-1/2`;
    }
  });

  function setupTooltip(
    show: Ref<boolean>,
    targetElement: Ref<HTMLElement | null>,
  ) {
    const scrollHandler = () => updatePositionRAF(targetElement.value);
    const resizeHandler = () => updatePositionRAF(targetElement.value);

    watch(
      () => [show.value, targetElement.value, placement],
      () => {
        if (show.value && targetElement.value) {
          nextTick(() => {
            updatePosition(targetElement.value);
          }).then();
        }
      },
      { immediate: true },
    );

    onMounted(() => {
      window.addEventListener('scroll', scrollHandler, true);
      window.addEventListener('resize', resizeHandler);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', scrollHandler, true);
      window.removeEventListener('resize', resizeHandler);
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
