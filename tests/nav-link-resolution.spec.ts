import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AlpSidebar from '../components/alp/nav/AlpSidebar.vue';
import AlpIconRail from '../components/alp/nav/AlpIconRail.vue';
import AlpEntityRow from '../components/alp/AlpEntityRow.vue';
import AlpStatTile from '../components/alp/AlpStatTile.vue';
import AlpFeed from '../components/alp/AlpFeed.vue';
import type { NavSection } from '../components/alp/nav/AlpSidebar.vue';
import { NuxtLink } from './stubs/nuxt-components';

/**
 * Regression tests for the "inert <nuxtlink>" production bug.
 *
 * The originally-buggy code used `<component :is="cond ? 'NuxtLink' : 'div'">` — a
 * STRING. NuxtLink is a Nuxt compile-time auto-import, NOT a runtime-registered
 * global, so the string never resolved and Vue rendered an inert <nuxtlink>
 * element with no href. Nav sub-links (and other link tiles) were dead.
 *
 * The components now render a literal `<NuxtLink v-if="...">` tag (no
 * `#components` import — that broke consumer `vue-tsc` typechecking). In real
 * Nuxt apps, `<NuxtLink>` resolves via compile-time auto-import; under vitest
 * there is no Nuxt build step, so the literal tag only resolves if `NuxtLink` is
 * registered as a global component for the mount. `globalConfig.components`
 * below registers the same anchor-rendering stub used by the old `#components`
 * alias so the link branch still renders a genuine `<a href>`. Against a build
 * that fails to render a real link (or falls back to an unresolved custom
 * element) these assertions FAIL; against the fixed source they PASS.
 */

const VoltBadgeStub = { props: ['value', 'severity'], template: '<span class="badge">{{ value }}</span>' };

const globalConfig = {
    components: { VoltBadge: VoltBadgeStub, NuxtLink }
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

describe('NuxtLink runtime resolution (regression)', () => {
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
});
