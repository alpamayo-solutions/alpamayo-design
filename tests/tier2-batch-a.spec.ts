import { describe, expect, it, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AlpRowActions from '../components/alp/AlpRowActions.vue';
import AlpDetailActions from '../components/alp/AlpDetailActions.vue';
import AlpImageLightbox from '../components/alp/AlpImageLightbox.vue';
import AlpMobilePagination from '../components/alp/AlpMobilePagination.vue';
import AlpStalenessIndicator from '../components/alp/AlpStalenessIndicator.vue';
import AlpEditConflictBanner from '../components/alp/AlpEditConflictBanner.vue';
import AlpPresenceAvatars from '../components/alp/AlpPresenceAvatars.vue';
import AlpLogoTile from '../components/alp/AlpLogoTile.vue';
import AlpBadgeRow from '../components/alp/AlpBadgeRow.vue';
import AlpGrabBar from '../components/alp/AlpGrabBar.vue';

// design.actions.* / design.table.* / design.staleness.* / design.presence.* keys
// aren't in i18n/locales/*/design.json yet (Task A9 adds them) — stub the
// messages locally, same pattern used to test other useI18n()-driven
// components before their locale entries land (see merged-components.spec.ts,
// table-shells.spec.ts).

// Minimal functional stubs for the Volt/PrimeVue primitives these components
// compose, mirroring just enough of the real contracts to drive behavior
// without pulling in PrimeVue's Teleport/focus-trap/overlay machinery.
// `emits: ['click']` matters: without a declared emit, Vue both forwards the
// parent's onClick as a native fallthrough attribute *and* fires it again via
// the stub's own `$emit('click')`, double-invoking the handler.
const VoltButtonStub = {
    props: ['label'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')">{{ label }}<slot /></button>'
};
const VoltMenuStub = {
    props: ['model'],
    template:
        '<ul><li v-for="item in model" :key="item.label" :class="item.class" @click="item.command && item.command()">{{ item.label }}</li></ul>'
};
const VoltSelectStub = { template: '<div />' };
const NuxtLinkStub = {
    props: ['to'],
    template: '<a :href="to"><slot :href="to" :navigate="() => {}" /></a>'
};

// AlpDetailActions imports `Menu` directly from 'primevue/menu' inside
// <script setup> (verbatim move — see global-constraints.md's "Move
// verbatim" rule, this import needed no rewrite). Script-setup compiles
// direct references to imported bindings without going through the runtime
// component resolver, so `global.components`/`global.stubs` can't override
// it — module-mock it instead.
vi.mock('primevue/menu', () => ({
    default: {
        props: ['model'],
        template:
            '<ul><li v-for="item in model" :key="item.label" :class="item.class" @click="item.command && item.command()">{{ item.label }}</li></ul>'
    }
}));

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('AlpRowActions', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
            en: { design: { actions: { edit: 'Edit', delete: 'Delete', more: 'More' } } }
        }
    });
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub, VoltMenu: VoltMenuStub }
    };

    it('items-path renders the passed MenuItems verbatim', () => {
        const items = [{ label: 'Archive', icon: 'pi pi-box' }, { label: 'Duplicate', icon: 'pi pi-copy' }];
        const w = mount(AlpRowActions, { props: { items }, global: globalConfig });
        const labels = w.findAll('li').map((li) => li.text());
        expect(labels).toEqual(['Archive', 'Duplicate']);
    });

    it('fallback path emits edit and delete', async () => {
        const w = mount(AlpRowActions, { global: globalConfig });
        const items = w.findAll('li');
        expect(items.map((li) => li.text())).toEqual(['Edit', 'Delete']);
        await items[0]!.trigger('click');
        expect(w.emitted('edit')).toHaveLength(1);
        await items[1]!.trigger('click');
        expect(w.emitted('delete')).toHaveLength(1);
    });

    it('navigates via editLink instead of emitting edit when set', async () => {
        vi.stubGlobal('navigateTo', vi.fn());
        const w = mount(AlpRowActions, { props: { editLink: '/fleet/1' }, global: globalConfig });
        await w.findAll('li')[0]!.trigger('click');
        expect(navigateTo).toHaveBeenCalledWith('/fleet/1');
        expect(w.emitted('edit')).toBeUndefined();
    });

    it('applies a custom ariaLabel to the toggle button', () => {
        const w = mount(AlpRowActions, { props: { ariaLabel: 'Row menu' }, global: globalConfig });
        expect(w.find('button').attributes('aria-label')).toBe('Row menu');
    });
});

