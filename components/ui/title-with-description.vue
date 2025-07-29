<script lang="ts" setup>
type Props = {
  title: string;
  hasDescription?: boolean;
  hasAdditional?: boolean;
};

const props = defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-2xl md:text-3xl font-medium">
      {{ props.title }}
    </h2>

    <p v-if="props.hasDescription" class="text-sm">
      <slot name="description" />
    </p>

    <div v-if="props.hasAdditional">
      <slot name="additional" />
    </div>
  </div>
</template>
