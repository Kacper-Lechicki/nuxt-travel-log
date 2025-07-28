import { defineStore } from 'pinia';

type SidebarState = {
  isSidebarOpen: boolean;
  isLoading: boolean;
};

export type MenuItem = {
  href: string;
  icon: string;
  name: string;
};

export const useSidebarStore = defineStore('sidebar', {
  state: (): SidebarState => ({
    isSidebarOpen: true,
    isLoading: false,
  }),

  actions: {
    setSidebarValueFromLocalStorage() {
      try {
        const stored = localStorage.getItem('isSidebarOpen');
        this.isSidebarOpen = stored !== 'false';
      }
      catch (error) {
        console.error('Error reading from localStorage:', error);
        this.isSidebarOpen = true;
      }
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;

      try {
        localStorage.setItem('isSidebarOpen', this.isSidebarOpen.toString());
      }
      catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },

    setLoading(value: boolean) {
      this.isLoading = value;
    },
  },
});