describe('AlpDetailActions', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: { en: { design: { actions: { edit: 'Edit', more: 'More' } } } }
    });
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub, NuxtLink: NuxtLinkStub }
    };

    it('renders the edit action as a NuxtLink when showEdit + editHref are set', () => {
        const w = mount(AlpDetailActions, {
            props: { showEdit: true, editHref: '/devices/1' },
            global: globalConfig
        });
        const link = w.find('a');
        expect(link.exists()).toBe(true);
        expect(link.attributes('href')).toBe('/devices/1');
        expect(link.text()).toContain('Edit');
    });

    it('puts destructiveLabel + extraOverflowItems behind the overflow menu', async () => {
        const extra = vi.fn();
        const w = mount(AlpDetailActions, {
            props: {
                destructiveLabel: 'Delete device',
                extraOverflowItems: [{ label: 'Duplicate', command: extra }]
            },
            global: globalConfig
        });
        const items = w.findAll('li');
        expect(items.map((li) => li.text())).toEqual(['Duplicate', 'Delete device']);
        await items[0]!.trigger('click');
        expect(extra).toHaveBeenCalledOnce();
        await items[1]!.trigger('click');
        expect(w.emitted('delete')).toHaveLength(1);
    });
});

describe('AlpImageLightbox', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: { en: { design: { actions: { close: 'Close', previous: 'Previous', next: 'Next' } } } }
    });
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub },
        directives: { tooltip: {} },
        stubs: { teleport: true }
    };
    const images = [
        { id: 'a', url: '/a.png', filename: 'edge-node-01.png' },
        { id: 'b', url: '/b.png', filename: 'edge-node-02.png' },
        { id: 'c', url: '/c.png', filename: 'edge-node-03.png' }
    ];

    it('opens on thumbnail click and Escape closes it', async () => {
        const w = mount(AlpImageLightbox, { props: { images }, global: globalConfig });
        expect(w.find('[data-testid="lightbox-overlay"]').exists()).toBe(false);
        await w.findAll('button')[0]!.trigger('click');
        expect(w.find('[data-testid="lightbox-overlay"]').exists()).toBe(true);
        await w.find('[data-testid="lightbox-overlay"]').trigger('keydown', { key: 'Escape' });
        expect(w.find('[data-testid="lightbox-overlay"]').exists()).toBe(false);
    });

    it('cycles images with arrow keys, wrapping at the ends', async () => {
        const w = mount(AlpImageLightbox, { props: { images }, global: globalConfig });
        await w.findAll('button')[2]!.trigger('click'); // open at last image
        expect(w.find('img[alt="edge-node-03.png"]').exists()).toBe(true);
        await w.find('[data-testid="lightbox-overlay"]').trigger('keydown', { key: 'ArrowRight' });
        expect(w.find('img[alt="edge-node-01.png"]').exists()).toBe(true); // wraps to first
        await w.find('[data-testid="lightbox-overlay"]').trigger('keydown', { key: 'ArrowLeft' });
        expect(w.find('img[alt="edge-node-03.png"]').exists()).toBe(true);
    });
});

