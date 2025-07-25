<script lang="ts" setup>
defineProps<{
  title: string;
  hasDescription?: boolean;
  hasAdditional?: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-3xl font-medium">
      {{ $props.title }}
    </h2>

    <p v-if="$props.hasDescription" class="text-sm font-light">
      <slot name="description" />
    </p>

    <div v-if="$props.hasAdditional">
      <slot name="additional" />
    </div>
  </div>
</template>
