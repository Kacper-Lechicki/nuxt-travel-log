<script lang="ts" setup>
const props = defineProps<{
  variant?: 'desktop' | 'mobile';
}>();

const sidebarStore = useSidebarStore();

const variant = computed(() => props.variant || 'desktop');
const isDesktop = computed(() => variant.value === 'desktop');
const isMobile = computed(() => variant.value === 'mobile');

onMounted(() => {
  sidebarStore.setSidebarValueFromLocalStorage();
});

const topMenuItems = [
  { href: '/dashboard', icon: 'tabler:map', label: 'Locations' },
  { href: '/dashboard/add', icon: 'tabler:circle-plus-filled', label: 'Add Location' },
];

const bottomMenuItems = [
  { href: '/sign-out', icon: 'tabler:logout-2', label: 'Sign Out' },
];

function handleMobileClick() {
  if (isMobile.value) {
    sidebarStore.toggleSidebar();
  }
}
</script>

<template>
  <aside
    v-if="isDesktop"
    :class="{
      'lg:w-80': sidebarStore.isSidebarOpen,
      'lg:w-17': !sidebarStore.isSidebarOpen,
    }"
    class="hidden lg:flex flex-col bg-base-300 transition-all duration-300 sticky top-[56px] h-[calc(100vh-56px)] z-[100]"
  >
    <SidebarContent
      :bottom-items="bottomMenuItems"
      :is-open="sidebarStore.isSidebarOpen"
      :show-toggle="true"
      :top-items="topMenuItems"
      @toggle="sidebarStore.toggleSidebar"
    />
  </aside>

  <aside
    v-else
    :class="{
      'opacity-100 pointer-events-auto': sidebarStore.isSidebarOpen,
      'opacity-0 pointer-events-none': !sidebarStore.isSidebarOpen,
    }"
    class="lg:hidden fixed top-[112px] inset-x-0 bottom-0 z-50 transition-all duration-300"
    style="background-color: rgba(0, 0, 0, 0.85);"
    @click="sidebarStore.toggleSidebar"
  >
    <div
      :class="{
        'w-80': sidebarStore.isSidebarOpen,
        'w-0': !sidebarStore.isSidebarOpen,
      }"
      class="h-full bg-base-300 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
      @click.stop
    >
      <SidebarContent
        :bottom-items="bottomMenuItems"
        :is-open="true"
        :mobile-mode="true"
        :show-toggle="false"
        :top-items="topMenuItems"
        @item-click="handleMobileClick"
      />
    </div>
  </aside>
</template>
