import { reactive, ref } from 'vue';

type TooltipState = {
  visible: boolean;
  element: HTMLElement | null;
};

export function useMapTooltips() {
  const tooltipStates = reactive<Record<number, TooltipState>>({});

  const draggableTooltipState = ref({
    visible: false,
    element: null as HTMLElement | null,
  });

  function handleMouseEnter(point: MapPoint, event: MouseEvent) {
    if (!tooltipStates[point.id]) {
      tooltipStates[point.id] = { visible: false, element: null };
    }

    tooltipStates[point.id].element = event.currentTarget as HTMLElement;
    tooltipStates[point.id].visible = true;
  }

  function handleMouseLeave(point: MapPoint) {
    if (tooltipStates[point.id]) {
      tooltipStates[point.id].visible = false;
      tooltipStates[point.id].element = null;
    }
  }

  function handleDraggableMouseEnter(event: MouseEvent) {
    draggableTooltipState.value = {
      visible: true,
      element: event.currentTarget as HTMLElement,
    };
  }

  function handleDraggableMouseLeave() {
    draggableTooltipState.value = {
      visible: false,
      element: null,
    };
  }

  return {
    tooltipStates,
    draggableTooltipState,
    handleMouseEnter,
    handleMouseLeave,
    handleDraggableMouseEnter,
    handleDraggableMouseLeave,
  };
}
