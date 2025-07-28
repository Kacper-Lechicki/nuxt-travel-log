<script lang="ts" setup>
type Props = {
  offset: number;
};

const props = defineProps<Props>();

let resizeObserver: ResizeObserver | null = null;

const carouselRef = ref<HTMLElement>();
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

onMounted(() => {
  if (carouselRef.value) {
    nextTick(checkScrollability);

    resizeObserver = new ResizeObserver(() => {
      checkScrollability();
    });

    resizeObserver.observe(carouselRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

function checkScrollability() {
  if (!carouselRef.value)
    return;

  const element = carouselRef.value;
  const scrollLeft = element.scrollLeft;
  const scrollWidth = element.scrollWidth;
  const clientWidth = element.clientWidth;

  canScrollLeft.value = scrollLeft > 5;
  canScrollRight.value = scrollLeft < (scrollWidth - clientWidth - 5);

  if (scrollWidth <= clientWidth) {
    canScrollLeft.value = false;
    canScrollRight.value = false;
  }
}

function handleScroll() {
  checkScrollability();
}

function scrollLeft() {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({
      left: -(props.offset),
      behavior: 'smooth',
    });
  }
}

function scrollRight() {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({
      left: props.offset,
      behavior: 'smooth',
    });
  }
}
</script>

<template>
  <div class="relative">
    <button
      v-if="canScrollLeft"
      class="scroll-btn hidden lg:flex items-center justify-center bg-neutral absolute left-3 top-1/2 -translate-y-1/2 z-100"
      @click="scrollLeft"
    >
      <Icon
        class="text-white"
        name="tabler:chevron-left"
        size="21"
      />
    </button>

    <div
      ref="carouselRef"
      class="overflow-x-auto scrollbar-hide"
      style="scroll-behavior: smooth;"
      @scroll="handleScroll"
    >
      <slot />
    </div>

    <button
      v-if="canScrollRight"
      class="scroll-btn hidden lg:flex items-center justify-center bg-neutral absolute right-3 top-1/2 -translate-y-1/2 z-100"
      @click="scrollRight"
    >
      <Icon
        class="text-white"
        name="tabler:chevron-right"
        size="21"
      />
    </button>
  </div>
</template>

<style lang="css" scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scroll-btn {
  width: 35px;
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
}
</style>
