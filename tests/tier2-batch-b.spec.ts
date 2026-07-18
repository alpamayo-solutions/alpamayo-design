import { describe, expect, it, vi, afterEach } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AlpFeed from '../components/alp/AlpFeed.vue';
import AlpRelatedCard from '../components/alp/AlpRelatedCard.vue';
import AlpRelatedTable from '../components/alp/AlpRelatedTable.vue';
import AlpProgressIcon, { isProgressIcon, progressFraction } from '../components/alp/AlpProgressIcon.vue';
import AlpDateChip from '../components/alp/AlpDateChip.vue';
import AlpPriorityPicker from '../components/alp/AlpPriorityPicker.vue';
import AlpGroupByMenu from '../components/alp/AlpGroupByMenu.vue';
import AlpSortMenu from '../components/alp/AlpSortMenu.vue';
import AlpKpiBar from '../components/alp/AlpKpiBar.vue';

// design.feed.* / design.related.* / design.date.* / design.priority.* /
// design.groupBy.* / design.sort.* keys aren't in i18n/locales/*/design.json
// yet (Task A9 adds them) — stub the messages locally, same pattern used to
// test other useI18n()-driven components before their locale entries land
// (see tier2-batch-a.spec.ts, merged-components.spec.ts, table-shells.spec.ts).
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            design: {
                related: {
                    loading: 'Loading…',
                    previous: 'Previous page',
                    next: 'Next page',
                    emptyDefault: 'No related records.',
                    emptyMessage: 'No related records found.'
                },
                date: { trigger: 'Due date' },
                priority: { trigger: 'Priority', none: 'None', low: 'Low', medium: 'Medium', high: 'High' },
                groupBy: { trigger: 'Group by' },
                sort: { trigger: 'Sort', asc: 'Asc', desc: 'Desc' }
            }
        }
    }
});

// Minimal functional stubs for the Volt/PrimeVue primitives these components
// compose — mirroring just enough of the real contracts to drive behavior
// without pulling in PrimeVue's overlay/focus-trap machinery.
const VoltButtonStub = {
    props: ['label', 'disabled', 'icon'],
    emits: ['click'],
    template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot />{{ label }}</button>'
};
const VoltTagStub = {
    props: ['value', 'severity'],
    template: '<span class="tag" :data-severity="severity">{{ value }}</span>'
};
const VoltMenuStub = {
    props: ['model'],
    template:
        '<ul><li v-for="item in model" :key="item.key ?? item.label" @click="item.command && item.command()">{{ item.label }}</li></ul>'
};
const VoltSelectStub = defineComponent({
    props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'placeholder'],
    emits: ['update:modelValue'],
    template:
        '<div><span class="selected">{{ selectedLabel }}</span><ul><li v-for="opt in options" :key="opt[optionValue]" @click="$emit(\'update:modelValue\', opt[optionValue])">{{ opt[optionLabel] }}</li></ul></div>',
    computed: {
        selectedLabel(): string {
            const found = (this.options as any[]).find(
                (o) => o[this.optionValue as string] === this.modelValue
            );
            return found ? found[this.optionLabel as string] : (this.placeholder ?? '');
        }
    }
});
const VoltDatePickerStub = {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<div class="date-picker" @click="$emit(\'update:modelValue\', new Date(2026, 0, 1))" />'
};
const NuxtLinkStub = { props: ['to'], template: '<a :href="to"><slot /></a>' };

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('AlpFeed', () => {
    const globalConfig = { plugins: [i18n], components: { NuxtLink: NuxtLinkStub } };
    const items = [
        { id: '1', severity: 'info' as const, severityLabel: 'Info', title: 'Scheduled maintenance' },
        {
            id: '2',
            severity: 'danger' as const,
            severityLabel: 'Critical',
            title: 'edge-node-07 offline',
            href: '/fleet/edge-node-07'
        }
    ];

    it('sorts items by severity descending (danger before info) by default', () => {
        const w = mount(AlpFeed, { props: { items, emptyMessage: 'No alerts' }, global: globalConfig });
        const titles = w.findAll('p.font-medium').map((p) => p.text());
        expect(titles).toEqual(['edge-node-07 offline', 'Scheduled maintenance']);
    });

    it('renders an item with an href as a NuxtLink', () => {
        const w = mount(AlpFeed, { props: { items, emptyMessage: 'No alerts' }, global: globalConfig });
        const link = w.find('a[href="/fleet/edge-node-07"]');
        expect(link.exists()).toBe(true);
    });

    it('shows the empty section when there are no items', () => {
        const w = mount(AlpFeed, { props: { items: [], emptyMessage: 'No alerts' }, global: globalConfig });
        expect(w.text()).toContain('No alerts');
    });
});

