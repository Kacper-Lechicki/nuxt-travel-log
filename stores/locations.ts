import { defineStore } from 'pinia';

import type { InsertLocation, Location } from '~/lib/db/schema';

type LocationsState = {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
};

export const useLocationsStore = defineStore('locations', {
  state: (): LocationsState => ({
    locations: [],
    isLoading: false,
    error: null,
    isInitialized: false,
  }),

  getters: {
    count: state => state.isInitialized && state.locations.length,
    isEmpty: state => state.isInitialized && !state.isLoading && !state.locations.length,
    sidebarItems: state => state.isInitialized && state.locations.map(location => ({
      id: `location-${location.id}`,
      label: location.name,
      icon: 'tabler:map-pin-filled',
      href: `#`,
    })),
    hasLocations: state => state.isInitialized && !state.isLoading && state.locations.length,
  },

  actions: {
    async fetch() {
      this.isInitialized = true;

      if (this.locations.length > 0)
        return;

      this.isLoading = true;
      this.error = null;

      try {
        const data = await $fetch<Location[]>('/api/locations');
        this.locations = data || [];
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch locations';
      }
      finally {
        this.isLoading = false;
      }
    },

    async refresh() {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await $fetch<Location[]>('/api/locations');
        this.locations = data || [];
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to refresh locations';
      }
      finally {
        this.isLoading = false;
      }
    },

    async add(location: InsertLocation) {
      this.isLoading = true;
      this.error = null;

      try {
        const { $csrfFetch } = useNuxtApp();

        const data = await $csrfFetch<Location>('/api/locations', {
          method: 'POST',
          body: location,
        });

        await this.refresh();

        return { success: true, data };
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

    clear() {
      this.locations = [];
      this.error = null;
      this.isLoading = false;
      this.isInitialized = false;
    },
  },
});
