import { defineStore } from 'pinia';

export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

type SidebarState = {
  isSidebarOpen: boolean;
  sidebarItems: SidebarItem[];
  isLoading: boolean;
};

export const useSidebarStore = defineStore('sidebarStore', {
  state: (): SidebarState => ({
    isSidebarOpen: true,
    sidebarItems: [],
    isLoading: false,
  }),

  actions: {
    setSidebarValueFromLocalStorage() {
      this.isSidebarOpen = localStorage.getItem('isSidebarOpen') === 'true';
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      localStorage.setItem('isSidebarOpen', this.isSidebarOpen.toString());
    },
  },
});