describe('AlpRelatedCard', () => {
    const globalConfig = { plugins: [i18n], components: { VoltButton: VoltButtonStub } };

    it('shows the localized loading state', () => {
        const w = mount(AlpRelatedCard, {
            props: { title: 'Devices', count: 0, page: 1, pageSize: 10, loading: true },
            global: globalConfig
        });
        expect(w.text()).toContain('Loading…');
    });

    it('falls back to the localized default empty text when none is supplied', () => {
        const w = mount(AlpRelatedCard, {
            props: { title: 'Devices', count: 0, page: 1, pageSize: 10 },
            global: globalConfig
        });
        expect(w.text()).toContain('No related records.');
    });

    it('emits page changes from the pagination controls', async () => {
        const w = mount(AlpRelatedCard, {
            props: { title: 'Devices', count: 42, page: 2, pageSize: 10 },
            global: globalConfig
        });
        const [prevBtn, nextBtn] = w.findAll('button');
        await nextBtn!.trigger('click');
        expect(w.emitted('page')).toEqual([[3]]);
        await prevBtn!.trigger('click');
        expect(w.emitted('page')![1]).toEqual([1]);
    });
});

describe('AlpRelatedTable', () => {
    const VoltDataTableStub = {
        props: ['value', 'loading'],
        template:
            '<div><template v-if="!value.length"><slot name="empty" /></template><div v-for="row in value" :key="row.id" class="row" @click="$emit(\'row-click\', { data: row })">{{ row.name }}</div></div>'
    };
    const globalConfig = { plugins: [i18n], components: { VoltDataTable: VoltDataTableStub } };
    const items = [
        { id: '1', name: 'edge-node-01' },
        { id: '2', name: 'edge-node-02' }
    ];

    it('renders one row per item', () => {
        const w = mount(AlpRelatedTable, { props: { items }, global: globalConfig });
        expect(w.findAll('.row')).toHaveLength(2);
    });

    it('shows the localized default empty message when there are no items', () => {
        const w = mount(AlpRelatedTable, { props: { items: [] }, global: globalConfig });
        expect(w.text()).toContain('No related records found.');
    });

    it('navigates via rowTo on row click', async () => {
        vi.stubGlobal('navigateTo', vi.fn());
        const w = mount(AlpRelatedTable, {
            props: { items, rowTo: (row: any) => `/fleet/${row.id}` },
            global: globalConfig
        });
        await w.findAll('.row')[0]!.trigger('click');
        expect(navigateTo).toHaveBeenCalledWith('/fleet/1');
    });
});

describe('AlpProgressIcon', () => {
    it('exposes progressFraction for progress-38-style keys', () => {
        expect(progressFraction('progress-38')).toBeCloseTo(0.38);
        expect(progressFraction('pi-flag')).toBeNull();
    });

    it('exposes isProgressIcon for any progress-<0-100> key, not just a fixed set', () => {
        expect(isProgressIcon('progress-38')).toBe(true);
        expect(isProgressIcon('progress-101')).toBe(false);
        expect(isProgressIcon('pi-flag')).toBe(false);
    });

    it('renders a progress ring with the correct dash length for progress-38', () => {
        const w = mount(AlpProgressIcon, { props: { icon: 'progress-38' } });
        const circles = w.findAll('circle');
        expect(circles).toHaveLength(2);
        expect(circles[1]!.attributes('stroke-dasharray')).toBe('38 100');
    });

    it('renders a plain PrimeIcon for a pi-* key', () => {
        const w = mount(AlpProgressIcon, { props: { icon: 'pi-flag' } });
        expect(w.find('i.pi.pi-flag').exists()).toBe(true);
        expect(w.find('svg').exists()).toBe(false);
    });

    it('renders an outlined dot when no icon is set', () => {
        const w = mount(AlpProgressIcon, { props: { icon: null } });
        expect(w.find('svg').exists()).toBe(false);
        expect(w.find('i').exists()).toBe(false);
        expect(w.find('span.rounded-full.border-2').exists()).toBe(true);
    });
});

