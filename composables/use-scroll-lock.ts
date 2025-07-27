export function useScrollLock() {
  const isLocked = ref(false);
  let originalScrollY = 0;

  function getScrollY(): number {
    if (typeof window === 'undefined')
      return 0;

    return window.scrollY ?? window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;
  }

  function lockScroll() {
    if (isLocked.value || typeof window === 'undefined')
      return;

    originalScrollY = getScrollY();

    document.body.style.position = 'fixed';
    document.body.style.top = `-${originalScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    isLocked.value = true;
  }

  function unlockScroll() {
    if (!isLocked.value || typeof window === 'undefined')
      return;

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    if (window.scrollTo) {
      window.scrollTo(0, originalScrollY);
    }
    else if (document.documentElement.scrollTop !== undefined) {
      document.documentElement.scrollTop = originalScrollY;
    }
    else if (document.body.scrollTop !== undefined) {
      document.body.scrollTop = originalScrollY;
    }

    isLocked.value = false;
  }

  function toggleScrollLock(shouldLock: boolean) {
    if (shouldLock) {
      lockScroll();
    }
    else {
      unlockScroll();
    }
  }

  onUnmounted(() => {
    if (isLocked.value) {
      unlockScroll();
    }
  });

  return {
    isLocked: readonly(isLocked),
    lockScroll,
    unlockScroll,
    toggleScrollLock,
  };
}

export function useScrollLockWatch(condition: Ref<boolean>) {
  const scrollLock = useScrollLock();

  watch(
    condition,
    (shouldLock) => {
      scrollLock.toggleScrollLock(shouldLock);
    },
    { immediate: true },
  );

  return scrollLock;
}
