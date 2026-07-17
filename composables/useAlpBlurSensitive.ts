import { computed } from 'vue';

/**
 * Toggle to blur sensitive customer data during screen sharing / demos.
 *
 * Adds `.blur-mode` class to `<html>`. Any element with `class="sensitive"`
 * will be blurred via CSS. State persists in a cookie.
 */
export function useAlpBlurSensitive() {
    const cookie = useCookie<boolean>('blur-sensitive', {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        default: () => false
    });
    const blurMode = useState('blurMode', () => !!cookie.value);

    if (import.meta.client) {
        document.documentElement.classList.toggle('blur-mode', blurMode.value);
    }

    function toggle() {
        const next = !blurMode.value;
        blurMode.value = next;
        cookie.value = next;
        if (import.meta.client) {
            document.documentElement.classList.toggle('blur-mode', next);
        }
    }

    return { blurMode: computed(() => blurMode.value), toggle };
}