describe('AlpMobilePagination', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
            en: {
                design: {
                    table: {
                        previousPage: 'Previous page',
                        nextPage: 'Next page',
                        pageSizeOption: '{value} / page'
                    }
                }
            }
        }
    });
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub, VoltSelect: VoltSelectStub }
    };

    it('emits a page change with the target 0-based page and current rows', async () => {
        const w = mount(AlpMobilePagination, {
            props: { page: 1, pageSize: 10, totalRecords: 25 },
            global: globalConfig
        });
        const [prevBtn, nextBtn] = w.findAll('button');
        await nextBtn!.trigger('click');
        expect(w.emitted('page')).toEqual([[{ page: 1, rows: 10 }]]);
        expect(prevBtn!.element.disabled).toBe(true);
    });

    it('disables next at the last page and emits the previous page', async () => {
        const w = mount(AlpMobilePagination, {
            props: { page: 3, pageSize: 10, totalRecords: 25 },
            global: globalConfig
        });
        const [prevBtn, nextBtn] = w.findAll('button');
        expect(nextBtn!.element.disabled).toBe(true);
        expect(prevBtn!.element.disabled).toBe(false);
        await prevBtn!.trigger('click');
        expect(w.emitted('page')).toEqual([[{ page: 1, rows: 10 }]]);
    });

    it('hides itself entirely when there are no records', () => {
        const w = mount(AlpMobilePagination, {
            props: { page: 1, pageSize: 10, totalRecords: 0 },
            global: globalConfig
        });
        expect(w.findAll('button').length).toBe(0);
    });
});

describe('AlpStalenessIndicator', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
            en: {
                design: {
                    staleness: {
                        noData: 'No data',
                        justNow: 'just now',
                        secondsAgo: '{seconds}s ago',
                        minutesAgo: '{minutes}m ago',
                        hoursAgo: '{hours}h ago',
                        refresh: 'Refresh monitoring data'
                    }
                }
            }
        }
    });
    const globalConfig = { plugins: [i18n], components: { VoltButton: VoltButtonStub } };

    it('shows "No data" and the stale (warning) class when lastFetchedAt is null', () => {
        const w = mount(AlpStalenessIndicator, {
            props: { lastFetchedAt: null, loading: false },
            global: globalConfig
        });
        expect(w.text()).toContain('No data');
        expect(w.find('span').classes()).toContain('text-warning-500');
    });

    it('shows a fresh relative time in the neutral color under the staleness threshold', () => {
        const w = mount(AlpStalenessIndicator, {
            props: { lastFetchedAt: new Date(Date.now() - 30_000), loading: false },
            global: globalConfig
        });
        expect(w.text()).toContain('30s ago');
        expect(w.find('span').classes()).not.toContain('text-warning-500');
    });

    it('flags staleness past the 120s threshold', () => {
        const w = mount(AlpStalenessIndicator, {
            props: { lastFetchedAt: new Date(Date.now() - 130_000), loading: false },
            global: globalConfig
        });
        expect(w.text()).toContain('2m ago');
        expect(w.find('span').classes()).toContain('text-warning-500');
    });

    it('omits the refresh button when showRefresh is false', () => {
        const w = mount(AlpStalenessIndicator, {
            props: { lastFetchedAt: null, loading: false, showRefresh: false },
            global: globalConfig
        });
        expect(w.find('button').exists()).toBe(false);
    });
});

describe('AlpEditConflictBanner', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
            en: {
                design: {
                    presence: {
                        editWarning:
                            'is currently editing this. Saving may overwrite their changes. | are currently editing this. Saving may overwrite their changes.'
                    }
                }
            }
        }
    });
    const globalConfig = { plugins: [i18n] };

    it('renders nothing when no one else is editing', () => {
        const w = mount(AlpEditConflictBanner, { props: { users: [] }, global: globalConfig });
        expect(w.text()).toBe('');
    });

    it('renders the singular form and emphasized name for one other editor', () => {
        const w = mount(AlpEditConflictBanner, {
            props: { users: [{ sub: '1', name: 'Alex Doe', mode: 'edit' }] },
            global: globalConfig
        });
        expect(w.find('strong').text()).toBe('Alex Doe');
        expect(w.text()).toContain('is currently editing this');
    });

    it('renders the plural form and joins names for multiple other editors', () => {
        const w = mount(AlpEditConflictBanner, {
            props: {
                users: [
                    { sub: '1', name: 'Alex Doe', mode: 'edit' },
                    { sub: '2', name: 'Kim Muster', mode: 'edit' }
                ]
            },
            global: globalConfig
        });
        expect(w.find('strong').text()).toBe('Alex Doe, Kim Muster');
        expect(w.text()).toContain('are currently editing this');
    });
});

