<script lang="ts" setup>
import { useScrollLockWatch } from '@/composables/use-scroll-lock';
import { useBreakpoints } from '~/composables/use-breakpoints';

const sidebarStore = useSidebarStore();

const { isMobile, isDesktop } = useBreakpoints();

const topMenuItems = [
  { href: '/dashboard', icon: 'tabler:map', name: 'Locations' },
  { href: '/dashboard/add', icon: 'tabler:circle-plus-filled', name: 'Add Location' },
];

const bottomMenuItems = [
  { href: '/sign-out', icon: 'tabler:logout-2', name: 'Sign Out' },
];

const shouldLockScroll = computed(() => {
  return isMobile.value && sidebarStore.isSidebarOpen;
});

onMounted(() => {
  sidebarStore.setSidebarValueFromLocalStorage();
});

function handleMobileClick() {
  if (isMobile.value) {
    sidebarStore.toggleSidebar();
  }
}

useScrollLockWatch(shouldLockScroll);
</script>

<template>
  <aside
    v-if="isDesktop"
    :class="{
      'lg:w-80': sidebarStore.isSidebarOpen,
      'lg:w-17': !sidebarStore.isSidebarOpen,
    }"
    class="flex flex-col bg-base-300 transition-all duration-300 sticky top-[56px] h-[calc(100vh-56px)] z-[100]"
  >
    <AppSidebarContent
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
    class="fixed top-[112px] inset-x-0 bottom-0 z-50 transition-all duration-300"
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
      <AppSidebarContent
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
