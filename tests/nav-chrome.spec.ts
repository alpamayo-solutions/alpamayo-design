import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import AlpNavbar from '../components/alp/nav/AlpNavbar.vue';
import AlpIconRail from '../components/alp/nav/AlpIconRail.vue';
import AlpSidebar from '../components/alp/nav/AlpSidebar.vue';
import AlpMobileDrawer from '../components/alp/nav/AlpMobileDrawer.vue';
import type { NavSection } from '../components/alp/nav/AlpSidebar.vue';

// design.nav.* keys aren't in i18n/locales/*/design.json yet (Task A9 adds them) —
// stub the messages locally, same pattern used to test other useI18n()-driven
// components before their locale entries land (see tier2-batch-a.spec.ts,
// merged-components.spec.ts, table-shells.spec.ts).
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

afterEach(() => {
    vi.unstubAllGlobals();
});

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

describe('AlpNavbar', () => {
    it('renders brand, center, and actions slot content', () => {
        const w = mount(AlpNavbar, {
            props: { mobileMenuOpen: false },
            slots: {
                brand: '<span data-testid="brand-slot">Intelligence</span>',
                center: '<span data-testid="center-slot">Search…</span>',
                actions: '<span data-testid="actions-slot">Actions</span>'
            },
            global: globalConfig
        });
        expect(w.find('[data-testid="brand-slot"]').exists()).toBe(true);
        expect(w.find('[data-testid="center-slot"]').exists()).toBe(true);
        expect(w.find('[data-testid="actions-slot"]').exists()).toBe(true);
    });

    it('toggles mobileMenuOpen via the built-in mobile hamburger', async () => {
        const w = mount(AlpNavbar, { props: { mobileMenuOpen: false }, global: globalConfig });
        await w.find('[data-testid="navbar-mobile-toggle"]').trigger('click');
        expect(w.emitted('update:mobileMenuOpen')?.[0]).toEqual([true]);
    });

    it('toggles closed when already open', async () => {
        const w = mount(AlpNavbar, { props: { mobileMenuOpen: true }, global: globalConfig });
        await w.find('[data-testid="navbar-mobile-toggle"]').trigger('click');
        expect(w.emitted('update:mobileMenuOpen')?.[0]).toEqual([false]);
    });
});

describe('AlpIconRail', () => {
    it('renders one entry per section with icon and label', () => {
        const w = mount(AlpIconRail, { props: { sections }, global: globalConfig });
        const entries = w.findAll('[data-testid="icon-rail-item"]');
        expect(entries.length).toBe(3);
        expect(w.text()).toContain('Dashboard');
        expect(w.text()).toContain('Fleet');
        expect(w.find('.pi-home').exists()).toBe(true);
    });

    it('applies active styling to the section matching activeKey', () => {
        const w = mount(AlpIconRail, { props: { sections, activeKey: 'fleet' }, global: globalConfig });
        const entries = w.findAll('[data-testid="icon-rail-item"]');
        const fleetEntry = entries.find((e) => e.text().includes('Fleet'));
        expect(fleetEntry?.classes()).toContain('bg-white/20');
        const dashboardEntry = entries.find((e) => e.text().includes('Dashboard'));
        expect(dashboardEntry?.classes()).not.toContain('bg-white/20');
    });

    it('emits select with the section key when clicked', async () => {
        const w = mount(AlpIconRail, { props: { sections }, global: globalConfig });
        const entries = w.findAll('[data-testid="icon-rail-item"]');
        const fleetEntry = entries.find((e) => e.text().includes('Fleet'))!;
        await fleetEntry.trigger('click');
        expect(w.emitted('select')?.[0]).toEqual(['fleet']);
    });

    it('renders the footer slot pinned at the bottom', () => {
        const w = mount(AlpIconRail, {
            props: { sections },
            slots: { footer: '<span data-testid="rail-footer">Settings</span>' },
            global: globalConfig
        });
        expect(w.find('[data-testid="rail-footer"]').exists()).toBe(true);
    });
});

