import { reactive } from 'vue';

type TooltipState = {
  visible: boolean;
  element: HTMLElement | null;
};

export function useMapTooltips() {
  const tooltipStates = reactive<Record<number, TooltipState>>({});

  function handleMouseEnter(pointId: number, event: MouseEvent) {
    if (!tooltipStates[pointId]) {
      tooltipStates[pointId] = { visible: false, element: null };
    }

    tooltipStates[pointId].element = event.currentTarget as HTMLElement;
    tooltipStates[pointId].visible = true;
  }

  function handleMouseLeave(pointId: number) {
    if (tooltipStates[pointId]) {
      tooltipStates[pointId].visible = false;
      tooltipStates[pointId].element = null;
    }
  }

  return {
    tooltipStates,
    handleMouseEnter,
    handleMouseLeave,
  };
}
