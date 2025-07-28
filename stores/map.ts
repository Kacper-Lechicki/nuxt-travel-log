import { LngLatBounds } from 'maplibre-gl';
import { defineStore } from 'pinia';

export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoint = {
  id: number;
  name: string;
  description: string;
} & LatLongItem;

type MapState = {
  mapPoints: MapPoint[];
  activePoint: MapPoint | null;
};

export const useMapStore = defineStore('map', {
  state: (): MapState => ({
    mapPoints: [],
    activePoint: null,
  }),

  getters: {
    mapBounds(state): LngLatBounds | null {
      const { mapPoints } = state;

      if (!mapPoints || mapPoints.length === 0) {
        return null;
      }

      const firstPoint = mapPoints[0];

      const initialBounds = new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      );

      return mapPoints.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, initialBounds);
    },
  },

  actions: {
    clearMapPoints() {
      this.mapPoints = [];
    },

    setMapPoints(points: MapPoint[]) {
      this.mapPoints = points;
    },
  },
});
