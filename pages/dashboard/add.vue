<script lang="ts" setup>
import { useForm } from 'vee-validate';

import { CENTER_USA } from '~/lib/constants';
import { InsertLocation } from '~/lib/db/schema';

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: '',
    description: '',
    long: (CENTER_USA[0]),
    lat: (CENTER_USA[1]),
  },
});

const router = useRouter();
const mapStore = useMapStore();
const locationsStore = useLocationsStore();

const { t } = useI18n();

const submitted = ref(false);

onMounted(() => {
  locationsStore.error = null;

  mapStore.addedPoint = {
    id: 1,
    long: CENTER_USA[0],
    lat: CENTER_USA[1],
    description: '',
    name: 'Added Point',
  };
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    mapStore.addedPoint = null;

    // eslint-disable-next-line no-alert
    return window.confirm('Are you sure you want to leave? All unsaved changes will be lost.');
  }

  mapStore.addedPoint = null;
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

function formatNumber(value: number) {
  return value.toFixed(5);
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue('long', mapStore.addedPoint.long);
    setFieldValue('lat', mapStore.addedPoint.lat);
  }
});
</script>

<template>
  <div class="px-6 lg:px-12 py-12 container mx-auto flex flex-col gap-9">
    <div
      v-if="locationsStore.error"
      class="alert alert-error break-all"
      role="alert"
    >
      <span>{{ locationsStore.error }}</span>
    </div>

    <div class="flex flex-col 2xl:flex-row gap-12">
      <div class="flex flex-col gap-9 2xl:max-w-1/2">
        <UiTitleWithDescription :title="t('PAGES.DASHBOARD_ADD.TITLE')" has-description>
          <template #description>
            <span>{{ t('PAGES.DASHBOARD_ADD.DESCRIPTION_1') }}</span>
            <br>
            <br>
            <span>{{ t('PAGES.DASHBOARD_ADD.DESCRIPTION_2') }}</span>
          </template>
        </UiTitleWithDescription>

        <form class="flex flex-col gap-3 flex-1/2" @submit.prevent="onSubmit">
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

          <p class="mt-3">
            <span>{{ t('PAGES.ADD.DRAG_MARKER_1') }}</span>

            <Icon
              class="text-warning"
              name="tabler:map-pin-filled"
            />

            <span>{{ t('PAGES.ADD.DRAG_MARKER_2') }}</span>
            <br>
            <span class="text-xs">{{ t('PAGES.ADD.OR_DOUBLE_CLICK') }}</span>
          </p>

          <p class="text-xs opacity-55 font-medium">
            <span>{{ t('PAGES.ADD.CURRENT_LOCATION') }}</span>: {{ formatNumber(controlledValues.lat || 0) }}, {{ formatNumber(controlledValues.long || 0) }}
          </p>

          <div class="mt-3 flex justify-end gap-3">
            <button
              :disabled="locationsStore.isLoading"
              class="btn btn-outline btn-error"
              type="button"
              @click="router.back()"
            >
              <Icon name="tabler:arrow-left" size="21" />
              <span>{{ t('PAGES.DASHBOARD_ADD.CANCEL_BUTTON') }}</span>
            </button>

            <button
              :disabled="locationsStore.isLoading"
              class="btn btn-primary"
              type="submit"
            >
              <span>{{ t('PAGES.DASHBOARD_ADD.SUBMIT_BUTTON') }}</span>

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

      <div
        class="rounded overflow-hidden mx-auto min-h-[250px] min-w-[100%] sm:min-h-[500px] md:min-h-[575px] 2xl:min-w-[575px] flex-1/2"
      >
        <UiMap />
      </div>
    </div>
  </div>
</template>