describe('AlpSidebar', () => {
    beforeEach(() => {
        // AlpSidebar calls useRoute() unconditionally (matching source), even though
        // every test here supplies `activePath` and never reads route.path.
        vi.stubGlobal('useRoute', () => ({ path: '/' }));
    });

    it('renders a direct NuxtLink for a section with no items', () => {
        const w = mount(AlpSidebar, {
            props: { sections, activePath: '/fleet/devices' },
            global: globalConfig
        });
        const link = w.find('a[href="/"]');
        expect(link.exists()).toBe(true);
        expect(link.text()).toContain('Dashboard');
    });

    it('renders an accordion header for a section with items and toggles it', async () => {
        const w = mount(AlpSidebar, { props: { sections, activePath: '/' }, global: globalConfig });
        expect(w.find('a[href="/fleet/devices"]').exists()).toBe(false);
        const fleetHeader = w
            .findAll('[data-testid="sidebar-section"]')
            .find((e) => e.text().includes('Fleet'))!;
        await fleetHeader.trigger('click');
        expect(w.find('a[href="/fleet/devices"]').exists()).toBe(true);
    });

    it('auto-expands and highlights the section/item matching activePath', async () => {
        const w = mount(AlpSidebar, { props: { sections, activePath: '/fleet/vpn' }, global: globalConfig });
        await nextTick();
        const vpnLink = w.find('a[href="/fleet/vpn"]');
        expect(vpnLink.exists()).toBe(true);
        expect(vpnLink.classes()).toContain('bg-primary-100');
        const devicesLink = w.find('a[href="/fleet/devices"]');
        expect(devicesLink.classes()).not.toContain('bg-primary-100');
    });

    it('renders item.badge via VoltBadge', async () => {
        const w = mount(AlpSidebar, { props: { sections, activePath: '/fleet/vpn' }, global: globalConfig });
        await nextTick();
        expect(w.find('.badge').text()).toBe('3');
    });

    it('supports the #item scoped slot as a row-rendering escape hatch', async () => {
        const w = mount(AlpSidebar, {
            props: { sections, activePath: '/fleet/devices' },
            slots: {
                item: '<template #item="{ item }"><div data-testid="custom-item">{{ item.label }}!!</div></template>'
            },
            global: globalConfig
        });
        await nextTick();
        expect(w.find('[data-testid="custom-item"]').exists()).toBe(true);
        expect(w.text()).toContain('Devices!!');
        expect(w.find('a[href="/fleet/devices"]').exists()).toBe(false);
    });

    it('renders the footer slot', () => {
        const w = mount(AlpSidebar, {
            props: { sections, activePath: '/' },
            slots: { footer: '<span data-testid="sidebar-footer">Settings</span>' },
            global: globalConfig
        });
        expect(w.find('[data-testid="sidebar-footer"]').exists()).toBe(true);
    });
});

describe('AlpMobileDrawer', () => {
    beforeEach(() => {
        vi.stubGlobal('useRoute', () => ({ path: '/fleet/devices' }));
    });

    it('renders nothing when closed and the panel + backdrop when open', () => {
        const closed = mount(AlpMobileDrawer, { props: { sections, open: false }, global: globalConfig });
        expect(closed.find('[data-testid="drawer-close"]').exists()).toBe(false);

        const open = mount(AlpMobileDrawer, { props: { sections, open: true }, global: globalConfig });
        expect(open.find('[data-testid="drawer-close"]').exists()).toBe(true);
        expect(open.find('[data-testid="drawer-backdrop"]').exists()).toBe(true);
    });

    it('emits update:open false when the backdrop is clicked', async () => {
        const w = mount(AlpMobileDrawer, { props: { sections, open: true }, global: globalConfig });
        await w.find('[data-testid="drawer-backdrop"]').trigger('click');
        expect(w.emitted('update:open')?.[0]).toEqual([false]);
    });

    it('emits update:open false when the close button is clicked', async () => {
        const w = mount(AlpMobileDrawer, { props: { sections, open: true }, global: globalConfig });
        await w.find('[data-testid="drawer-close"]').trigger('click');
        expect(w.emitted('update:open')?.[0]).toEqual([false]);
    });

    it('navigates and closes when a no-items section is clicked', async () => {
        vi.stubGlobal('navigateTo', vi.fn());
        const w = mount(AlpMobileDrawer, { props: { sections, open: true }, global: globalConfig });
        const dashboardSection = w
            .findAll('[data-testid="drawer-section"]')
            .find((e) => e.text().includes('Dashboard'))!;
        await dashboardSection.trigger('click');
        expect(navigateTo).toHaveBeenCalledWith('/');
        expect(w.emitted('update:open')?.[0]).toEqual([false]);
    });

    it('expands an items-section on click and renders its items as links', async () => {
        const w = mount(AlpMobileDrawer, { props: { sections, open: true }, global: globalConfig });
        expect(w.find('a[href="/fleet/devices"]').exists()).toBe(false);
        const fleetSection = w
            .findAll('[data-testid="drawer-section"]')
            .find((e) => e.text().includes('Fleet'))!;
        await fleetSection.trigger('click');
        expect(w.find('a[href="/fleet/devices"]').exists()).toBe(true);
    });

    it('renders the brand and footer slots', () => {
        const w = mount(AlpMobileDrawer, {
            props: { sections, open: true },
            slots: {
                brand: '<span data-testid="drawer-brand">Intelligence</span>',
                footer: '<span data-testid="drawer-footer">Settings</span>'
            },
            global: globalConfig
        });
        expect(w.find('[data-testid="drawer-brand"]').exists()).toBe(true);
        expect(w.find('[data-testid="drawer-footer"]').exists()).toBe(true);
    });
});
