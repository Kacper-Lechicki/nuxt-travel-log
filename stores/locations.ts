import { defineStore } from 'pinia';

import type { InsertLocation, Location } from '~/lib/db/schema';

type SidebarItem = {
  id: string;
  name: string;
  icon: string;
  href: string;
  location?: MapPoint;
};

type LocationsState = {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
};

type AddLocationResponse = {
  success: boolean;
  data?: Location;
  error: string | null;
  validationErrors?: any;
};

export const useLocationsStore = defineStore('locations', {
  state: (): LocationsState => ({
    locations: [],
    isLoading: false,
    error: null,
    isInitialized: false,
  }),

  getters: {
    count: (state): number => (state.isInitialized && state.locations.length) || 0,
    isEmpty: (state): boolean => state.isInitialized && !state.isLoading && !state.locations.length,
    sidebarItems: (state): SidebarItem[] => {
      if (!state.isInitialized)
        return [];

      return state.locations.map(location => ({
        id: `location-${location.id}`,
        name: location.name,
        icon: 'tabler:map-pin-filled',
        href: '#',
        location,
      }));
    },
    hasLocations: (state): boolean => state.isInitialized && !state.isLoading && state.locations.length > 0,
  },

  actions: {
    async fetch(): Promise<void> {
      this.isInitialized = true;

      if (this.locations.length > 0)
        return;

      this.isLoading = true;
      this.error = null;

      try {
        const data = await $fetch<Location[]>('/api/locations');

        this.locations = data || [];
        this.syncWithMap(this.locations);
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch locations';
      }
      finally {
        this.isLoading = false;
      }
    },

    async refresh(): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await $fetch<Location[]>('/api/locations');

        this.locations = data || [];
        this.syncWithMap(this.locations);
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to refresh locations';
      }
      finally {
        this.isLoading = false;
      }
    },

    async add(location: InsertLocation): Promise<AddLocationResponse> {
      this.isLoading = true;
      this.error = null;

      try {
        const { $csrfFetch } = useNuxtApp();

        const data = await $csrfFetch<Location>('/api/locations', {
          method: 'POST',
          body: location,
        });

        await this.refresh();

        return { success: true, data, error: null };
      }
      catch (error: any) {
        this.error = error.data?.statusMessage || 'Failed to add location.';

        return {
          success: false,
          error: this.error,
          validationErrors: error.data?.validationErrors,
        };
      }
      finally {
        this.isLoading = false;
      }
    },

    syncWithMap(locations: Location[]) {
      const mapStore = useMapStore();

      mapStore.clearMapPoints();
      mapStore.mapPoints = locations;
    },

    clear(): void {
      this.locations = [];
      this.error = null;
      this.isLoading = false;
      this.isInitialized = false;
    },
  },
});

export type { AddLocationResponse, SidebarItem };
