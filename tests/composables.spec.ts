import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useAlpPlural } from '../composables/useAlpPlural';
import { useAlpExportCsv } from '../composables/useAlpExportCsv';
import { useAlpMarkdown } from '../composables/useAlpMarkdown';
import { useAlpMobileView } from '../composables/useAlpMobileView';
import { useAlpAnchoredDropdown } from '../composables/useAlpAnchoredDropdown';
import { useAlpDarkMode } from '../composables/useAlpDarkMode';
import { useAlpBlurSensitive } from '../composables/useAlpBlurSensitive';

// useCookie/useState are Nuxt auto-imports (bare globals, like `navigateTo`
// elsewhere in this package — see tests/table-shells.spec.ts). Stub them with
// real Vue refs so computed()s built on top of the stubbed state track
// correctly, the same way the real Nuxt composables behave.
function stubNuxtState() {
    const cookies = new Map<string, ReturnType<typeof ref>>();
    const states = new Map<string, ReturnType<typeof ref>>();
    vi.stubGlobal(
        'useCookie',
        vi.fn((key: string, opts?: { default?: () => unknown }) => {
            if (!cookies.has(key)) cookies.set(key, ref(opts?.default ? opts.default() : undefined));
            return cookies.get(key);
        })
    );
    vi.stubGlobal(
        'useState',
        vi.fn((key: string, init: () => unknown) => {
            if (!states.has(key)) states.set(key, ref(init()));
            return states.get(key);
        })
    );
    return { cookies, states };
}

// Mounts a throwaway component so onMounted/onBeforeUnmount lifecycle hooks
// inside the composable actually fire (calling a composable bare, outside a
// component's setup(), is a no-op for lifecycle hooks).
function withSetup<T>(composable: () => T) {
    let result!: T;
    const wrapper = mount(
        defineComponent({
            setup() {
                result = composable();
                return () => null;
            }
        })
    );
    return { result, wrapper };
}

describe('useAlpPlural', () => {
    it('returns singular for count 1', () => {
        const { plural } = useAlpPlural();
        expect(plural(1, 'gap')).toBe('gap');
    });

    it('appends s for count != 1', () => {
        const { plural } = useAlpPlural();
        expect(plural(2, 'gap')).toBe('gaps');
        expect(plural(0, 'gap')).toBe('gaps');
    });

    it('uses explicit plural form when provided', () => {
        const { plural } = useAlpPlural();
        expect(plural(2, 'foot', 'feet')).toBe('feet');
        expect(plural(1, 'foot', 'feet')).toBe('foot');
    });
});

describe('useAlpExportCsv', () => {
    let blobs: Blob[];

    beforeEach(() => {
        blobs = [];
        vi.spyOn(URL, 'createObjectURL').mockImplementation((b: Blob | MediaSource) => {
            blobs.push(b as Blob);
            return 'blob:mock';
        });
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('escapes commas, quotes, and newlines', async () => {
        const { exportCsv } = useAlpExportCsv();
        exportCsv([{ a: 'x,y', b: 'has "quote"', c: 'line1\nline2' }], 'test');
        expect(blobs).toHaveLength(1);
        const text = await blobs[0]!.text();
        expect(text).toBe('a,b,c\n"x,y","has ""quote""","line1\nline2"');
    });

    it('leaves plain values unquoted', async () => {
        const { exportCsv } = useAlpExportCsv();
        exportCsv([{ name: 'edge-01', count: 3 }], 'test');
        const text = await blobs[0]!.text();
        expect(text).toBe('name,count\nedge-01,3');
    });

    it('does nothing for empty data', () => {
        const { exportCsv } = useAlpExportCsv();
        exportCsv([], 'test');
        expect(blobs).toHaveLength(0);
    });
});

describe('useAlpMarkdown', () => {
    it('renders basic markdown to HTML', () => {
        const { renderMarkdown } = useAlpMarkdown();
        expect(renderMarkdown('**bold** and *italic*')).toContain('<strong>bold</strong>');
    });

    it('strips <script> tags via DOMPurify', () => {
        const { renderMarkdown } = useAlpMarkdown();
        const out = renderMarkdown('hello <script>alert(1)</script> world');
        expect(out).not.toContain('<script>');
        expect(out).not.toContain('alert(1)');
    });

    it('renderHtml keeps allowed tags and strips <script> content', () => {
        const { renderHtml } = useAlpMarkdown();
        expect(renderHtml('<div>ok</div>')).toContain('ok');
        const withScript = renderHtml('<script>alert(1)</script>');
        expect(withScript).not.toContain('<script>');
        expect(withScript).not.toContain('alert(1)');
    });

    it('renderContent routes raw HTML through renderHtml (no markdown escaping)', () => {
        const { renderContent } = useAlpMarkdown();
        // isHtmlContent() detects the leading `<div` and skips markdown parsing —
        // an underscore here would become <em> if it were (wrongly) run through marked.
        expect(renderContent('<div>raw_html</div>')).toContain('raw_html');
        expect(renderContent('<div>raw_html</div>')).not.toContain('<em>');
    });

    it('renderContent routes markdown through renderMarkdown', () => {
        const { renderContent } = useAlpMarkdown();
        expect(renderContent('# heading')).toContain('heading');
    });

    it('returns empty string for empty input', () => {
        const { renderMarkdown, renderHtml, renderContent } = useAlpMarkdown();
        expect(renderMarkdown('')).toBe('');
        expect(renderHtml('')).toBe('');
        expect(renderContent('')).toBe('');
    });
});

describe('useAlpMobileView', () => {
    function stubMatchMedia(matches: boolean) {
        const listeners: Array<(e: { matches: boolean }) => void> = [];
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query: string) => ({
                media: query,
                matches,
                addEventListener: vi.fn((_: string, cb: (e: { matches: boolean }) => void) => {
                    listeners.push(cb);
                }),
                removeEventListener: vi.fn()
            }))
        );
        return listeners;
    }

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('reflects the initial matchMedia result after mount', async () => {
        stubMatchMedia(true);
        const { result } = withSetup(() => useAlpMobileView());
        await nextTick();
        expect(result.isMobile.value).toBe(true);
        expect(result.hydrated.value).toBe(true);
    });

    it('updates isMobile when the media query changes', async () => {
        const listeners = stubMatchMedia(false);
        const { result } = withSetup(() => useAlpMobileView());
        await nextTick();
        expect(result.isMobile.value).toBe(false);
        listeners.forEach((cb) => cb({ matches: true }));
        expect(result.isMobile.value).toBe(true);
    });
});

