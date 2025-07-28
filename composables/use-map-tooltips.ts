import { reactive } from 'vue';

type TooltipState = {
  visible: boolean;
  element: HTMLElement | null;
};

export function useMapTooltips() {
  const tooltipStates = reactive<Record<number, TooltipState>>({});

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

  return {
    tooltipStates,
    handleMouseEnter,
    handleMouseLeave,
  };
}
