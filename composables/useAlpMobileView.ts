import { ref, onMounted } from 'vue';

/**
 * Reactive mobile breakpoint detection.
 *
 * Returns `isMobile` (true below 768px) and `hydrated` (true after
 * client-side mount — use to prevent SSR/client layout mismatch).
 */
export function useAlpMobileView() {
    const isMobile = ref(false);
    const hydrated = ref(false);

    onMounted(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        isMobile.value = mq.matches;
        hydrated.value = true;
        mq.addEventListener('change', (e) => (isMobile.value = e.matches));
    });

    return { isMobile, hydrated };
}
