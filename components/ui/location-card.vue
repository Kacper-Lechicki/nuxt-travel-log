<script lang="ts" setup>
import type { Location } from '~/lib/db/schema';

defineProps<{
  location: Location;
}>();
</script>

<template>
  <div
    class="card card-compact bg-base-200 border border-gray-700/30 h-42"
  >
    <div class="card-body flex flex-col h-full">
      <h3
        :title="$props.location.name"
        class="text-xl font-bold truncate flex-shrink-0"
      >
        {{ $props.location.name }}
      </h3>

      <div class="flex-1 overflow-hidden">
        <p
          :title="$props.location.description"
          class="text-sm leading-relaxed description-text"
        >
          {{ $props.location.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.description-text {
  display: -webkit-box;
  max-height: calc(1.5rem * 3);
  line-clamp: 3;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
