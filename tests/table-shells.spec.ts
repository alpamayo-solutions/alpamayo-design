import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AlpListTable from '../components/alp/AlpListTable.vue';
import AlpClientTable from '../components/alp/AlpClientTable.vue';
import AlpEmptySection from '../components/alp/AlpEmptySection.vue';

// design.table.* keys aren't in i18n/locales/*/design.json yet (Task A9 adds
// them) — stub the messages locally, same pattern used to test other
// useI18n()-driven components before their locale entries land.
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: { design: { table: { emptyMessage: 'No records found.' } } } }
});

const globalConfig = {
    plugins: [[PrimeVue, { unstyled: true }], i18n],
    directives: { tooltip: Tooltip },
    stubs: { teleport: true },
    components: { VoltDataTable: DataTable, Column }
};

const rows = [
    { id: '1', name: 'edge-node-01' },
    { id: '2', name: 'edge-node-02' }
];

describe('AlpListTable', () => {
    beforeEach(() => {
        vi.stubGlobal('navigateTo', vi.fn());
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders passed rows via a Column in the default slot', () => {
        const w = mount(AlpListTable, {
            props: { items: rows, rows: 10, totalRecords: 2, first: 0 },
            slots: { default: '<Column field="name" header="Name" />' },
            global: globalConfig as any
        });
        expect(w.text()).toContain('edge-node-01');
        expect(w.text()).toContain('edge-node-02');
    });

    it('emits its page event when the paginator advances', async () => {
        const w = mount(AlpListTable, {
            props: { items: rows, rows: 10, totalRecords: 25, first: 0 },
            slots: { default: '<Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        await w.findComponent(DataTable).vm.$emit('page', { page: 1, rows: 10 });

        expect(w.emitted('page')).toEqual([[{ page: 1, rows: 10 }]]);
    });

    it('shows AlpEmptySection when rows are empty and loading is false', () => {
        const w = mount(AlpListTable, {
            props: { items: [], rows: 10, totalRecords: 0, first: 0, loading: false },
            global: globalConfig as any
        });

        const empty = w.findComponent(AlpEmptySection);
        expect(empty.exists()).toBe(true);
        expect(empty.props('message')).toBe('No records found.');
    });

    it('triggers navigation via rowTo on row click', async () => {
        const rowTo = vi.fn((row: { id: string }) => `/nodes/${row.id}`);
        const w = mount(AlpListTable, {
            props: { items: rows, rows: 10, totalRecords: 2, first: 0, rowTo },
            slots: { default: '<Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        await w.findComponent(DataTable).vm.$emit('row-click', { data: rows[0] });

        expect(rowTo).toHaveBeenCalledWith(rows[0]);
        expect(navigateTo).toHaveBeenCalledWith('/nodes/1');
        expect(w.emitted('rowClick')).toEqual([[{ data: rows[0] }]]);
    });
});

describe('AlpClientTable', () => {
    beforeEach(() => {
        vi.stubGlobal('navigateTo', vi.fn());
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders passed rows via a Column in the default slot', () => {
        const w = mount(AlpClientTable, {
            props: { items: rows },
            slots: { default: '<Column field="name" header="Name" />' },
            global: globalConfig as any
        });
        expect(w.text()).toContain('edge-node-01');
        expect(w.text()).toContain('edge-node-02');
    });

    it('triggers navigation via rowTo on row click', async () => {
        const rowTo = vi.fn((row: { id: string }) => `/nodes/${row.id}`);
        const w = mount(AlpClientTable, {
            props: { items: rows, rowTo },
            slots: { default: '<Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        await w.findComponent(DataTable).vm.$emit('row-click', { data: rows[0] });

        expect(rowTo).toHaveBeenCalledWith(rows[0]);
        expect(navigateTo).toHaveBeenCalledWith('/nodes/1');
        expect(w.emitted('rowClick')).toEqual([[{ data: rows[0] }]]);
    });

    it('forwards filter updates via the DataTableFilterMeta prop', async () => {
        const w = mount(AlpClientTable, {
            props: { items: rows, filters: { name: { value: null, matchMode: 'contains' } } },
            slots: { default: '<Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        const nextFilters = { name: { value: 'edge', matchMode: 'contains' } };
        await w.findComponent(DataTable).vm.$emit('update:filters', nextFilters);

        expect(w.emitted('update:filters')).toEqual([[nextFilters]]);
    });

    it('shows AlpEmptySection when rows are empty and loading is false', () => {
        const w = mount(AlpClientTable, {
            props: { items: [], loading: false },
            global: globalConfig as any
        });

        const empty = w.findComponent(AlpEmptySection);
        expect(empty.exists()).toBe(true);
        expect(empty.props('message')).toBe('No records found.');
    });

    it('renders the expansion slot for the expanded row only', () => {
        const w = mount(AlpClientTable, {
            props: { items: rows, expandedRows: [rows[0]] },
            slots: {
                default: '<Column expander /><Column field="name" header="Name" />',
                expansion: '<p>detail for {{ params.data.name }}</p>'
            },
            global: globalConfig as any
        });

        expect(w.text()).toContain('detail for edge-node-01');
        expect(w.text()).not.toContain('detail for edge-node-02');
    });

    it('renders no row detail while nothing is expanded', () => {
        const w = mount(AlpClientTable, {
            props: { items: rows, expandedRows: [] },
            slots: {
                default: '<Column expander /><Column field="name" header="Name" />',
                expansion: '<p>detail for {{ params.data.name }}</p>'
            },
            global: globalConfig as any
        });

        expect(w.text()).not.toContain('detail for');
    });

    it('emits the expanded row set as an array so callers can drive it with v-model', async () => {
        const w = mount(AlpClientTable, {
            props: { items: rows, expandedRows: [] },
            slots: { default: '<Column expander /><Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        // PrimeVue reports expansion as a dataKey-indexed object; callers get rows back.
        await w.findComponent(DataTable).vm.$emit('update:expandedRows', { '2': true });

        expect(w.emitted('update:expandedRows')).toEqual([[[rows[1]]]]);
    });

    it('passes an array of rows to PrimeVue as a dataKey-indexed map', () => {
        const w = mount(AlpClientTable, {
            props: { items: rows, expandedRows: [rows[0]] },
            slots: { default: '<Column expander /><Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        // An array reaches PrimeVue unusable when dataKey is set — it must be a map.
        expect(w.findComponent(DataTable).props('expandedRows')).toEqual({ '1': true });
    });

    it('leaves an object map untouched in both directions', async () => {
        const w = mount(AlpClientTable, {
            props: { items: rows, expandedRows: { '1': true } },
            slots: { default: '<Column expander /><Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        expect(w.findComponent(DataTable).props('expandedRows')).toEqual({ '1': true });

        await w.findComponent(DataTable).vm.$emit('update:expandedRows', { '2': true });

        expect(w.emitted('update:expandedRows')).toEqual([[{ '2': true }]]);
    });

    it('forwards expand and collapse events so callers can lazy-load row detail', async () => {
        const w = mount(AlpClientTable, {
            props: { items: rows, expandedRows: [] },
            slots: { default: '<Column expander /><Column field="name" header="Name" />' },
            global: globalConfig as any
        });

        await w.findComponent(DataTable).vm.$emit('row-expand', { data: rows[0] });
        await w.findComponent(DataTable).vm.$emit('row-collapse', { data: rows[0] });

        expect(w.emitted('rowExpand')).toEqual([[{ data: rows[0] }]]);
        expect(w.emitted('rowCollapse')).toEqual([[{ data: rows[0] }]]);
    });
});
