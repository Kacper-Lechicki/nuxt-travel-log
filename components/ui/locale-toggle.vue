<script lang="ts" setup>
const { locale, setLocale } = useI18n();

const isEnglish = computed({
  get: () => locale.value === 'en',
  set: async (val: boolean) => {
    const newLocale = val ? 'en' : 'pl';
    await setLocale(newLocale);

    localStorage.setItem('lang', newLocale);
  },
});
</script>

<template>
  <label class="swap swap-rotate">
    <input v-model="isEnglish" type="checkbox">

    <Icon
      class="swap-on"
      name="circle-flags:uk"
      size="18"
    />

    <Icon
      class="swap-off"
      name="circle-flags:pl"
      size="18"
    />
  </label>
</template>
