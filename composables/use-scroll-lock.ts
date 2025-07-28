import { onUnmounted, readonly, ref, watch } from 'vue';

export function useScrollLock() {
  const isLocked = ref(false);
  let originalScrollY = 0;

  function lockScroll() {
    if (isLocked.value || typeof window === 'undefined')
      return;

    originalScrollY = window.scrollY;

    document.body.style.cssText = `
      position: fixed;
      top: -${originalScrollY}px;
      width: 100%;
      overflow: hidden;
    `;

    isLocked.value = true;
  }

  function unlockScroll() {
    if (!isLocked.value || typeof window === 'undefined')
      return;

    document.body.style.cssText = '';
    window.scrollTo(0, originalScrollY);

    isLocked.value = false;
  }

  function toggleScrollLock(shouldLock: boolean) {
    shouldLock ? lockScroll() : unlockScroll();
  }

  onUnmounted(unlockScroll);

  return {
    isLocked: readonly(isLocked),
    lockScroll,
    unlockScroll,
    toggleScrollLock,
  };
}

export function useScrollLockWatch(condition: Ref) {
  const { toggleScrollLock, ...scrollLock } = useScrollLock();

  watch(condition, toggleScrollLock, { immediate: true });

  return { toggleScrollLock, ...scrollLock };
}
