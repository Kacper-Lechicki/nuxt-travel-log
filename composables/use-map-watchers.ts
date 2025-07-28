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

  const watchActivePoint = () => {
    return watch(
      () => mapStore.activePoint,
      async (activePoint) => {
        if (!mapRef.value || mapStore.addedPoint || !activePoint) {
          return;
        }

        await mapRef.value.flyTo([activePoint.long, activePoint.lat]);
      },
    );
  };

  const enableAllWatchers = () => {
    const stopBoundsWatcher = watchMapBounds();
    const stopActivePointWatcher = watchActivePoint();

    return () => {
      stopBoundsWatcher();
      stopActivePointWatcher();
    };
  };

  const initializeBounds = () => {
    updateMapBounds().then();
  };

  return {
    updateMapBounds,
    watchMapBounds,
    watchActivePoint,
    enableAllWatchers,
    initializeBounds,
  };
}
