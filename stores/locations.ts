import { defineStore } from 'pinia';

type Status = 'idle' | 'loading' | 'success' | 'error';

type LocationsState = {
  locations: any[];
  status: Status;
  error: string | null;
};

export const useLocationsStore = defineStore('locationsStore', {
  state: (): LocationsState => ({
    locations: [],
    status: 'idle',
    error: null,
  }),

  getters: {
    isLoading: state => state.status === 'loading',
    hasError: state => state.status === 'error',
    isSuccess: state => state.status === 'success',
    isIdle: state => state.status === 'idle',
    locationsCount: state => state.locations.length,
    hasCompletedFetch: state => state.status === 'success' || state.status === 'error',
    shouldShowEmptyState: state => state.status === 'success' && state.locations.length === 0,
  },

  actions: {
    async fetchLocations() {
      this.status = 'loading';
      this.error = null;

      try {
        const data = await $fetch('/api/locations');

        this.locations = data || [];
        this.status = 'success';
      }
      catch (e) {
        this.error = e instanceof Error ? e.message : 'An unknown error has occurred.';
        this.status = 'error';
      }
    },

    async addLocation(location: any) {
      this.status = 'loading';
      this.error = null;

      try {
        const { $csrfFetch } = useNuxtApp();

        const { data } = await $csrfFetch('/api/locations', {
          method: 'POST',
          body: location,
        });

        this.locations.push(data);
        this.status = 'success';

        return { success: true, data };
      }
      catch (e: any) {
        this.error = e.data?.statusMessage || 'An unknown error has occurred.';
        this.status = 'error';

        return { success: false, error: e, validationErrors: e.data };
      }
    },

    clearError() {
      this.error = null;
      this.status = 'idle';
    },
  },
});
