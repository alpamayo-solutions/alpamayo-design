import { describe, expect, it } from 'vitest';
import { h, type Component } from 'vue';
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import TreeTable from 'primevue/treetable';
import Alpamayo from '../presets/alpamayo';

/**
 * PrimeVue hands a column's pass-through functions the column's vnode props.
 * A `<Column>` written with no attribute (only a slot) has `props === null`,
 * so the preset must not read a field of them unguarded.
 */
const render = (table: Component, props: Record<string, unknown>, columns: () => unknown) =>
    mount(
        { render: () => h(table, props, { default: columns }) },
        {
            global: { plugins: [[PrimeVue, { unstyled: true, pt: Alpamayo }]] }
        }
    );

describe('preset with a column that has no props', () => {
    it('renders a DataTable header and body', () => {
        const wrapper = render(DataTable, { value: [{ name: 'Pump' }] }, () =>
            h(Column, null, {
                header: () => 'Name',
                body: ({ data }: { data: { name: string } }) => data.name
            })
        );

        expect(wrapper.get('th').text()).toContain('Name');
        expect(wrapper.get('td').text()).toBe('Pump');
    });

    it('renders a TreeTable header', () => {
        const wrapper = render(TreeTable, { value: [{ key: '0', data: { name: 'Pump' } }] }, () =>
            h(Column, null, { header: () => 'Name' })
        );

        expect(wrapper.get('th').text()).toContain('Name');
    });

    it('still styles a frozen, sortable column', () => {
        const wrapper = render(DataTable, { value: [{ name: 'Pump' }] }, () =>
            h(Column, { field: 'name', header: 'Name', frozen: true, sortable: true })
        );

        expect(wrapper.get('th').classes()).toEqual(expect.arrayContaining(['sticky', 'cursor-pointer']));
        expect(wrapper.get('td').classes()).toContain('sticky');
    });
});
