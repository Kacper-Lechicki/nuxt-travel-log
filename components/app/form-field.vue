<script lang="ts" setup>
defineProps<{
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'number';
  error?: string;
  noResize?: boolean;
  height?: number;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ $props.label }}
    </legend>

    <Field
      :as="($props.type && $props.type === 'textarea') ? 'textarea' : 'input'"
      :class="{
        'input-error': $props.error,
        'input': !$props.type || $props.type === 'text' || $props.type === 'number',
        'textarea': $props.type === 'textarea',
        'resize-none': $props.noResize,
      }"
      :disabled="$props.disabled"
      :name="$props.name"
      :style="{ height: $props.height ? `${$props.height}px` : undefined }"
      :type="$props.type || 'text'"
      class="w-full"
    />

    <p v-if="$props.error" class="fieldset-label text-error">
      {{ $props.error }}
    </p>
  </fieldset>
</template>

<style lang="scss" scoped></style>