describe('AlpPresenceAvatars', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
            en: { design: { presence: { viewing: '{count} viewing', editingSuffix: '(editing)' } } }
        }
    });
    const globalConfig = { plugins: [i18n] };

    it('renders initials for each user and the viewing count', () => {
        const w = mount(AlpPresenceAvatars, {
            props: {
                users: [
                    { sub: '1', name: 'Alex Doe', mode: 'view' },
                    { sub: '2', name: 'Kim Muster', mode: 'view' }
                ]
            },
            global: globalConfig
        });
        const avatars = w.findAll('[title]');
        expect(avatars.map((a) => a.text())).toEqual(['AD', 'KM']);
        expect(w.text()).toContain('2 viewing');
    });

    it('shows the editing dot and suffix only for users in edit mode', () => {
        const w = mount(AlpPresenceAvatars, {
            props: {
                users: [
                    { sub: '1', name: 'Alex Doe', mode: 'edit' },
                    { sub: '2', name: 'Kim Muster', mode: 'view' }
                ]
            },
            global: globalConfig
        });
        const avatars = w.findAll('[title]');
        expect(avatars[0]!.attributes('title')).toBe('Alex Doe (editing)');
        expect(avatars[1]!.attributes('title')).toBe('Kim Muster');
        expect(avatars[0]!.find('.bg-warning-500').exists()).toBe(true);
        expect(avatars[1]!.find('.bg-warning-500').exists()).toBe(false);
    });
});

describe('AlpLogoTile', () => {
    it('renders the first letter of an explicit label', () => {
        const w = mount(AlpLogoTile, { props: { integration: 'github', label: 'GitHub' } });
        expect(w.text()).toBe('G');
        expect(w.attributes('title')).toBe('GitHub');
    });

    it('falls back to the integration slug when no label is given', () => {
        const w = mount(AlpLogoTile, { props: { integration: 'Azure-DevOps' } });
        expect(w.text()).toBe('A');
        expect(w.attributes('title')).toBe('azure-devops');
    });
});

describe('AlpBadgeRow', () => {
    it('renders one badge per entry with the severity-specific class', () => {
        const w = mount(AlpBadgeRow, {
            props: {
                badges: [
                    { label: 'Sync OK', severity: 'success' },
                    { label: 'Sync stale', severity: 'warning' },
                    { label: 'Untyped' }
                ]
            }
        });
        const badges = w.findAll('span[title]');
        expect(badges).toHaveLength(3);
        expect(badges[0]!.classes()).toContain('border-success-200');
        expect(badges[1]!.classes()).toContain('border-warning-200');
        expect(badges[2]!.classes()).toContain('border-surface-200'); // default neutral
    });

    it('renders an icon when given, else the label initial', () => {
        const w = mount(AlpBadgeRow, {
            props: { badges: [{ label: 'GitHub', icon: 'pi pi-github' }, { label: 'Odoo' }] }
        });
        expect(w.find('.pi-github').exists()).toBe(true);
        expect(w.findAll('span[title]')[1]!.text()).toBe('O');
    });
});

describe('AlpGrabBar', () => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: { en: { design: { presence: { workingOn: 'Working on', release: 'Release' } } } }
    });
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub },
        directives: { tooltip: {} }
    };

    it('renders a chip with the title per grab and the "Working on" label', () => {
        const w = mount(AlpGrabBar, {
            props: { grabs: [{ cardId: 'card-1', title: 'Retrofit line 4' }] },
            global: globalConfig
        });
        expect(w.text()).toContain('Working on');
        expect(w.text()).toContain('Retrofit line 4');
    });

    it('emits release with the cardId when the release button is clicked', async () => {
        const w = mount(AlpGrabBar, {
            props: {
                grabs: [
                    { cardId: 'card-1', title: 'Retrofit line 4' },
                    { cardId: 'card-2', title: 'Commission edge-node-07' }
                ]
            },
            global: globalConfig
        });
        await w.findAll('button')[1]!.trigger('click');
        expect(w.emitted('release')).toEqual([['card-2']]);
    });

    it('renders nothing when there are no grabs', () => {
        const w = mount(AlpGrabBar, { props: { grabs: [] }, global: globalConfig });
        expect(w.text()).toBe('');
    });
});
