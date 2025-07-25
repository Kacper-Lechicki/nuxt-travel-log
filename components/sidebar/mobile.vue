<script lang="ts" setup>
const sidebarStore = useSidebarStore();
</script>

<template>
  <aside
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
      <div
        class="flex-1 px-3 py-6 overflow-y-auto border-t border-gray-700/30 scrollbar-thin scrollbar-thumb-base-content/20 scrollbar-track-transparent"
      >
        <div class="flex flex-col gap-2">
          <SidebarButton
            :only-icon="false"
            href="/dashboard"
            icon="tabler:map"
            label="Locations"
            @click="sidebarStore.toggleSidebar"
          />

          <SidebarButton
            :only-icon="false"
            href="/dashboard/add"
            icon="tabler:circle-plus-filled"
            label="Add Location"
            @click="sidebarStore.toggleSidebar"
          />

          <div class="divider" />

          <SidebarButton
            :only-icon="false"
            href="/sign-out"
            icon="tabler:logout-2"
            label="Sign Out"
            @click="sidebarStore.toggleSidebar"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
