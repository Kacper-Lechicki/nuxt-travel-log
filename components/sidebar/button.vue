<script lang="ts" setup>
import { computed, ref } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  onlyIcon: boolean;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const route = useRoute();
const buttonRef = ref<HTMLElement | null>(null);
const showTooltip = ref(false);
const isActive = computed(() => route.path === props.href);

const linkClasses = computed(() => ({
  'bg-base-100 border-gray-700/100': isActive.value,
  'justify-center': props.onlyIcon,
}));

function handleClick(event: MouseEvent) {
  emit('click', event);
}

function handleMouseEnter() {
  if (!props.onlyIcon)
    return;

  showTooltip.value = true;
}

function handleMouseLeave() {
  if (!props.onlyIcon)
    return;

  showTooltip.value = false;
}
</script>

<template>
  <div
    ref="buttonRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <NuxtLink
      :class="linkClasses"
      :to="props.href"
      class="flex flex-nowrap justify-start font-medium gap-3 p-2 border border-gray-700/30 rounded hover:bg-base-content/5 h-11 hover:cursor-pointer overflow-hidden transition-colors duration-200"
      @click="handleClick"
    >
      <Icon
        :name="props.icon"
        class="flex-shrink-0"
        size="21"
      />

      <Transition name="grow">
        <span v-if="!props.onlyIcon" class="flex-shrink-0">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>

  <UiTooltip
    :show="showTooltip"
    :target-element="buttonRef"
    :text="props.label"
  />
</template>

<style scoped>
.grow-enter-active,
.grow-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
}

.grow-enter-from,
.grow-leave-to {
  opacity: 0;
  transform: scaleX(0);
  width: 0;
}
</style>