describe('AlpDateChip', () => {
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub, VoltDatePicker: VoltDatePickerStub },
        directives: { tooltip: {} },
        stubs: { teleport: true }
    };

    it('is icon-only when no date is set', () => {
        const w = mount(AlpDateChip, { props: { dueDate: null }, global: globalConfig });
        expect(w.find('span.tabular-nums').exists()).toBe(false);
    });

    it('shows the formatted date and flags overdue styling for a past date', () => {
        const w = mount(AlpDateChip, { props: { dueDate: '2020-01-01' }, global: globalConfig });
        expect(w.text()).toContain('2020-01-01');
        expect(w.find('button').classes().join(' ')).toContain('text-danger-600');
    });

    it('opens the picker and emits update + closes on selection', async () => {
        const w = mount(AlpDateChip, { props: { dueDate: null }, global: globalConfig });
        await w.find('button').trigger('click');
        expect(w.find('.date-picker').exists()).toBe(true);
        await w.find('.date-picker').trigger('click');
        expect(w.emitted('update')).toHaveLength(1);
        expect(w.find('.date-picker').exists()).toBe(false);
    });
});

describe('AlpPriorityPicker', () => {
    const globalConfig = {
        plugins: [i18n],
        components: { VoltButton: VoltButtonStub, VoltTag: VoltTagStub, VoltMenu: VoltMenuStub },
        directives: { tooltip: {} }
    };

    it('shows the placeholder trigger label when no priority is set', () => {
        const w = mount(AlpPriorityPicker, { props: {}, global: globalConfig });
        expect(w.find('.tag').exists()).toBe(false);
        expect(w.text()).toContain('Priority');
    });

    it('shows the current priority as a tag when set', () => {
        const w = mount(AlpPriorityPicker, { props: { priority: 3 }, global: globalConfig });
        expect(w.find('.tag').text()).toBe('High');
    });

    it('emits update with the selected priority value', async () => {
        const w = mount(AlpPriorityPicker, { props: { priority: 0 }, global: globalConfig });
        const items = w.findAll('li');
        await items[2]!.trigger('click'); // Medium (value 2)
        expect(w.emitted('update')).toEqual([[2]]);
    });
});

describe('AlpGroupByMenu', () => {
    const options = [
        { key: 'status', label: 'Status' },
        { key: 'assignee', label: 'Assignee' }
    ];
    const globalConfig = {
        plugins: [i18n],
        components: { VoltSelect: VoltSelectStub },
        directives: { tooltip: {} }
    };

    it('renders every passed option', () => {
        const w = mount(AlpGroupByMenu, { props: { options, modelValue: 'status' }, global: globalConfig });
        expect(w.findAll('li').map((li) => li.text())).toEqual(['Status', 'Assignee']);
    });

    it('emits update:modelValue with the selected option key', async () => {
        const w = mount(AlpGroupByMenu, { props: { options, modelValue: 'status' }, global: globalConfig });
        await w.findAll('li')[1]!.trigger('click');
        expect(w.emitted('update:modelValue')).toEqual([['assignee']]);
    });
});

describe('AlpSortMenu', () => {
    const options = [
        { key: '', label: 'Manual' },
        { key: 'created', label: 'Created' },
        { key: 'due', label: 'Due date' }
    ];
    const globalConfig = {
        plugins: [i18n],
        components: { VoltSelect: VoltSelectStub, VoltButton: VoltButtonStub },
        directives: { tooltip: {} }
    };

    it('renders every passed option', () => {
        const w = mount(AlpSortMenu, {
            props: { options, modelValue: '', dir: 'asc' },
            global: globalConfig
        });
        expect(w.findAll('li').map((li) => li.text())).toEqual(['Manual', 'Created', 'Due date']);
    });

    it('emits update:modelValue with the selected option key', async () => {
        const w = mount(AlpSortMenu, {
            props: { options, modelValue: '', dir: 'asc' },
            global: globalConfig
        });
        await w.findAll('li')[1]!.trigger('click');
        expect(w.emitted('update:modelValue')).toEqual([['created']]);
    });

    it('only shows the direction toggle once a field is chosen, and emits update:dir', async () => {
        const w = mount(AlpSortMenu, {
            props: { options, modelValue: '', dir: 'asc' },
            global: globalConfig
        });
        expect(w.find('button').exists()).toBe(false);
        await w.setProps({ modelValue: 'created' });
        await w.find('button').trigger('click');
        expect(w.emitted('update:dir')).toEqual([['desc']]);
    });
});

describe('AlpKpiBar', () => {
    it('renders whatever children are passed into the default slot', () => {
        const w = mount(AlpKpiBar, {
            slots: { default: '<div class="kpi-card">Active: 12</div><div class="kpi-card">Offline: 1</div>' }
        });
        expect(w.findAll('.kpi-card')).toHaveLength(2);
    });

    it('lays the children out in a responsive grid', () => {
        const w = mount(AlpKpiBar, { slots: { default: '<div>x</div>' } });
        expect(w.classes()).toContain('grid');
    });
});
