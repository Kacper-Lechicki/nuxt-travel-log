import { defineStore } from 'pinia';

type SidebarState = {
  isSidebarOpen: boolean;
};

export const useSidebarStore = defineStore('sidebarStore', {
  state: (): SidebarState => ({
    isSidebarOpen: true,
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
