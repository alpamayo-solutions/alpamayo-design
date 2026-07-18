import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import AlpAppShell from '../components/alp/nav/AlpAppShell.vue';
import type { NavSection } from '../components/alp/nav/AlpSidebar.vue';

// design.nav.* keys aren't in i18n/locales/*/design.json yet (Task A9 adds them) — stub
// locally, same pattern as tests/nav-chrome.spec.ts.
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            design: {
                nav: {
                    toggleMenu: 'Toggle navigation',
                    closeDrawer: 'Close navigation'
                }
            }
        }
    }
});

const VoltButtonStub = {
    props: ['label', 'icon', 'ariaLabel'],
    emits: ['click'],
    template:
        '<button type="button" :aria-label="$attrs[\'aria-label\']" @click="$emit(\'click\')"><slot />{{ label }}</button>'
};
const VoltBadgeStub = { props: ['value', 'severity'], template: '<span class="badge">{{ value }}</span>' };
const NuxtLinkStub = { props: ['to'], template: '<a :href="to"><slot /></a>' };

const globalConfig = {
    plugins: [i18n],
    components: { VoltButton: VoltButtonStub, VoltBadge: VoltBadgeStub, NuxtLink: NuxtLinkStub },
    stubs: { teleport: true }
};

const sections: NavSection[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', to: '/', items: [] },
    {
        key: 'fleet',
        label: 'Fleet',
        icon: 'pi pi-server',
        items: [
            { key: 'devices', label: 'Devices', icon: 'pi pi-box', to: '/fleet/devices' },
            { key: 'vpn', label: 'VPN', icon: 'pi pi-globe', to: '/fleet/vpn', badge: 3 }
        ]
    },
    {
        key: 'projects',
        label: 'Projects',
        icon: 'pi pi-folder',
        items: [{ key: 'active', label: 'Active', icon: 'pi pi-check', to: '/projects/active' }]
    }
];

beforeEach(() => {
    vi.stubGlobal('useRoute', () => ({ path: '/' }));
    vi.stubGlobal('navigateTo', vi.fn());
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('AlpAppShell', () => {
    it('renders all four nav-chrome parts with the passed sections', () => {
        const w = mount(AlpAppShell, { props: { sections }, global: globalConfig });
        // AlpIconRail
        expect(w.findAll('[data-testid="icon-rail-item"]').length).toBe(3);
        // AlpSidebar
        expect(w.findAll('[data-testid="sidebar-section"]').length).toBe(3);
        // AlpNavbar (mobile hamburger is the built-in, always-rendered affordance)
        expect(w.find('[data-testid="navbar-mobile-toggle"]').exists()).toBe(true);
        // AlpMobileDrawer (teleported, but stubbed teleport keeps it in the tree)
        expect(w.find('[data-testid="drawer-backdrop"]').exists()).toBe(false); // closed by default
    });

    it('renders default slot content in the main content panel', () => {
        const w = mount(AlpAppShell, {
            props: { sections },
            slots: { default: '<p data-testid="page-content">Placeholder page content</p>' },
            global: globalConfig
        });
        const main = w.find('main');
        expect(main.exists()).toBe(true);
        expect(main.find('[data-testid="page-content"]').exists()).toBe(true);
    });

    it('opens the mobile drawer when the navbar hamburger is clicked', async () => {
        const w = mount(AlpAppShell, { props: { sections }, global: globalConfig });
        expect(w.find('[data-testid="drawer-backdrop"]').exists()).toBe(false);
        await w.find('[data-testid="navbar-mobile-toggle"]').trigger('click');
        await nextTick();
        expect(w.find('[data-testid="drawer-backdrop"]').exists()).toBe(true);
        expect(w.find('[data-testid="drawer-close"]').exists()).toBe(true);
    });

    it('renders #navbar-actions slot content', () => {
        const w = mount(AlpAppShell, {
            props: { sections },
            slots: { 'navbar-actions': '<span data-testid="actions-slot">Actions</span>' },
            global: globalConfig
        });
        expect(w.find('[data-testid="actions-slot"]').exists()).toBe(true);
    });

    it('renders #navbar-brand and #navbar-center slot content', () => {
        const w = mount(AlpAppShell, {
            props: { sections },
            slots: {
                'navbar-brand': '<span data-testid="brand-slot">Acme</span>',
                'navbar-center': '<span data-testid="center-slot">Search…</span>'
            },
            global: globalConfig
        });
        expect(w.find('[data-testid="brand-slot"]').exists()).toBe(true);
        expect(w.find('[data-testid="center-slot"]').exists()).toBe(true);
    });

    it('forwards #navbar-brand content into the mobile drawer brand slot too', async () => {
        const w = mount(AlpAppShell, {
            props: { sections },
            slots: { 'navbar-brand': '<span data-testid="brand-slot">Acme</span>' },
            global: globalConfig
        });
        await w.find('[data-testid="navbar-mobile-toggle"]').trigger('click');
        await nextTick();
        expect(w.findAll('[data-testid="brand-slot"]').length).toBe(2);
    });

    it('renders #sidebar-footer and #drawer-footer slot content in their respective parts', async () => {
        const w = mount(AlpAppShell, {
            props: { sections },
            slots: {
                'sidebar-footer': '<span data-testid="sidebar-footer-slot">Settings</span>',
                'drawer-footer': '<span data-testid="drawer-footer-slot">Settings</span>'
            },
            global: globalConfig
        });
        expect(w.find('[data-testid="sidebar-footer-slot"]').exists()).toBe(true);
        await w.find('[data-testid="navbar-mobile-toggle"]').trigger('click');
        await nextTick();
        expect(w.find('[data-testid="drawer-footer-slot"]').exists()).toBe(true);
    });

    it('defaults railSections to sections when railSections is not passed', () => {
        const w = mount(AlpAppShell, { props: { sections }, global: globalConfig });
        const railEntries = w.findAll('[data-testid="icon-rail-item"]');
        expect(railEntries.map((e) => e.text())).toEqual(
            expect.arrayContaining([expect.stringContaining('Dashboard'), expect.stringContaining('Fleet')])
        );
    });

    it('uses a distinct railSections prop when provided', () => {
        const railSections: NavSection[] = [
            { key: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', to: '/', items: [] }
        ];
        const w = mount(AlpAppShell, { props: { sections, railSections }, global: globalConfig });
        expect(w.findAll('[data-testid="icon-rail-item"]').length).toBe(1);
        expect(w.findAll('[data-testid="sidebar-section"]').length).toBe(3);
    });

    it('renders no icon rail when railSections is empty', () => {
        const w = mount(AlpAppShell, { props: { sections, railSections: [] }, global: globalConfig });
        expect(w.findAll('[data-testid="icon-rail-item"]').length).toBe(0);
        expect(w.find('[data-testid="icon-rail"]').exists()).toBe(false);
        expect(w.findAll('[data-testid="sidebar-section"]').length).toBe(3);
    });

    it('expands the matching sidebar section when a rail item without a direct match is selected', async () => {
        const w = mount(AlpAppShell, { props: { sections }, global: globalConfig });
        expect(w.find('a[href="/fleet/devices"]').exists()).toBe(false);
        const fleetRailEntry = w
            .findAll('[data-testid="icon-rail-item"]')
            .find((e) => e.text().includes('Fleet'))!;
        await fleetRailEntry.trigger('click');
        await nextTick();
        expect(w.find('a[href="/fleet/devices"]').exists()).toBe(true);
    });
});
