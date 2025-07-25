<script lang="ts" setup>
import type { FetchError } from 'ofetch';

import { useForm } from 'vee-validate';

import { InsertLocation } from '~/lib/db/schema';

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
});

const router = useRouter();
const { $csrfFetch } = useNuxtApp();

const submitError = ref('');
const loading = ref(false);
const submitted = ref(false);

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    return window.confirm('Are you sure you want to leave? All unsaved changes will be lost.');
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = '';
    loading.value = true;

    await $csrfFetch('/api/locations', {
      method: 'post',
      body: values,
    });

    submitted.value = true;

    navigateTo('/dashboard');
  }
  catch (e) {
    const error = e as FetchError;
    setErrors(error.data);
    submitError.value = error.data?.statusMessage || 'An unknown error has occurred.';
  }
  finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container max-w-3xl mx-auto flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <h1 class="text-3xl font-medium">
        Add Location
      </h1>

      <p class="text-sm font-light">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest.
        <br>
        You can add specific times you visited this location after adding it.
      </p>
    </div>

    <div
      v-if="submitError"
      class="alert alert-error"
      role="alert"
    >
      <span>{{ submitError }}</span>
    </div>

    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <FormField
        :disabled="loading"
        :error="errors.name"
        label="Name"
        name="name"
      />

      <FormField
        :disabled="loading"
        :error="errors.description"
        :height="140"
        label="Description"
        name="description"
        no-resize
        type="textarea"
      />

      <FormField
        :disabled="loading"
        :error="errors.lat"
        label="Latitude"
        name="lat"
        type="number"
      />

      <FormField
        :disabled="loading"
        :error="errors.long"
        label="Longitude"
        name="long"
        type="number"
      />

      <div class="mt-3 flex justify-end gap-3">
        <button
          :disabled="loading"
          class="btn btn-outline btn-error"
          type="button"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="21" />
          <span>Cancel</span>
        </button>

        <button
          :disabled="loading"
          class="btn btn-primary"
          type="submit"
        >
          <span>Add</span>
          <span v-if="loading" class="loading loading-spinner loading-sm flex-shrink-0" />

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
