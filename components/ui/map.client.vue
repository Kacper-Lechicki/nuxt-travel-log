<script lang="ts" setup>
import { CENTER_USA } from '~/lib/constants';

const colorMode = useColorMode();

const style = computed(() =>
  colorMode.value === 'dark' ? '/styles/dark.json' : 'https://tiles.openfreemap.org/styles/liberty');

const zoom = 2;
</script>

<template>
  <MglMap
    :center="CENTER_USA"
    :map-style="style"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