describe('useAlpAnchoredDropdown', () => {
    it('opens and closes via toggle()', async () => {
        const { result } = withSetup(() => useAlpAnchoredDropdown());
        expect(result.open.value).toBe(false);
        result.toggle();
        await nextTick();
        expect(result.open.value).toBe(true);
        result.toggle();
        expect(result.open.value).toBe(false);
    });

    it('closes on Escape while open', async () => {
        const { result } = withSetup(() => useAlpAnchoredDropdown());
        result.toggle();
        await nextTick();
        expect(result.open.value).toBe(true);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(result.open.value).toBe(false);
    });

    it('close() sets open to false directly', () => {
        const { result } = withSetup(() => useAlpAnchoredDropdown());
        result.toggle();
        expect(result.open.value).toBe(true);
        result.close();
        expect(result.open.value).toBe(false);
    });
});

describe('useAlpDarkMode', () => {
    beforeEach(() => {
        stubNuxtState();
        document.documentElement.classList.remove('dark');
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query: string) => ({
                media: query,
                matches: false,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }))
        );
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        document.documentElement.classList.remove('dark');
    });

    it('starts light with no cookie and toggles to dark', () => {
        const { isDark, toggleDarkMode } = useAlpDarkMode();
        expect(isDark.value).toBe(false);
        toggleDarkMode();
        expect(isDark.value).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('toggles back to light', () => {
        const { isDark, toggleDarkMode } = useAlpDarkMode();
        toggleDarkMode();
        toggleDarkMode();
        expect(isDark.value).toBe(false);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('initDarkMode honors an existing "dark" cookie', () => {
        vi.stubGlobal(
            'useCookie',
            vi.fn(() => ref('dark'))
        );
        const { isDark, initDarkMode } = useAlpDarkMode();
        initDarkMode();
        expect(isDark.value).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
});

describe('useAlpBlurSensitive', () => {
    let store: ReturnType<typeof stubNuxtState>;

    beforeEach(() => {
        store = stubNuxtState();
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('starts unblurred with no cookie', () => {
        const { blurMode } = useAlpBlurSensitive();
        expect(blurMode.value).toBe(false);
    });

    it('toggle() flips state and persists to the cookie', () => {
        const { blurMode, toggle } = useAlpBlurSensitive();
        toggle();
        expect(blurMode.value).toBe(true);
        expect(store.cookies.get('blur-sensitive')?.value).toBe(true);
        toggle();
        expect(blurMode.value).toBe(false);
        expect(store.cookies.get('blur-sensitive')?.value).toBe(false);
    });
});
