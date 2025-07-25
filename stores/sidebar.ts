import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebarStore', () => {
  const isSidebarOpen = ref(true);

  onMounted(() => {
    isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
  });

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
  }

  return {
    isSidebarOpen,
    toggleSidebar,
  };
});
