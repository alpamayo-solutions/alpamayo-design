import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AlpSidebar from '../components/alp/nav/AlpSidebar.vue';
import AlpIconRail from '../components/alp/nav/AlpIconRail.vue';
import AlpEntityRow from '../components/alp/AlpEntityRow.vue';
import AlpStatTile from '../components/alp/AlpStatTile.vue';
import AlpEmptySection from '../components/alp/AlpEmptySection.vue';
import AlpFeed from '../components/alp/AlpFeed.vue';
import type { NavSection } from '../components/alp/nav/AlpSidebar.vue';
import { RouterLink } from './stubs/router-components';

/**
 * Regression tests for the "inert <nuxtlink>" production bug, in the shape it
 * takes outside Nuxt.
 *
 * Every link here used to be a literal `<NuxtLink>` tag. That resolves only
 * through Nuxt's compile-time component auto-import, so a plain Vue 3 + Vite
 * consumer got an inert `<nuxtlink>` element with no href — every CTA looked
 * right and did nothing. These components now go through `AlpLink`, which
 * resolves a globally registered `RouterLink` at runtime and otherwise renders
 * a plain anchor.
 *
 * The mounts below therefore register NO link component at all: that is exactly
 * the non-Nuxt consumer, and the assertions fail against any build that renders
 * an unresolved custom element instead of a real `<a href>`. The last block
 * registers a `RouterLink` and asserts AlpLink prefers it, so SPA navigation is
 * not silently downgraded to a full page load wherever a router does exist.
 */

const VoltBadgeStub = { props: ['value', 'severity'], template: '<span class="badge">{{ value }}</span>' };

const globalConfig = {
    components: { VoltBadge: VoltBadgeStub }
};

const sections: NavSection[] = [
    {
        key: 'fleet',
        label: 'Fleet',
        icon: 'pi pi-server',
        items: [{ key: 'devices', label: 'Devices', icon: 'pi pi-box', to: '/fleet/devices' }]
    },
    { key: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', to: '/', items: [] }
];

describe('link resolution without Nuxt (regression)', () => {
    beforeEach(() => {
        vi.stubGlobal('useRoute', () => ({ path: '/' }));
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('AlpSidebar renders a child item with `to` as a real <a href> anchor', async () => {
        const w = mount(AlpSidebar, {
            props: { sections, activePath: '/fleet/devices' },
            global: globalConfig
        });
        await nextTick();
        const item = w.find('[data-testid="sidebar-item"]');
        expect(item.exists()).toBe(true);
        // The core assertion: a real anchor, not an inert <nuxtlink>.
        expect(item.element.tagName).toBe('A');
        expect(item.attributes('href')).toBe('/fleet/devices');
    });

    it('AlpIconRail renders a section with `to` as a real <a href> anchor', () => {
        const w = mount(AlpIconRail, { props: { sections }, global: globalConfig });
        const dashboard = w
            .findAll('[data-testid="icon-rail-item"]')
            .find((e) => e.text().includes('Dashboard'))!;
        expect(dashboard.element.tagName).toBe('A');
        expect(dashboard.attributes('href')).toBe('/');
    });

    it('AlpEntityRow renders as a real <a href> anchor when `to` is set', () => {
        const w = mount(AlpEntityRow, { props: { to: '/orgs/acme' }, global: globalConfig });
        expect(w.element.tagName).toBe('A');
        expect(w.attributes('href')).toBe('/orgs/acme');
    });

    it('AlpStatTile renders as a real <a href> anchor when `href` is set', () => {
        const w = mount(AlpStatTile, {
            props: { label: 'Devices', value: 12, href: '/fleet/devices' },
            global: globalConfig
        });
        expect(w.element.tagName).toBe('A');
        expect(w.attributes('href')).toBe('/fleet/devices');
    });

    it('AlpEmptySection renders its CTA as a real <a href> anchor', () => {
        const w = mount(AlpEmptySection, {
            props: {
                message: 'No machines linked yet',
                actionLabel: 'Link a machine',
                actionHref: '/machines/new'
            },
            global: globalConfig
        });
        const anchor = w.find('a');
        expect(anchor.exists()).toBe(true);
        expect(anchor.attributes('href')).toBe('/machines/new');
        expect(anchor.text()).toBe('Link a machine');
    });

    it('AlpFeed renders an item with `href` as a real <a href> anchor', () => {
        const w = mount(AlpFeed, {
            props: {
                emptyMessage: 'Nothing here',
                items: [
                    {
                        id: '1',
                        severity: 'danger',
                        severityLabel: 'Critical',
                        title: 'Node down',
                        href: '/alerts/1'
                    }
                ]
            },
            global: globalConfig
        });
        const anchor = w.find('a[href="/alerts/1"]');
        expect(anchor.exists()).toBe(true);
        expect(anchor.element.tagName).toBe('A');
    });

    it('routes through a registered RouterLink instead of the plain-anchor fallback', () => {
        const w = mount(AlpEntityRow, {
            props: { to: '/orgs/acme' },
            global: { components: { ...globalConfig.components, RouterLink } }
        });
        expect(w.attributes('data-router-link')).toBeDefined();
        expect(w.attributes('href')).toBe('/orgs/acme');
    });

    it('keeps external targets on a plain anchor, which a router cannot resolve', () => {
        const w = mount(AlpEntityRow, {
            props: { to: 'https://alpamayo.ch/docs' },
            global: { components: { ...globalConfig.components, RouterLink } }
        });
        expect(w.attributes('data-router-link')).toBeUndefined();
        expect(w.element.tagName).toBe('A');
        expect(w.attributes('href')).toBe('https://alpamayo.ch/docs');
    });
});
