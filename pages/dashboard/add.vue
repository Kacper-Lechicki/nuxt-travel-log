<script lang="ts" setup>
import { useForm } from 'vee-validate';

import { InsertLocation } from '~/lib/db/schema';

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
});

const router = useRouter();
const locationsStore = useLocationsStore();

const submitted = ref(false);

onMounted(() => {
  locationsStore.error = null;
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    return window.confirm('Are you sure you want to leave? All unsaved changes will be lost.');
  }
});

const onSubmit = handleSubmit(async (values) => {
  const result = await locationsStore.add(values);

  if (result.success) {
    submitted.value = true;
    await navigateTo('/dashboard');
  }
  else if (result.validationErrors) {
    setErrors(result.validationErrors);
  }
});
</script>

<template>
  <div class="container max-w-3xl mx-auto flex flex-col gap-8">
    <UiTitleWithDescription :title="$t('PAGES.DASHBOARD_ADD.TITLE')" has-description>
      <template #description>
        <span>{{ $t('PAGES.DASHBOARD_ADD.DESCRIPTION_1') }}</span>
        <br>
        <span>{{ $t('PAGES.DASHBOARD_ADD.DESCRIPTION_2') }}</span>
      </template>
    </UiTitleWithDescription>

    <div
      v-if="locationsStore.error"
      class="alert alert-error"
      role="alert"
    >
      <span>{{ locationsStore.error }}</span>
    </div>

    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <FormField
        :disabled="locationsStore.isLoading"
        :error="errors.name"
        label="Name"
        name="name"
      />

      <FormField
        :disabled="locationsStore.isLoading"
        :error="errors.description"
        :height="140"
        label="Description"
        name="description"
        no-resize
        type="textarea"
      />

      <FormField
        :disabled="locationsStore.isLoading"
        :error="errors.lat"
        label="Latitude"
        name="lat"
        type="number"
      />

      <FormField
        :disabled="locationsStore.isLoading"
        :error="errors.long"
        label="Longitude"
        name="long"
        type="number"
      />

      <div class="mt-3 flex justify-end gap-3">
        <button
          :disabled="locationsStore.isLoading"
          class="btn btn-outline btn-error"
          type="button"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="21" />
          <span>{{ $t('PAGES.DASHBOARD_ADD.CANCEL_BUTTON') }}</span>
        </button>

        <button
          :disabled="locationsStore.isLoading"
          class="btn btn-primary"
          type="submit"
        >
          <span>{{ $t('PAGES.DASHBOARD_ADD.SUBMIT_BUTTON') }}</span>

          <span
            v-if="locationsStore.isLoading"
            class="loading loading-spinner loading-sm flex-shrink-0"
          />

          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="21"
          />
        </button>
      </div>
    </form>
  </div>
</template>
