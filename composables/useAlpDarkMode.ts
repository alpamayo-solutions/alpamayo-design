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

    // `.light` stops the prefers-color-scheme token block in tokens.css when someone chose light on a dark OS.
    function setThemeClass(dark: boolean) {
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.classList.toggle('light', !dark);
    }

    function initDarkMode() {
        if (themeCookie.value === 'dark' || themeCookie.value === 'light') {
            darkTheme.value = themeCookie.value === 'dark';
        } else {
            darkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        setThemeClass(darkTheme.value);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!themeCookie.value) {
                darkTheme.value = e.matches;
                setThemeClass(e.matches);
            }
        });
    }

    function toggleDarkMode() {
        const next = !darkTheme.value;
        themeCookie.value = next ? 'dark' : 'light';
        darkTheme.value = next;
        setThemeClass(next);
    }

    return { isDark, toggleDarkMode, initDarkMode };
}
