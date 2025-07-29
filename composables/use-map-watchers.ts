export function useMapWatchers(mapRef: Ref) {
  const mapStore = useMapStore();

  const updateMapBounds = async (bounds?: any) => {
    if (!mapRef.value || mapStore.addedPoint) {
      return;
    }

    const targetBounds = bounds || mapStore.mapBounds;

    if (!targetBounds) {
      return;
    }

    await mapRef.value.fitBounds(targetBounds, {
      duration: bounds ? 0 : 1000,
    });
  };

  const watchMapBounds = () => {
    return watch(
      () => mapStore.mapBounds,
      (newBounds) => {
        updateMapBounds(newBounds).then();
      },
    );
  };

  const enableAllWatchers = () => {
    const stopBoundsWatcher = watchMapBounds();

    return () => {
      stopBoundsWatcher();
    };
  };

  const initializeBounds = () => {
    updateMapBounds().then();
  };

  return {
    updateMapBounds,
    watchMapBounds,
    enableAllWatchers,
    initializeBounds,
  };
}
