import { LngLatBounds } from 'maplibre-gl';
import { defineStore } from 'pinia';

export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoint = {
  id: number;
  label: string;
} & LatLongItem;

type MapState = {
  mapPoints: MapPoint[];
  _cachedBounds: LngLatBounds | null;
  _lastPointsHash: string;
};

export const useMapStore = defineStore('map', {
  state: (): MapState => ({
    mapPoints: [],
    _cachedBounds: null,
    _lastPointsHash: '',
  }),

  getters: {
    mapBounds(state): LngLatBounds | null {
      const { mapPoints } = state;

      if (!mapPoints || mapPoints.length === 0) {
        return null;
      }

      const currentHash = JSON.stringify(mapPoints.map(p => [p.id, p.lat, p.long]));

      if (currentHash === state._lastPointsHash && state._cachedBounds) {
        return state._cachedBounds;
      }

      const firstPoint = mapPoints[0];
      const initialBounds = new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      );

      const newBounds = mapPoints.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, initialBounds);

      state._cachedBounds = newBounds;
      state._lastPointsHash = currentHash;

      return newBounds;
    },
  },

  actions: {
    clearMapPoints() {
      this.mapPoints = [];
      this._cachedBounds = null;
      this._lastPointsHash = '';
    },

    setMapPoints(points: MapPoint[]) {
      this.mapPoints = points;
    },
  },
});
