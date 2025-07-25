<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex flex-col lg:flex-row">
    <!-- Mobile toggle button -->
    <div v-if="!isSidebarOpen" class="lg:hidden bg-base-300 p-4 sticky top-[56px] z-40">
      <button
        class="rounded hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center"
        @click="toggleSidebar"
      >
        <Icon name="tabler:menu-2" size="28" />
      </button>
    </div>

    <div v-else class="lg:hidden bg-base-300 p-4 sticky top-[56px] z-40">
      <button
        class="rounded hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center"
        @click="toggleSidebar"
      >
        <Icon name="tabler:x" size="28" />
      </button>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      :class="{
        'opacity-100 pointer-events-auto': isSidebarOpen,
        'opacity-0 pointer-events-none': !isSidebarOpen,
      }"
      class="lg:hidden fixed top-[112px] inset-x-0 bottom-0 z-50 transition-all duration-300"
      style="background-color: rgba(0, 0, 0, 0.85);"
      @click="toggleSidebar"
    >
      <div
        :class="{
          'w-80': isSidebarOpen,
          'w-0': !isSidebarOpen,
        }"
        class="h-full bg-base-300 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
        @click.stop
      >
        <div
          class="flex-1 px-3 py-6 overflow-y-auto border-t border-gray-700/30 scrollbar-thin scrollbar-thumb-base-content/20 scrollbar-track-transparent"
        >
          <div class="flex flex-col gap-2">
            <SidebarButton
              :only-icon="false"
              href="/dashboard"
              icon="tabler:map"
              label="Locations"
              @click="toggleSidebar"
            />

            <SidebarButton
              :only-icon="false"
              href="/dashboard/add"
              icon="tabler:circle-plus-filled"
              label="Add Location"
              @click="toggleSidebar"
            />

            <div class="divider" />

            <SidebarButton
              :only-icon="false"
              href="/sign-out"
              icon="tabler:logout-2"
              label="Sign Out"
              @click="toggleSidebar"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      :class="{ 'lg:w-80': isSidebarOpen, 'lg:w-17': !isSidebarOpen }"
      class="hidden lg:flex flex-col bg-base-300 transition-all duration-300 sticky top-[56px] h-[calc(100vh-56px)]"
    >
      <div class="px-3 py-6 flex-shrink-0">
        <div
          :class="{ 'mx-auto': !isSidebarOpen, 'ml-auto': isSidebarOpen }"
          class="rounded mb-4 hover:cursor-pointer hover:bg-base-content/5 w-[28px] h-[28px] flex items-center justify-center flex-shrink-0"
          @click="toggleSidebar"
        >
          <Icon
            v-if="isSidebarOpen"
            name="tabler:chevron-left"
            size="28"
          />
          <Icon
            v-else
            name="tabler:chevron-right"
            size="28"
          />
        </div>
      </div>

      <div class="flex-1 px-3 relative">
        <div class="flex flex-col gap-4 pb-6">
          <SidebarButton
            :only-icon="!isSidebarOpen"
            href="/dashboard"
            icon="tabler:map"
            label="Locations"
          />

          <SidebarButton
            :only-icon="!isSidebarOpen"
            href="/dashboard/add"
            icon="tabler:circle-plus-filled"
            label="Add Location"
          />

          <div class="divider" />

          <SidebarButton
            :only-icon="!isSidebarOpen"
            href="/sign-out"
            icon="tabler:logout-2"
            label="Sign Out"
          />
        </div>
      </div>
    </div>

    <div class="flex-1 px-6 py-12">
      <NuxtPage />
    </div>
  </div>
</template>
