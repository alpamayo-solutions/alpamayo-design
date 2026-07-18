import { computed } from 'vue';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Dark-mode state + toggle, backed by a `theme` cookie so the preference
 * survives across sessions (SSR-safe: the cookie value seeds shared state on
 * the server so first paint already carries `.dark`).
 *
 * Split out of intelligence's `use-layout.ts` — the mobile-breakpoint half of
 * that composable is superseded by `useAlpMobileView`, not carried over here.
 */
export function useAlpDarkMode() {
    const darkTheme = useState('darkTheme', () => false);
    const themeCookie = useCookie<string | null>('theme', {
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
        default: () => null
    });

    // Sync from cookie during SSR so server-rendered HTML includes .dark
    if (themeCookie.value === 'dark') {
        darkTheme.value = true;
    }

    const isDark = computed(() => darkTheme.value);

    function initDarkMode() {
        if (themeCookie.value === 'dark' || themeCookie.value === 'light') {
            darkTheme.value = themeCookie.value === 'dark';
        } else {
            darkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        document.documentElement.classList.toggle('dark', darkTheme.value);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!themeCookie.value) {
                darkTheme.value = e.matches;
                document.documentElement.classList.toggle('dark', e.matches);
            }
        });
    }

    function toggleDarkMode() {
        const next = !darkTheme.value;
        themeCookie.value = next ? 'dark' : 'light';
        darkTheme.value = next;
        document.documentElement.classList.toggle('dark', next);
    }

    return { isDark, toggleDarkMode, initDarkMode };
}
